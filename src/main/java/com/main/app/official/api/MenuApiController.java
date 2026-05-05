package com.main.app.official.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.MenuDto;
import com.main.app.common.service.MenuService;

@RestController
@RequestMapping("/api/menu")
public class MenuApiController {

    private final MenuService menuService;

    public MenuApiController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/hierarchical")
    public ApiResponse<List<MenuDto>> getHierarchicalMenus(
            @RequestParam(name = "systemType", defaultValue = "official") String systemType) {
        return ApiResponse.ok(menuService.getHierarchicalMenus(systemType));
    }

    @GetMapping("/top")
    public ApiResponse<List<MenuDto>> getTopMenus(
            @RequestParam(name = "systemType", defaultValue = "official") String systemType) {
        return ApiResponse.ok(menuService.getTopLevelMenus(systemType));
    }

    @GetMapping("/path")
    public ApiResponse<MenuDto> findMenuByPath(
            @RequestParam("path") String path,
            @RequestParam(name = "systemType", defaultValue = "official") String systemType) {
        return ApiResponse.ok(menuService.findMenuByPath(path, systemType));
    }

    @GetMapping("/top-menu")
    public ApiResponse<MenuDto> findTopMenuByPath(
            @RequestParam("path") String path,
            @RequestParam(name = "systemType", defaultValue = "official") String systemType) {
        return ApiResponse.ok(menuService.findTopMenuByPath(path, systemType));
    }
}