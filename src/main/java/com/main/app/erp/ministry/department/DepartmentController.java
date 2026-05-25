package com.main.app.erp.ministry.department;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.ministry.department.dto.DepartmentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpMinistryDepartmentController")
@RequestMapping("/api/erp/ministry/department")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ApiResponse<Page<DepartmentDto.Department>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(departmentService.getDepartmentList(page, keyword));
    }
}
