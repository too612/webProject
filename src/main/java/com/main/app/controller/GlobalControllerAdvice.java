package com.main.app.controller;

import com.main.app.model.MenuDto;
import com.main.app.service.MenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalControllerAdvice {

    private static final Logger log = LoggerFactory.getLogger(GlobalControllerAdvice.class);

    @Autowired
    private MenuService menuService;

    /**
     * 모든 페이지에서 사용할 계층구조 메뉴 리스트
     */
    @ModelAttribute("menuList")
    public List<MenuDto> menuList() {
        return menuService.getHierarchicalMenus();
    }

    /**
     * 최상위 메뉴 이름들만 추출
     */
    @ModelAttribute("topMenuNames")
    public List<String> topMenuNames() {
        return menuService.getHierarchicalMenus().stream()
                .map(MenuDto::getMenuName)
                .collect(Collectors.toList());
    }

    /**
     * 최상위 메뉴 전체 객체들
     */
    @ModelAttribute("topMenuList")
    public List<MenuDto> topMenuList() {
        return menuService.getHierarchicalMenus();
    }

    /**
     * 현재 요청 URI를 기반으로 사이드바 관련 속성들을 동적으로 설정
     */
    @ModelAttribute
    public void addSidebarAttributes(Model model, HttpServletRequest request) {
        String currentUri = request.getRequestURI();
        log.info("==========================================================");
        log.info("현재 요청 URI (currentUri): {}", currentUri);
        log.info("----------------------------------------------------------");

        // 현재 경로로 메뉴 찾기
        MenuDto currentMenu = menuService.findMenuByPath(currentUri);
        if (currentMenu == null) {
            log.warn(">>> 현재 URI에 해당하는 메뉴를 찾을 수 없습니다: {}", currentUri);
            log.info("==========================================================");
            return;
        }

        log.info("현재 메뉴: {}", currentMenu.getMenuName());

        // 최상위 부모 메뉴 찾기
        MenuDto topMenu = menuService.findTopMenuByPath(currentUri);
        if (topMenu == null) {
            log.warn(">>> 최상위 메뉴를 찾을 수 없습니다.");
            log.info("==========================================================");
            return;
        }

        // 계층구조 메뉴에서 하위 메뉴들을 포함한 전체 정보 가져오기
        List<MenuDto> hierarchicalMenus = menuService.getHierarchicalMenus();
        MenuDto fullTopMenu = hierarchicalMenus.stream()
                .filter(menu -> menu.getMenuId().equals(topMenu.getMenuId()))
                .findFirst()
                .orElse(topMenu);

        // 하위 메뉴들의 active 상태 설정
        fullTopMenu.getSubMenus().forEach(subMenu -> {
            boolean isActive = currentUri.equals(subMenu.getPath());
            subMenu.setActive(isActive);
            log.info("서브메뉴 '{}' active 상태: {}", subMenu.getMenuName(), isActive);
        });

        // 모델에 속성 추가
        model.addAttribute("currentMainMenuName", fullTopMenu.getMenuName());
        model.addAttribute("currentSubMenus", fullTopMenu.getSubMenus());
        model.addAttribute("currentTopMenu", fullTopMenu);
        model.addAttribute("currentMenu", currentMenu);
        model.addAttribute("currentPath", currentUri);

        // 모든 최상위 메뉴 정보
        model.addAttribute("allTopMenuNames", hierarchicalMenus.stream()
                .map(MenuDto::getMenuName)
                .collect(Collectors.toList()));
        model.addAttribute("allTopMenus", hierarchicalMenus);

        log.info("currentMainMenuName: {}", fullTopMenu.getMenuName());
        log.info("currentSubMenus: {}", fullTopMenu.getSubMenus());
        log.info("currentTopMenu: {}", fullTopMenu);
        log.info("allTopMenuNames: {}", model.getAttribute("allTopMenuNames"));
        log.info("==========================================================");
    }
}