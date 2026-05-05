package com.main.app.system.api;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/system")
public class SystemApiController {

        @GetMapping("/pages")
        public ApiResponse<Map<String, List<PageMetaDto>>> getPages() {
                return ApiResponse.ok(Map.of(
                                "user", List.of(
                                                new PageMetaDto("사용자관리", "/system/user/manager", "system",
                                                                "system/user/manager"),
                                                new PageMetaDto("권한관리", "/system/user/role", "system",
                                                                "system/user/role")),
                                "config", List.of(
                                                new PageMetaDto("메뉴관리", "/system/config/menu", "system",
                                                                "system/config/menu"),
                                                new PageMetaDto("코드관리", "/system/config/code", "system",
                                                                "system/config/code")),
                                "log", List.of(
                                                new PageMetaDto("시스템로그", "/system/log/system", "system",
                                                                "system/log/system"),
                                                new PageMetaDto("감사로그", "/system/log/audit", "system",
                                                                "system/log/audit")),
                                "backup", List.of(
                                                new PageMetaDto("백업정책", "/system/backup/policy", "system",
                                                                "system/backup/policy"),
                                                new PageMetaDto("복구이력", "/system/backup/history", "system",
                                                                "system/backup/history"))));
        }

        // ── 사용자 관리 ──────────────────────────────────────────────
        @GetMapping("/user/list")
        public ApiResponse<Map<String, Object>> getUserList(
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

        @GetMapping("/user/roles")
        public ApiResponse<Map<String, Object>> getRoleList(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ApiResponse.ok(Map.of(
                                "content", List.of(),
                                "totalElements", 0,
                                "totalPages", 0,
                                "number", page,
                                "size", size));
        }

        // ── 설정 관리 ────────────────────────────────────────────────
        @GetMapping("/config/codes")
        public ApiResponse<Map<String, Object>> getCodeList(
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

        @GetMapping("/config/menus")
        public ApiResponse<Map<String, Object>> getMenuList(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ApiResponse.ok(Map.of(
                                "content", List.of(),
                                "totalElements", 0,
                                "totalPages", 0,
                                "number", page,
                                "size", size));
        }

        // ── 로그 관리 ────────────────────────────────────────────────
        @GetMapping("/log/system")
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

        @GetMapping("/log/audit")
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

        // ── 백업 관리 ────────────────────────────────────────────────
        @GetMapping("/backup/policy")
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

        @GetMapping("/backup/history")
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