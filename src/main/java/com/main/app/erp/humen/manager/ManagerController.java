package com.main.app.erp.humen.manager;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.humen.manager.dto.ManagerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpHumenManagerController")
@RequestMapping("/api/erp/humen/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping
    public ApiResponse<Page<ManagerDto.Member>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(managerService.getMemberList(page, keyword));
    }
}
