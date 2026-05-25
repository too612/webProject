package com.main.app.erp.account.manager;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.account.manager.dto.ManagerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpManagerController")
@RequestMapping("/api/erp/account/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService accountManagerService;

    @GetMapping
    public ApiResponse<Page<ManagerDto.Offering>> getManagerList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(accountManagerService.getOfferingList(page, keyword));
    }
}

