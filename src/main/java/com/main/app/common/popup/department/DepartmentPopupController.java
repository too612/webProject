package com.main.app.common.popup.department;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.popup.department.dto.DepartmentPopupDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common/popup/department")
@RequiredArgsConstructor
public class DepartmentPopupController {
    private final DepartmentPopupService service;

    @GetMapping("/reorganizations")
    public ApiResponse<List<DepartmentPopupDto.Reorganization>> getReorganizations() {
        return ApiResponse.ok(service.getReorganizations());
    }

    @GetMapping
    public ApiResponse<DepartmentPopupDto.Result> getInfo(
            @RequestParam(required = false) String reorgKey,
            @RequestParam(required = false) String deptCd,
            @RequestParam(required = false) String deptNm,
            @RequestParam(defaultValue = "false") boolean exactCode) {
        return ApiResponse.ok(service.getInfo(reorgKey, deptCd, deptNm, exactCode));
    }
}
