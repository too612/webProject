package com.main.app.official.controller;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.MenuDto;
import com.main.app.common.service.MenuService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class MainController {

    private final MenuService menuService;

    public MainController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/")
    public String index(Model model, HttpServletRequest request) {

        // List<Map<String,String>> list1 = menuService.getList1(request);
        // model.addAttribute("newsList", list1);

        // List<Map<String,String>> list2 = menuService.getList2(request);
        // model.addAttribute("inquiryList", list2);

        return "official/index";
    }

    // ===== REST API 메서드 (MenuController에서 통합) =====

    /**
     * API 계층형 메뉴 조회
     */
    @GetMapping("/api/menu/hierarchical")
    @ResponseBody
    public ApiResponse<List<MenuDto>> getHierarchicalMenus(
            @RequestParam(name = "systemType", defaultValue = "official") String systemType) {
        return ApiResponse.ok(menuService.getHierarchicalMenus(systemType));
    }

    /**
     * API 최상위 메뉴 조회
     */
    @GetMapping("/api/menu/top")
    @ResponseBody
    public ApiResponse<List<MenuDto>> getTopMenus(
            @RequestParam(name = "systemType", defaultValue = "official") String systemType) {
        return ApiResponse.ok(menuService.getTopLevelMenus(systemType));
    }

    /**
     * API 경로로 메뉴 조회
     */
    @GetMapping("/api/menu/path")
    @ResponseBody
    public ApiResponse<MenuDto> findMenuByPath(
            @RequestParam("path") String path,
            @RequestParam(name = "systemType", defaultValue = "official") String systemType) {
        return ApiResponse.ok(menuService.findMenuByPath(path, systemType));
    }

    /**
     * API 최상위 메뉴 조회 (경로 기반)
     */
    @GetMapping("/api/menu/top-menu")
    @ResponseBody
    public ApiResponse<MenuDto> findTopMenuByPath(
            @RequestParam("path") String path,
            @RequestParam(name = "systemType", defaultValue = "official") String systemType) {
        return ApiResponse.ok(menuService.findTopMenuByPath(path, systemType));
    }
}
