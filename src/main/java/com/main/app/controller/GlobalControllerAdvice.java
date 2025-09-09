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
     * 모든 페이지에서 사용할 공통 모델 속성을 추가합니다.
     * - 메뉴 관련 속성 (계층 메뉴, 최상위 메뉴 등)
     * - 현재 요청 URI 기반의 사이드바 속성
     * getHierarchicalMenus() 호출을 한 번으로 최적화합니다.
     */
    @ModelAttribute
    public void addCommonAttributes(Model model, HttpServletRequest request) {
        // getHierarchicalMenus()를 한 번만 호출하여 결과를 재사용
        List<MenuDto> hierarchicalMenus = menuService.getHierarchicalMenus();

        // 모든 페이지에서 공통으로 사용하는 메뉴 속성 추가
        // 'topMenuList'와 'allTopMenus'는 템플릿 호환성을 위해 둘 다 추가합니다.
        model.addAttribute("menuList", hierarchicalMenus);
        model.addAttribute("topMenuList", hierarchicalMenus);
        model.addAttribute("allTopMenus", hierarchicalMenus);

        List<String> topMenuNames = hierarchicalMenus.stream()
                .map(MenuDto::getMenuName)
                .collect(Collectors.toList());
        // 'topMenuNames'와 'allTopMenuNames'는 템플릿 호환성을 위해 둘 다 추가합니다.
        model.addAttribute("topMenuNames", topMenuNames);
        model.addAttribute("allTopMenuNames", topMenuNames);

        // 현재 요청 URI를 기반으로 사이드바 관련 속성들을 동적으로 설정
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

        // 계층구조 메뉴에서 하위 메뉴들을 포함한 전체 정보 가져오기 (이미 조회한 hierarchicalMenus 재사용)
        MenuDto fullTopMenu = hierarchicalMenus.stream()
                .filter(menu -> menu.getMenuId().equals(topMenu.getMenuId()))
                .findFirst()
                .orElse(topMenu);

        // 하위 메뉴들의 active 상태 설정
        if (fullTopMenu.getSubMenus() != null) {
            fullTopMenu.getSubMenus().forEach(subMenu -> {
                boolean isActive = currentUri.equals(subMenu.getPath());
                subMenu.setActive(isActive);
                log.info("서브메뉴 '{}' active 상태: {}", subMenu.getMenuName(), isActive);
            });
        }

        // 모델에 속성 추가
        model.addAttribute("currentMainMenuName", fullTopMenu.getMenuName());
        model.addAttribute("currentSubMenus", fullTopMenu.getSubMenus());
        model.addAttribute("currentTopMenu", fullTopMenu);
        model.addAttribute("currentMenu", currentMenu);
        model.addAttribute("currentPath", currentUri);

        log.info("currentMainMenuName: {}", fullTopMenu.getMenuName());
        log.info("currentSubMenus: {}", fullTopMenu.getSubMenus());
        log.info("currentTopMenu: {}", fullTopMenu);
        log.info("allTopMenuNames: {}", topMenuNames);
        log.info("==========================================================");
    }
}