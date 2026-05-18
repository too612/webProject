package com.main.app.system.controller;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/system")
public class SystemIndexController {

        private static final Map<String, Map<String, SystemPageMeta>> SYSTEM_PAGE_META = Map.of(
                        "user", Map.of(
                                        "manager",
                                        new SystemPageMeta("M_ADM_01_01", "M_ADM_01", "User Manager",
                                                        "/system/user/manager",
                                                        "Manage system user accounts."),
                                        "role",
                                        new SystemPageMeta("M_ADM_01_02", "M_ADM_01", "Role Manager",
                                                        "/system/user/role",
                                                        "Manage role-based menu permissions.")),
                        "config", Map.of(
                                        "code",
                                        new SystemPageMeta("M_ADM_02_01", "M_ADM_02", "Code Manager",
                                                        "/system/config/code",
                                                        "Manage common system codes."),
                                        "menu",
                                        new SystemPageMeta("M_ADM_02_02", "M_ADM_02", "Menu Manager",
                                                        "/system/config/menu",
                                                        "Manage menu access permissions.")),
                        "log", Map.of(
                                        "system",
                                        new SystemPageMeta("M_ADM_03_01", "M_ADM_03", "System Log",
                                                        "/system/log/system",
                                                        "View system event and error logs."),
                                        "audit",
                                        new SystemPageMeta("M_ADM_03_02", "M_ADM_03", "Audit Log", "/system/log/audit",
                                                        "Track user actions and permission changes.")),
                        "backup", Map.of(
                                        "policy",
                                        new SystemPageMeta("M_ADM_04_01", "M_ADM_04", "Backup Policy",
                                                        "/system/backup/policy",
                                                        "Configure backup schedule and retention policy."),
                                        "history",
                                        new SystemPageMeta("M_ADM_04_02", "M_ADM_04", "Backup History",
                                                        "/system/backup/history",
                                                        "Review restore history and outcomes.")));

        private void addSystemPageAttributes(Model model) {
                model.addAttribute("submenu", "Y");
        }

        @GetMapping
        public String index(Model model) {
                model.addAttribute("pageTitle", "System Management");
                return "system/index";
        }

        @GetMapping("/{category}/{page}")
        public String systemPage(@PathVariable("category") String category, @PathVariable("page") String page,
                        Model model) {
                addSystemPageAttributes(model);

                Map<String, SystemPageMeta> categoryPages = SYSTEM_PAGE_META.get(category);
                if (categoryPages == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid system category.");
                }

                SystemPageMeta meta = categoryPages.get(page);
                if (meta == null) {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid system page.");
                }

                model.addAttribute("pageTitle", meta.pageName());
                model.addAttribute("pageDescription", meta.description());
                model.addAttribute("pagePath", meta.path());
                model.addAttribute("menuId", meta.menuId());
                model.addAttribute("parentMenuId", meta.parentMenuId());
                model.addAttribute("topMenuId", "M_ADM");

                return "system/" + category + "/" + page;
        }

        // ===== REST API methods =====

        /**
         * API system page metadata
         */
        @GetMapping("/api/pages")
        @ResponseBody
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

        private record SystemPageMeta(String menuId, String parentMenuId, String pageName, String path,
                        String description) {
        }
}
