package com.main.app.erp.humen.personnelmove;

import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.*;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;

@Service("erpHumenPersonnelMoveService")
@RequiredArgsConstructor
public class PersonnelMoveService {
    private static final Set<String> SORTS = Set.of("assignmentDate", "assignmentOrder", "employeeNo",
            "nameKo", "deptCd", "gradeCode", "assignmentTypeCode");
    private static final SecureRandom RANDOM = new SecureRandom();
    private final PersonnelMoveMapper mapper;
    private final AssignmentApplyService applyService;

    @Transactional(readOnly = true)
    public Page<Assignment> getPersonnelMoveList(ListQuery query) {
        validateScope(query.getScope());
        if (query.getSort() == null || query.getDirection() == null
                || !SORTS.contains(query.getSort()) || !Set.of("asc", "desc").contains(query.getDirection())) {
            throw bad("지원하지 않는 정렬 조건입니다.");
        }
        validateCalendar(query.getAssignmentDateFrom());
        validateCalendar(query.getAssignmentDateTo());
        if (query.getAssignmentDateFrom() != null && query.getAssignmentDateTo() != null
                && query.getAssignmentDateFrom().isAfter(query.getAssignmentDateTo())) throw bad("조회 시작일은 종료일 이후일 수 없습니다.");
        PageRequest page = page(query.getPage(), query.getSize());
        query.setOffset(page.getOffset());
        query.setLimit(page.getPageSize());
        query.setToday(applyService.today());
        boolean paused = applyService.isPaused();
        List<Assignment> rows = mapper.selectPersonnelMoveList(query);
        rows.forEach(row -> row.setSyncPaused(paused));
        return new PageImpl<>(rows, page, mapper.countPersonnelMoveList(query));
    }

    @Transactional(readOnly = true)
    public Assignment getInfo(String key) {
        Assignment row = requireAssignment(key);
        row.setSyncPaused(applyService.isPaused());
        return row;
    }

    @Transactional(readOnly = true)
    public Options getOptions() {
        return new Options(mapper.selectCodeOptions("105"), mapper.selectCodeOptions("102"),
                mapper.selectCodeOptions("103"), mapper.selectCodeOptions("104"), mapper.selectCodeOptions("106"));
    }

    @Transactional(readOnly = true)
    public Page<Person> getEmployees(String keyword, int page, int size) {
        PageRequest paging = page(page, size);
        return new PageImpl<>(mapper.selectEmployees(keyword, paging.getOffset(), paging.getPageSize()),
                paging, mapper.countEmployees(keyword));
    }

    @Transactional(readOnly = true)
    public List<Person> getConcurrent(String personKey) {
        return mapper.selectConcurrent(personKey);
    }

    @Transactional
    public Person setCreateConcurrent(ConcurrentRequest request, Audit audit) {
        Person original = requirePerson(request.getPersonKey());
        long suffix = original.getNextConcurrentNumber();
        if (suffix <= 0 || suffix == Long.MAX_VALUE) throw conflict("겸임 사번 생성 한도에 도달했습니다.");
        String employeeNo = original.getEmployeeNo() + "_" + suffix;
        if (employeeNo.length() > 64) throw bad("겸임 사번은 64자 이내여야 합니다.");
        mapper.advanceConcurrentNumber(original.getPersonKey());
        Person row = new Person();
        row.setPersonKey(original.getPersonKey());
        row.setConcurrentKey(key());
        row.setEmployeeNo(employeeNo);
        row.setNameKo(original.getNameKo());
        mapper.insertConcurrent(row, audit);
        return mapper.lockConcurrent(row.getPersonKey(), row.getConcurrentKey());
    }

    @Transactional
    public Assignment setCreate(Assignment row, Audit audit) {
        validate(row);
        Person original = requirePerson(row.getPersonKey());
        Person target = target(original, row.getConcurrentKey());
        Assignment before = effective(row.getPersonKey(), row.getConcurrentKey());
        row.setEmployeeNo(target.getEmployeeNo());
        row.setAssignmentKey(key());
        row.setVersion(0L);
        ensureOrder(row, null);
        mapper.insertAssignment(row, audit);
        applyIfEffectiveChanged(target, row.getConcurrentKey(), before, audit);
        return getInfo(row.getAssignmentKey());
    }

