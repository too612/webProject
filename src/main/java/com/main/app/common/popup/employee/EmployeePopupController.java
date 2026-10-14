package com.main.app.common.popup.employee;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.popup.employee.dto.EmployeePopupDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common/popup/employee")
@RequiredArgsConstructor
public class EmployeePopupController {
    private final EmployeePopupService service;

    @GetMapping("/context")
    public ApiResponse<EmployeePopupDto.Context> getContext() {
        return ApiResponse.ok(service.getContext());
    }

    @GetMapping
    public ApiResponse<EmployeePopupDto.Result> getInfo(@ModelAttribute EmployeePopupDto.Query query) {
        return ApiResponse.ok(service.getInfo(query));
    }
}
