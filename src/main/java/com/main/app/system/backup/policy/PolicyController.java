package com.main.app.system.backup.policy;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/system/backup/policy")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @GetMapping
    public ApiResponse<Map<String, Object>> getPolicyList(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ApiResponse.ok(policyService.getPolicyList(page, size));
    }
}