    @Transactional
    public Assignment setUpdate(String key, Assignment row, Audit audit) {
        Assignment snapshot = requireAssignment(key);
        Person original = requirePerson(snapshot.getPersonKey());
        Assignment old = requireAssignment(key);
        if (!Objects.equals(old.getPersonKey(), row.getPersonKey())) {
            throw bad("원본 사람 식별자는 변경할 수 없습니다.");
        }
        validate(row);
        if (row.getVersion() == null || !row.getVersion().equals(old.getVersion())) {
            throw conflict("다른 사용자가 수정한 발령입니다. 다시 조회하세요.");
        }
        AssignmentRules.historical(old, row.isHistoricalEdit(), row.getHistoricalReason(), applyService.today());
        List<Assignment> previous = mapper.selectTargetAssignments(old.getPersonKey(), old.getConcurrentKey());
        Assignment previousEffective = AssignmentRules.effective(previous, applyService.today());
        AssignmentRules.guardHistoricalPromotion(old, row, previousEffective, applyService.today());
        Person oldTarget = target(original, old.getConcurrentKey());
        Person newTarget = target(original, row.getConcurrentKey());
        Assignment newPreviousEffective = Objects.equals(old.getConcurrentKey(), row.getConcurrentKey())
                ? previousEffective : effective(row.getPersonKey(), row.getConcurrentKey());
        row.setAssignmentKey(key);
        row.setEmployeeNo(newTarget.getEmployeeNo());
        ensureOrder(row, key);
        if (!Objects.equals(old.getConcurrentKey(), row.getConcurrentKey())
                || (previousEffective != null && Objects.equals(previousEffective.getAssignmentKey(), key)
                    && row.getAssignmentDate().isAfter(applyService.today()))) {
            AssignmentRules.deletion(previous.stream().filter(item -> !item.getAssignmentKey().equals(key)).toList(),
                    applyService.today());
        }
        if (mapper.updateAssignment(row, audit) != 1) throw conflict("발령 수정 충돌입니다.");
        applyIfEffectiveChanged(oldTarget, old.getConcurrentKey(), previousEffective, audit);
        if (!Objects.equals(old.getConcurrentKey(), row.getConcurrentKey())) {
            applyIfEffectiveChanged(newTarget, row.getConcurrentKey(), newPreviousEffective, audit);
        }
        return getInfo(key);
    }

    @Transactional
    public void delRemove(String key, long version, boolean historicalEdit, String historicalReason, Audit audit) {
        Assignment snapshot = requireAssignment(key);
        Person original = requirePerson(snapshot.getPersonKey());
        Assignment old = requireAssignment(key);
        if (old.getVersion() != version) throw conflict("다른 사용자가 수정한 발령입니다. 다시 조회하세요.");
        AssignmentRules.historical(old, historicalEdit, historicalReason, applyService.today());
        Person target = target(original, old.getConcurrentKey());
        Assignment before = effective(old.getPersonKey(), old.getConcurrentKey());
        AssignmentRules.deletion(mapper.selectTargetAssignments(old.getPersonKey(), old.getConcurrentKey())
                .stream().filter(item -> !item.getAssignmentKey().equals(key)).toList(), applyService.today());
        if (mapper.deleteAssignment(key, version, historicalReason, audit) != 1) throw conflict("발령 삭제 충돌입니다.");
        applyIfEffectiveChanged(target, old.getConcurrentKey(), before, audit);
    }

    private Assignment effective(String personKey, String concurrentKey) {
        return AssignmentRules.effective(mapper.selectTargetAssignments(personKey, concurrentKey), applyService.today());
    }

    private void applyIfEffectiveChanged(Person master, String concurrentKey, Assignment before, Audit audit) {
        Assignment after = effective(master.getPersonKey(), concurrentKey);
        if (after != null && (before == null || !Objects.equals(before.getAssignmentKey(), after.getAssignmentKey())
                || !Objects.equals(before.getVersion(), after.getVersion()))) {
            applyService.applyLocked(master, concurrentKey, audit);
        }
    }

    private void ensureOrder(Assignment row, String exceptKey) {
        boolean duplicate = mapper.selectTargetAssignments(row.getPersonKey(), row.getConcurrentKey()).stream()
                .anyMatch(other -> !Objects.equals(other.getAssignmentKey(), exceptKey)
                        && other.getAssignmentDate().equals(row.getAssignmentDate())
                        && other.getAssignmentOrder().equals(row.getAssignmentOrder()));
        if (duplicate) throw conflict("같은 대상/발령일의 처리 순서는 중복될 수 없습니다.");
    }

