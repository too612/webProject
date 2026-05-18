package com.main.app.system.backup;

import com.main.app.common.dto.ApiResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller("systemBackupController")
@RequestMapping("/system/backup")
public class BackupController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/policy")
    public String policyPage(Model model) {
        addPageAttributes(model);
        return "system/backup/policy";
    }

    @GetMapping("/history")
    public String historyPage(Model model) {
        addPageAttributes(model);
        return "system/backup/history";
    }

    // ===== REST API 메서드 =====

    /**
     * API 백업 정책 목록 조회
     */
    @GetMapping("/api/backup/policy")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getBackupPolicyList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    /**
     * API 백업 이력 목록 조회
     */
    @GetMapping("/api/backup/history")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getBackupHistoryList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }
}
