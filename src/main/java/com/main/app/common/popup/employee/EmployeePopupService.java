package com.main.app.common.popup.employee;

import com.main.app.common.popup.employee.dto.EmployeePopupDto;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeePopupService {
    private static final Set<String> SORT_FIELDS = Set.of(
            "employeeNo", "nameKo", "deptName", "gradeName", "positionName", "serviceStatusName");
    private final EmployeePopupMapper mapper;

    public EmployeePopupDto.Context getContext() {
        var reorganization = getReorganization("");
        return new EmployeePopupDto.Context(reorganization,
                mapper.selectDepartments(reorganization.getReorgKey()),
                mapper.selectCodes("102"), mapper.selectCodes("103"), mapper.selectCodes("101"));
    }

    public EmployeePopupDto.Result getInfo(EmployeePopupDto.Query query) {
        query.setReorgKey(normalize(query.getReorgKey(), 80));
        query.setPersonKey(normalize(query.getPersonKey(), 80));
        query.setNameKo(normalize(query.getNameKo(), 100));
        query.setEmployeeNo(normalize(query.getEmployeeNo(), 30));
        query.setDeptCd(normalize(query.getDeptCd(), 30));
        query.setDeptName(normalize(query.getDeptName(), 200));
        query.setGradeCode(normalize(query.getGradeCode(), 30));
        query.setPositionCode(normalize(query.getPositionCode(), 30));
        query.setServiceStatusCode(normalize(query.getServiceStatusCode(), 30));
        query.setSortField(normalize(query.getSortField(), 30));
        query.setSortDirection(normalize(query.getSortDirection(), 4));
        if (query.getPage() < 0 || query.getSize() < 1 || query.getSize() > 100
                || (!query.getSortField().isEmpty() && !SORT_FIELDS.contains(query.getSortField()))
                || (!query.getSortDirection().isEmpty() && !Set.of("asc", "desc").contains(query.getSortDirection()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "직원 조회 범위 또는 정렬조건이 올바르지 않습니다.");
        }
        query.setReorgKey(getReorganization(query.getReorgKey()).getReorgKey());
        long count = mapper.countEmployees(query);
        return new EmployeePopupDto.Result(mapper.selectEmployees(query), count, query.getPage(), query.getSize());
    }

    private EmployeePopupDto.Reorganization getReorganization(String key) {
        var reorganization = mapper.selectReorganization(key);
        if (reorganization == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "현재 적용된 확정·사용 조직개편이 없습니다. 조직개편 정보를 확인하세요.");
        }
        return reorganization;
    }

    private String normalize(String value, int maxLength) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.length() > maxLength) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "검색조건의 최대 길이를 초과했습니다.");
        }
        return normalized;
    }
}
