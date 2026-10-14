package com.main.app.common.popup.department;

import com.main.app.common.popup.department.dto.DepartmentPopupDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentPopupService {
    private final DepartmentPopupMapper mapper;

    public List<DepartmentPopupDto.Reorganization> getReorganizations() {
        return mapper.selectReorganizations();
    }

    public DepartmentPopupDto.Result getInfo(String reorgKey, String deptCd, String deptNm, boolean exactCode) {
        String key = normalize(reorgKey, 80);
        String code = normalize(deptCd, 30);
        String name = normalize(deptNm, 200);
        DepartmentPopupDto.Reorganization reorganization;
        if (key.isEmpty()) {
            var reorganizations = mapper.selectReorganizations();
            if (reorganizations.isEmpty()) {
                return new DepartmentPopupDto.Result(null, List.of(), 0);
            }
            reorganization = reorganizations.getFirst();
        } else {
            reorganization = mapper.selectReorganization(key);
            if (reorganization == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "조직개편 정보를 찾을 수 없습니다.");
            }
        }
        var departments = mapper.selectDepartments(reorganization.getReorgKey(), code, name, exactCode);
        long matches = departments.stream().filter(department -> department.isMatched()).count();
        return new DepartmentPopupDto.Result(reorganization, departments, matches);
    }

    private String normalize(String value, int maxLength) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.length() > maxLength) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "검색조건의 최대 길이를 초과했습니다.");
        }
        return normalized;
    }
}
