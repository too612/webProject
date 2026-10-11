package com.main.app.erp.humen.organization;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.humen.organization.dto.OrganizationDto;
import com.main.app.erp.humen.organization.dto.OrganizationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service("erpHumenOrganizationService")
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationMapper organizationMapper;

    @Transactional(readOnly = true)
    public Page<OrganizationDto.Reorg> getReorgList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.clamp(size, 1, 100));
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<OrganizationDto.Reorg> list = organizationMapper.selectReorgList(keyword, offset, limit);
        long total = organizationMapper.countReorgList(keyword);
        return PaginationUtil.toPage(list, pageable, total);
    }

    @Transactional(readOnly = true)
    public OrganizationDto.ReorgDetail getReorg(String reorgKey) {
        OrganizationDto.ReorgDetail reorg = organizationMapper.selectReorg(reorgKey);
        if (reorg == null) throw notFound("조직개편안을 찾을 수 없습니다.");
        reorg.setDepartments(organizationMapper.selectDepartmentList(reorgKey));
        reorg.setHistories(organizationMapper.selectDepartmentHistory(reorgKey));
        return reorg;
    }

    @Transactional(readOnly = true)
    public OrganizationDto.ReorgDetail getActiveReorg(String baseDate) {
        LocalDate date = parseDate(baseDate, LocalDate.now(), "기준일");
        String reorgKey = organizationMapper.selectActiveReorgKey(date.toString());
        return reorgKey == null ? null : getReorg(reorgKey);
    }

    @Transactional
    public OrganizationDto.ReorgDetail createReorg(OrganizationRequest.ReorgCreate request, String userId) {
        require(request != null, "조직개편 정보를 입력하세요.");
        LocalDate reorgDate = parseDate(request.getReorgDt(), null, "조직개편일");
        if (organizationMapper.countReorgByDate(request.getReorgDt()) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "같은 조직개편일의 개편안이 이미 있습니다.");
        }
        String sourceReorgKey = organizationMapper.selectActiveReorgKey(reorgDate.toString());
        String key = organizationMapper.insertReorg(request, userId);
        if (sourceReorgKey != null) {
            organizationMapper.cloneDepartments(sourceReorgKey, key, userId);
        }
        return getReorg(key);
    }

    @Transactional
    public void addDepartment(String reorgKey, OrganizationRequest.DepartmentCreate request, String userId) {
        OrganizationDto.ReorgDetail reorg = editableReorg(reorgKey);
        require(request != null && request.getDeptNm() != null && !request.getDeptNm().isBlank(),
                "부서명은 필수입니다.");
        String deptCd = organizationMapper.nextDepartmentCode();
        int level = 1;
        if (request.getParentDeptKey() != null && !request.getParentDeptKey().isBlank()) {
            OrganizationDto.Department parent = findDepartment(reorg.getDepartments(), request.getParentDeptKey());
            level = parent.getDeptLevel() + 1;
        }
        int sortOrder = organizationMapper.nextSiblingSortOrder(reorgKey, request.getParentDeptKey());
        organizationMapper.insertDepartment(reorgKey, request, deptCd, level, sortOrder, userId);
        OrganizationDto.Department created = getReorg(reorgKey).getDepartments().stream()
                .filter(department -> deptCd.equals(department.getDeptCd())).findFirst()
                .orElseThrow(() -> new IllegalStateException("등록된 부서를 조회할 수 없습니다."));
        insertHistory(reorgKey, created, created, "NEW", "부서를 추가했습니다.", userId);
    }

    @Transactional
    public void updateDepartment(String reorgKey, String deptKey,
            OrganizationRequest.DepartmentUpdate request, String userId) {
        OrganizationDto.ReorgDetail reorg = editableReorg(reorgKey);
        OrganizationDto.Department department = findDepartment(reorg.getDepartments(), deptKey);
        require(request != null && request.getDeptNm() != null && !request.getDeptNm().isBlank(),
                "부서명은 필수입니다.");
        if (organizationMapper.updateDepartment(reorgKey, deptKey, request, userId) != 1) {
            throw notFound("부서를 찾을 수 없습니다.");
        }
        insertHistory(reorgKey, department, department, "UPDATE", "부서 정보를 수정했습니다.", userId);
    }

    @Transactional
    public void changeParent(String reorgKey, String deptKey, String parentDeptKey, String userId) {
        organizationMapper.lockReorg(reorgKey);
        OrganizationDto.ReorgDetail reorg = editableReorg(reorgKey);
        String normalizedParentKey = parentDeptKey == null || parentDeptKey.isBlank() ? null : parentDeptKey;
        OrganizationDto.Department department = findDepartment(reorg.getDepartments(), deptKey);
        if (Objects.equals(department.getParentDeptKey(), normalizedParentKey)) return;
        int targetIndex = siblings(reorg.getDepartments(), normalizedParentKey, deptKey).size();
        OrganizationRequest.DepartmentPlacement request = new OrganizationRequest.DepartmentPlacement();
        request.setParentDeptKey(normalizedParentKey);
        request.setTargetIndex(targetIndex);
        moveDepartment(reorg, deptKey, request, userId);
    }

    @Transactional
    public void moveDepartment(String reorgKey, String deptKey,
            OrganizationRequest.DepartmentPlacement request, String userId) {
        organizationMapper.lockReorg(reorgKey);
        moveDepartment(editableReorg(reorgKey), deptKey, request, userId);
    }

    private void moveDepartment(OrganizationDto.ReorgDetail reorg, String deptKey,
            OrganizationRequest.DepartmentPlacement request, String userId) {
        require(request != null && request.getTargetIndex() != null && request.getTargetIndex() >= 0,
                "이동할 위치가 올바르지 않습니다.");
        OrganizationDto.Department department = findDepartment(reorg.getDepartments(), deptKey);
        String parentKey = request.getParentDeptKey() == null || request.getParentDeptKey().isBlank()
                ? null : request.getParentDeptKey();
        if (deptKey.equals(parentKey)) throw badRequest("자기 자신을 상위 부서로 지정할 수 없습니다.");
        OrganizationDto.Department parent = parentKey == null
                ? null : findDepartment(reorg.getDepartments(), parentKey);
        if (parent != null && isDescendant(reorg.getDepartments(), parent.getDeptKey(), deptKey)) {
            throw badRequest("하위 부서를 상위 부서로 지정할 수 없습니다.");
        }

        List<OrganizationDto.Department> currentSiblings =
                siblings(reorg.getDepartments(), department.getParentDeptKey(), null);
        int oldIndex = currentSiblings.indexOf(department);
        List<OrganizationDto.Department> targetSiblings =
                siblings(reorg.getDepartments(), parentKey, deptKey);
        int targetIndex = Math.min(request.getTargetIndex(), targetSiblings.size());
        if (Objects.equals(department.getParentDeptKey(), parentKey) && oldIndex == targetIndex) return;

        if (!Objects.equals(department.getParentDeptKey(), parentKey)) {
            List<OrganizationDto.Department> remainingOldSiblings =
                    siblings(reorg.getDepartments(), department.getParentDeptKey(), deptKey);
            updateSiblingOrders(reorg.getReorgKey(), remainingOldSiblings, userId);
        }

        targetSiblings.add(targetIndex, department);
        int newLevel = parent == null ? 1 : parent.getDeptLevel() + 1;
        int levelDelta = newLevel - department.getDeptLevel();
        for (int index = 0; index < targetSiblings.size(); index++) {
            OrganizationDto.Department sibling = targetSiblings.get(index);
            int sortOrder = index + 1;
            if (sibling == department) {
                if (organizationMapper.updateDepartmentPlacement(
                        reorg.getReorgKey(), deptKey, parentKey, newLevel, sortOrder, userId) != 1) {
                    throw notFound("부서를 찾을 수 없습니다.");
                }
            } else if (sibling.getSortOrder() != sortOrder
                    && organizationMapper.updateDepartmentSortOrder(
                            reorg.getReorgKey(), sibling.getDeptKey(), sortOrder, userId) != 1) {
                throw new IllegalStateException("형제 부서 순서를 갱신할 수 없습니다.");
            }
        }
        if (levelDelta != 0) {
            organizationMapper.updateDescendantLevels(reorg.getReorgKey(), deptKey, levelDelta, userId);
        }

        OrganizationDto.Department changed = new OrganizationDto.Department();
        changed.setDeptKey(department.getDeptKey());
        changed.setDeptCd(department.getDeptCd());
        changed.setDeptLevel(newLevel);
        String note = Objects.equals(department.getParentDeptKey(), parentKey)
                ? "동일 레벨 내 순서를 변경했습니다. (" + (oldIndex + 1) + " → " + (targetIndex + 1) + ")"
                : "상위 부서와 표시 순서를 변경했습니다.";
        insertHistory(reorg.getReorgKey(), department, changed, "MOVE", note, userId);
    }

    @Transactional
    public void removeDepartment(String reorgKey, String deptKey, String userId) {
        OrganizationDto.ReorgDetail reorg = editableReorg(reorgKey);
        OrganizationDto.Department department = findDepartment(reorg.getDepartments(), deptKey);
        require(organizationMapper.countActiveChildren(reorgKey, deptKey) == 0,
                "하위 부서가 있는 부서는 비활성화할 수 없습니다.");
        if (organizationMapper.deactivateDepartment(reorgKey, deptKey, userId) != 1) {
            throw notFound("부서를 찾을 수 없습니다.");
        }
        insertHistory(reorgKey, department, department, "CLOSE", "부서를 비활성화했습니다.", userId);
    }

    @Transactional
    public void confirmReorg(String reorgKey, String userId) {
        OrganizationDto.ReorgDetail reorg = editableReorg(reorgKey);
        require(!reorg.getDepartments().isEmpty(), "부서가 없는 조직개편안은 확정할 수 없습니다.");
        if (organizationMapper.confirmReorg(reorgKey, userId) != 1) {
            throw notFound("조직개편안을 찾을 수 없습니다.");
        }
    }

    private OrganizationDto.ReorgDetail editableReorg(String reorgKey) {
        OrganizationDto.ReorgDetail reorg = getReorg(reorgKey);
        require("N".equals(reorg.getConfYn()) && "Y".equals(reorg.getUseYn()),
                "확정되었거나 비활성화된 조직개편은 수정할 수 없습니다.");
        return reorg;
    }

    private void insertHistory(String reorgKey, OrganizationDto.Department original,
            OrganizationDto.Department changed, String changeType, String note, String userId) {
        organizationMapper.insertDepartmentHistory(reorgKey,
                original.getDeptKey(), changed.getDeptKey(), original.getDeptCd(), original.getDeptLevel(),
                changed.getDeptCd(), changed.getDeptLevel(), changeType, note, userId);
    }

    private OrganizationDto.Department findDepartment(List<OrganizationDto.Department> departments, String key) {
        return departments.stream().filter(department -> key.equals(department.getDeptKey())).findFirst()
                .orElseThrow(() -> notFound("부서를 찾을 수 없습니다."));
    }

    private List<OrganizationDto.Department> siblings(List<OrganizationDto.Department> departments,
            String parentKey, String excludedKey) {
        return departments.stream()
                .filter(department -> Objects.equals(department.getParentDeptKey(), parentKey))
                .filter(department -> !Objects.equals(department.getDeptKey(), excludedKey))
                .sorted(Comparator.comparingInt(OrganizationDto.Department::getSortOrder)
                        .thenComparing(OrganizationDto.Department::getDeptCd))
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
    }

    private void updateSiblingOrders(String reorgKey, List<OrganizationDto.Department> departments,
            String userId) {
        for (int index = 0; index < departments.size(); index++) {
            OrganizationDto.Department department = departments.get(index);
            int sortOrder = index + 1;
            if (department.getSortOrder() != sortOrder
                    && organizationMapper.updateDepartmentSortOrder(
                            reorgKey, department.getDeptKey(), sortOrder, userId) != 1) {
                throw new IllegalStateException("형제 부서 순서를 갱신할 수 없습니다.");
            }
        }
    }

    private boolean isDescendant(List<OrganizationDto.Department> departments, String candidate, String ancestor) {
        String parent = findDepartment(departments, candidate).getParentDeptKey();
        while (parent != null) {
            if (ancestor.equals(parent)) return true;
            parent = findDepartment(departments, parent).getParentDeptKey();
        }
        return false;
    }

    private LocalDate parseDate(String value, LocalDate defaultValue, String fieldName) {
        if (value == null || value.isBlank()) {
            if (defaultValue != null) return defaultValue;
            throw badRequest(fieldName + "은 YYYY-MM-DD 형식으로 입력하세요.");
        }
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException exception) {
            throw badRequest(fieldName + "은 유효한 YYYY-MM-DD 날짜여야 합니다.");
        }
    }

    private void require(boolean condition, String message) {
        if (!condition) throw badRequest(message);
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }
}