    private Person target(Person original, String concurrentKey) {
        if (concurrentKey == null) return original;
        Person target = mapper.lockConcurrent(original.getPersonKey(), concurrentKey);
        if (target == null) throw bad("원본 사람에 속하는 겸임 마스터를 선택하세요.");
        return target;
    }

    private Person requirePerson(String personKey) {
        if (personKey == null || personKey.isBlank()) throw bad("원본 사람을 선택하세요.");
        Person original = mapper.lockPerson(personKey);
        if (original == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사람을 찾을 수 없습니다.");
        return original;
    }

    private Assignment requireAssignment(String key) {
        Assignment row = mapper.selectAssignment(key, applyService.today());
        if (row == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "발령을 찾을 수 없습니다.");
        return row;
    }

    private void validate(Assignment row) {
        validateScope(row.getScope());
        row.setConcurrentKey(blank(row.getConcurrentKey()));
        if ("main".equals(row.getScope()) != (row.getConcurrentKey() == null)) throw bad("발령 범위와 대상을 확인하세요.");
        if (row.getAssignmentDate() == null || row.getAssignmentDate().getYear() < 1
                || row.getAssignmentDate().getYear() > 9999) throw bad("올바른 발령일을 입력하세요.");
        if (row.getAssignmentOrder() == null || row.getAssignmentOrder() <= 0) throw bad("처리 순서는 양수여야 합니다.");
        row.setDeptCd(blank(row.getDeptCd()));
        row.setGradeCode(blank(row.getGradeCode()));
        row.setPositionCode(blank(row.getPositionCode()));
        row.setEmploymentTypeCode(blank(row.getEmploymentTypeCode()));
        row.setJobTitleCode(blank(row.getJobTitleCode()));
        row.setDispatchCountryCode(blank(row.getDispatchCountryCode()));
        length(row.getDeptCd(), 30, "부서코드");
        length(row.getAssignmentContent(), 20000, "발령 내용");
        length(row.getRemark(), 4000, "비고");
        length(row.getHistoricalReason(), 4000, "과거 수정 사유");
        if (row.getDeptCd() == null || !mapper.departmentExists(row.getDeptCd())) throw bad("유효한 조직 부서코드를 직접 입력하세요.");
        validateCode(row.getGradeCode(), "102", true);
        validateCode(row.getAssignmentTypeCode(), "105", true);
        validateCode(row.getPositionCode(), "103", false);
        validateCode(row.getEmploymentTypeCode(), "104", false);
        validateCode(row.getJobTitleCode(), "106", false);
        if (row.getDispatchCountryCode() != null && !mapper.countryExists(row.getDispatchCountryCode())) throw bad("유효한 파견 국가코드를 입력하세요.");
        if (row.getAssignmentEndDate() != null && row.getAssignmentEndDate().isBefore(row.getAssignmentDate())) throw bad("종료일은 발령일 이전일 수 없습니다.");
    }

    private void validateCode(String code, String category, boolean required) {
        if ((required && code == null) || (code != null && !mapper.codeExists(code, category))) throw bad("유효한 " + category + " 코드를 선택하세요.");
    }

    private static void validateScope(String scope) {
        if (scope == null || !Set.of("main", "concurrent").contains(scope)) throw bad("발령 범위는 main 또는 concurrent입니다.");
    }

    private static void length(String value, int max, String label) {
        if (value != null && value.codePointCount(0, value.length()) > max) throw bad(label + "은 " + max + "자 이내여야 합니다.");
    }
    private static void validateCalendar(java.time.LocalDate value) {
        if (value != null && (value.getYear() < 1 || value.getYear() > 9999)) throw bad("조회일은 올바른 달력 날짜여야 합니다.");
    }
    private static PageRequest page(int page, int size) {
        if (page < 0 || size < 1 || size > 100) throw bad("page는 0 이상, size는 1~100이어야 합니다.");
        return PageRequest.of(page, size);
    }

    private static String blank(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private static String key() {
        byte[] bytes = new byte[40];
        RANDOM.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }
    private static ResponseStatusException bad(String message) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, message); }
    private static ResponseStatusException conflict(String message) { return new ResponseStatusException(HttpStatus.CONFLICT, message); }
}
