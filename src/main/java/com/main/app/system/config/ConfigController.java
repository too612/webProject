package com.main.app.system.config;

import com.main.app.common.dto.ApiResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller("systemConfigController")
@RequestMapping("/system/config")
public class ConfigController {

    private void addPageAttributes(Model model) {
        model.addAttribute("submenu", "Y");
    }

    @GetMapping("/code")
    public String codePage(Model model) {
        addPageAttributes(model);
        return "system/config/code";
    }

    @GetMapping("/menu")
    public String menuPage(Model model) {
        addPageAttributes(model);
        return "system/config/menu";
    }

    // ===== REST API 메서드 =====

    /**
     * API 코드 목록 조회
     */
    @GetMapping("/api/config/codes")
    @ResponseBody
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

    /**
     * API 메뉴 목록 조회
     */
    @GetMapping("/api/config/menus")
    @ResponseBody
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
}
