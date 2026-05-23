package com.main.app.common.menu;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.menu.dto.MenuDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

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
