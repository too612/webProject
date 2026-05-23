package com.main.app.system.controller;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/system")
public class SystemIndexController {

        // ===== REST API methods =====

        /**
         * API system page metadata
         */
        @GetMapping("/api/pages")
        public ApiResponse<Map<String, List<PageMetaDto>>> getPages() {
                return ApiResponse.ok(Map.of(
                                "user", List.of(
                                                new PageMetaDto("User Manager", "/system/user/manager", "system",
                                                                "system/user/manager"),
                                                new PageMetaDto("Role Manager", "/system/user/role", "system",
                                                                "system/user/role")),
                                "config", List.of(
                                                new PageMetaDto("Menu Manager", "/system/config/menu", "system",
                                                                "system/config/menu"),
                                                new PageMetaDto("Code Manager", "/system/config/code", "system",
                                                                "system/config/code")),
                                "log", List.of(
                                                new PageMetaDto("System Log", "/system/log/system", "system",
                                                                "system/log/system"),
                                                new PageMetaDto("Audit Log", "/system/log/audit", "system",
                                                                "system/log/audit")),
                                "backup", List.of(
                                                new PageMetaDto("Backup Policy", "/system/backup/policy", "system",
                                                                "system/backup/policy"),
                                                new PageMetaDto("Backup History", "/system/backup/history", "system",
                                                                "system/backup/history"))));
        }
}
