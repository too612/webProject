package com.main.app.erp.admin.approval;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.admin.approval.dto.ApprovalDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpApprovalController")
@RequestMapping("/api/erp/admin/approval")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService adminApprovalService;

    @GetMapping
    public ApiResponse<Page<ApprovalDto.Approval>> getApprovalList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(adminApprovalService.getApprovalList(page, keyword));
    }
}

