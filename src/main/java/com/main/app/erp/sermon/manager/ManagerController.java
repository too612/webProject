package com.main.app.erp.sermon.manager;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.sermon.manager.dto.ManagerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpSermonManagerController")
@RequestMapping("/api/erp/sermon/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping
    public ApiResponse<Page<ManagerDto.Worship>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(managerService.getManagerList(page, keyword));
    }
}
