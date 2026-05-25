package com.main.app.system.log.system;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/system/log/system")
@RequiredArgsConstructor
public class SystemLogController {

    private final SystemLogService systemLogService;

    @GetMapping
    public ApiResponse<Map<String, Object>> getSystemLogList(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword) {
        return ApiResponse.ok(systemLogService.getSystemLogList(page, size, keyword));
    }
}