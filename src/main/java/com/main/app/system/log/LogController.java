package com.main.app.system.log;

import com.main.app.common.dto.ApiResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller("systemLogController")
@RequestMapping("/system/log")
public class LogController {

    // ===== REST API 메서드 =====

    /**
     * API 시스템 로그 목록 조회
     */
    @GetMapping("/api/log/system")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getSystemLogList(
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

    /**
     * API 감사 로그 목록 조회
     */
    @GetMapping("/api/log/audit")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getAuditLogList(
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
