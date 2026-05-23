package com.main.app.erp.admin;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController("erpAdminController")
@RequestMapping("/api/erp/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/certificate")
    public ApiResponse<Page<AdminDto.Certificate>> certificate(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(adminService.getCertificateList(page, keyword));
    }

    @GetMapping("/approval")
    public ApiResponse<Page<AdminDto.Approval>> approval(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(adminService.getApprovalList(page, keyword));
    }

    @GetMapping("/minutes")
    public ApiResponse<Page<AdminDto.Minutes>> minutes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(adminService.getMinutesList(page, keyword));
    }

    @GetMapping("/archive")
    public ApiResponse<Page<AdminDto.Archive>> archive(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(adminService.getArchiveList(page, keyword));
    }
}
