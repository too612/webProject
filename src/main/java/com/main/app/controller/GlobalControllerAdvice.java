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

@ControllerAdvice
public class GlobalControllerAdvice {

    private static final Logger log = LoggerFactory.getLogger(GlobalControllerAdvice.class);

    @Autowired
    private MenuService menuService;

    @ModelAttribute("menuList")
    public List<MenuDto> menuList() {
        return menuService.getHierarchicalMenus();
    }

    @ModelAttribute
    public void addSidebarAttributes(Model model, HttpServletRequest request) {
        List<MenuDto> menuList = (List<MenuDto>) model.getAttribute("menuList");
        if (menuList == null) return;

        String currentUri = request.getRequestURI();
        log.info("==========================================================");
        log.info("현재 요청 URI (currentUri): {}", currentUri);
        log.info("----------------------------------------------------------");

        for (MenuDto mainMenu : menuList) {
            for (MenuDto subMenu : mainMenu.getSubMenus()) {
                log.info("DB 메뉴 경로 (subMenu.path): {}", subMenu.getPath());
                
                // active 상태 설정 (이 방법이 가장 안전함)
                if (subMenu.getPath() != null && subMenu.getPath().equals(currentUri)) {
                    subMenu.setActive(true); // MenuDto에 active 필드와 setter 필요
                    log.info(">>> 매칭 성공! 사이드바 데이터를 모델에 추가합니다.");
                    model.addAttribute("currentMainMenuName", mainMenu.getMenuName());
                    model.addAttribute("currentSubMenus", mainMenu.getSubMenus());
                    model.addAttribute("currentTopMenu", mainMenu);
                    log.info("==========================================================");
                    return;
                } else {
                    subMenu.setActive(false);
                }
            }
        }
        log.warn(">>> 매칭 실패. 현재 URI에 해당하는 서브메뉴를 찾지 못했습니다.");
        log.info("==========================================================");
    }
}