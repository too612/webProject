package com.main.app.erp.humen.manager;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.humen.manager.dto.ManagerDto;
import com.main.app.erp.humen.manager.dto.ManagerRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Service("erpHumenManagerService")
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerMapper managerMapper;
    private final ManagerProfilePhotoStorage profilePhotoStorage;
    private static final Set<String> GENDER_CODES = Set.of("M", "F", "O", "U");
    private static final Set<String> SORT_FIELDS = Set.of(
            "employeeNo", "nameKo", "gradeName", "positionName", "deptName",
            "employmentTypeName", "hireDate", "serviceStatusName");

    @Transactional(readOnly = true)
    public Page<ManagerDto.Person> getPersonList(ManagerDto.ListQuery query) {
        if (query.getSortField() == null || query.getSortDirection() == null
                || !SORT_FIELDS.contains(query.getSortField())
                || !Set.of("asc", "desc").contains(query.getSortDirection())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 인사 정렬 조건입니다.");
        }
        Pageable pageable = PageRequest.of(Math.clamp(query.getPage(), 0, Integer.MAX_VALUE),
                Math.clamp(query.getSize(), 1, 100));
        ManagerDto.SearchCondition condition = new ManagerDto.SearchCondition();
        condition.setKeyword(query.getKeyword());
        condition.setDeptCd(query.getDeptCd());
        condition.setGradeCode(query.getGradeCode());
        condition.setPositionCode(query.getPositionCode());
        condition.setEmploymentTypeCode(query.getEmploymentTypeCode());
        condition.setServiceStatusCode(query.getServiceStatusCode());
        condition.setSortField(query.getSortField());
        condition.setSortDirection(query.getSortDirection());
        condition.setOffset(pageable.getOffset());
        condition.setLimit(pageable.getPageSize());

        List<ManagerDto.Person> people = managerMapper.selectPersonList(condition);
        long total = managerMapper.countPersonList(condition);
        return PaginationUtil.toPage(people, pageable, total);
    }

    @Transactional(readOnly = true)
    public ManagerDto.FilterOptions getFilterOptions() {
        ManagerDto.FilterOptions options = new ManagerDto.FilterOptions();
        options.setDepartments(managerMapper.selectDepartmentOptions());
        options.setGrades(managerMapper.selectCodeOptions("102"));
        options.setPositions(managerMapper.selectCodeOptions("103"));
        options.setEmploymentTypes(managerMapper.selectCodeOptions("104"));
        options.setServiceStatuses(managerMapper.selectCodeOptions("101"));
        return options;
    }

    @Transactional(readOnly = true)
    public ManagerDto.PersonDetail getPersonDetail(String employeeNo) {
        ManagerDto.PersonDetail person = managerMapper.selectPersonDetail(employeeNo);
        if (person == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "인사정보를 찾을 수 없습니다.");
        }
        person.setCareers(managerMapper.selectCareerList(person.getPersonKey()));
        person.setAssignments(managerMapper.selectAssignmentList(person.getPersonKey()));
        return person;
    }

    @Transactional
    public void createPerson(ManagerRequest request) {
        if (request == null || request.getEmployeeNo() == null || request.getEmployeeNo().isBlank()
                || request.getNameKo() == null || request.getNameKo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사번과 성명은 필수입니다.");
        }
        String employeeNo = request.getEmployeeNo().trim();
        validateLength(employeeNo, 30, "사번");
        validateLength(request.getNameKo().trim(), 100, "성명");
        validateLength(request.getNameEn() == null ? null : request.getNameEn().trim(), 100, "영문 성명");
        validateLength(request.getNameHanja(), 100, "한자 성명");
        validateLength(request.getDeptCd(), 30, "부서 코드");
        validateLength(request.getGradeCode(), 30, "직급 코드");
        validateLength(request.getPositionCode(), 30, "직위 코드");
        validateLength(request.getEmploymentTypeCode(), 30, "고용형태 코드");
        validateLength(request.getServiceStatusCode(), 30, "재직 상태 코드");
        validateLength(request.getPostalCode(), 10, "우편번호");
        validateLength(request.getAddressLine1(), 255, "주소");
        validateLength(request.getAddressLine2(), 255, "상세 주소");
        validateDate(request.getBirthDate(), "생년월일");
        validateDate(request.getHireDate(), "입사일");
        if (request.getGenderCode() != null && !Set.of("M", "F", "O", "U").contains(request.getGenderCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "성별 코드가 올바르지 않습니다.");
        }
        if (managerMapper.countByEmployeeNo(employeeNo) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 사번입니다.");
        }
        request.setEmployeeNo(employeeNo);
        request.setNameKo(request.getNameKo().trim());
        request.setNameEn(request.getNameEn() == null ? null : request.getNameEn().trim());
        if (request.getServiceStatusCode() == null || request.getServiceStatusCode().isBlank()) {
            request.setServiceStatusCode("101-010");
        }
        managerMapper.insertPerson(request, "SYSTEM");
    }

    /** 기본 인적정보만 수정한다. 발령 연동 항목과 식별자는 변경하지 않는다. */
    @Transactional
    public ManagerDto.PersonDetail setUpdate(String personKey, ManagerDto.BasicInfoUpdate request,
            ManagerDto.Audit audit) {
        if (request == null || request.getNameKo() == null || request.getNameKo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "성명은 필수입니다.");
        }
        request.setNameKo(request.getNameKo().trim());
        request.setNameEn(normalizeOptional(request.getNameEn()));
        request.setNameHanja(normalizeOptional(request.getNameHanja()));
        request.setBirthDate(normalizeOptional(request.getBirthDate()));
        request.setGenderCode(normalizeOptional(request.getGenderCode()));
        request.setPostalCode(normalizeOptional(request.getPostalCode()));
        request.setAddressLine1(normalizeOptional(request.getAddressLine1()));
        request.setAddressLine2(normalizeOptional(request.getAddressLine2()));
        validateLength(request.getNameKo(), 100, "성명");
        validateLength(request.getNameEn(), 100, "영문 성명");
        validateLength(request.getNameHanja(), 100, "한자 성명");
        validateLength(request.getPostalCode(), 10, "우편번호");
        validateLength(request.getAddressLine1(), 255, "주소");
        validateLength(request.getAddressLine2(), 255, "상세 주소");
        validateDate(request.getBirthDate(), "생년월일");
        if (request.getBirthDate() != null && LocalDate.parse(request.getBirthDate()).isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "생년월일은 오늘 이후일 수 없습니다.");
        }
        if (request.getGenderCode() != null && !GENDER_CODES.contains(request.getGenderCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "성별 코드가 올바르지 않습니다.");
        }
        String employeeNo = lockPerson(personKey);
        if (managerMapper.updateBasicInfo(personKey, request, audit) != 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "인사정보가 변경되지 않았습니다. 다시 시도하세요.");
        }
        return getPersonDetail(employeeNo);
    }

    /** 새 사진을 UUID 파일명으로 저장한 뒤 profile_photo_url을 교체한다. 이전 파일은 보존한다. */
    @Transactional
    public ManagerDto.ProfilePhoto setUpdateProfilePhoto(String personKey, MultipartFile file,
            ManagerDto.Audit audit) {
        lockPerson(personKey);
        String url = profilePhotoStorage.store(file);
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCompletion(int status) {
                    if (status != STATUS_COMMITTED) {
                        profilePhotoStorage.deleteQuietly(url);
                    }
                }
            });
        }
        try {
            if (managerMapper.updateProfilePhoto(personKey, url, audit) != 1) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "프로필 사진이 변경되지 않았습니다. 다시 시도하세요.");
            }
        } catch (RuntimeException exception) {
            profilePhotoStorage.deleteQuietly(url);
            throw exception;
        }
        ManagerDto.ProfilePhoto result = new ManagerDto.ProfilePhoto();
        result.setProfilePhotoUrl(url);
        return result;
    }

    /** 프로필 사진 연결만 해제한다. 파일은 물리 삭제하지 않는다. */
    @Transactional
    public ManagerDto.ProfilePhoto delRemoveProfilePhoto(String personKey, ManagerDto.Audit audit) {
        lockPerson(personKey);
        if (managerMapper.updateProfilePhoto(personKey, null, audit) != 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "프로필 사진이 변경되지 않았습니다. 다시 시도하세요.");
        }
        return new ManagerDto.ProfilePhoto();
    }

    private String lockPerson(String personKey) {
        String employeeNo = personKey == null || personKey.isBlank()
                ? null : managerMapper.selectEmployeeNoForUpdate(personKey);
        if (employeeNo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "인사정보를 찾을 수 없습니다.");
        }
        return employeeNo;
    }

    private static String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void validateLength(String value, int max, String label) {
        if (value != null && value.codePointCount(0, value.length()) > max) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + "은(는) " + max + "자 이내로 입력하세요.");
        }
    }

    private void validateDate(String value, String label) {
        if (value == null) return;
        try {
            if (!value.matches("\\d{4}-\\d{2}-\\d{2}") || value.startsWith("0000")
                    || !LocalDate.parse(value).toString().equals(value)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + "에 올바른 날짜를 입력하세요.");
            }
        } catch (DateTimeParseException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + "에 올바른 날짜를 입력하세요.", exception);
        }
    }
}
