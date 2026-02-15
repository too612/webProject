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
import jakarta.servlet.http.HttpSession;
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
    public void addCommonAttributes(Model model, HttpServletRequest request, HttpSession session) {
        // 세션 정보를 모델에 추가
        Object userId = session.getAttribute("userId");
        Object userName = session.getAttribute("userName");
        Object loginUser = session.getAttribute("loginUser");
        
        log.info(">>> [SESSION] userId: {}, userName: {}, loginUser: {}", userId, userName, loginUser);
        
        if (userId != null) {
            model.addAttribute("sessionUserId", userId);
            model.addAttribute("sessionUserName", userName);
            model.addAttribute("sessionLoginUser", loginUser);
            log.info(">>> [SESSION] 모델에 세션 정보 추가 완료");
        } else {
            log.info(">>> [SESSION] 세션에 userId 없음");
        }
        
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
        log.info(">>> [DEBUG] 현재 요청 URI: {}", currentUri);

        // 현재 경로로 메뉴 찾기 (정확히 일치하거나, 현재 경로를 포함하는 가장 하위 메뉴 찾기)
        MenuDto currentMenu = findBestMatchMenu(hierarchicalMenus, currentUri);
        
        if (currentMenu == null) {
            log.warn(">>> [DEBUG] 매칭 실패: 현재 URI({})에 해당하는 메뉴를 찾을 수 없습니다.", currentUri);
            return;
        }

        log.info(">>> [DEBUG] 매칭 성공: 메뉴명='{}', 경로='{}'", currentMenu.getMenuName(), currentMenu.getPath());

        // 최상위 부모 메뉴 찾기 (찾은 메뉴의 경로를 기준으로 조회)
        MenuDto topMenu = menuService.findTopMenuByPath(currentMenu.getPath());
        if (topMenu == null) {
            log.warn(">>> [DEBUG] 최상위 메뉴 조회 실패 (Path: {})", currentMenu.getPath());
            return;
        }

        // 계층구조 메뉴에서 하위 메뉴들을 포함한 전체 정보 가져오기 (이미 조회한 hierarchicalMenus 재사용)
        // ID 비교 시 타입 불일치 방지를 위해 String으로 변환하여 비교
        MenuDto fullTopMenu = hierarchicalMenus.stream()
                .filter(menu -> String.valueOf(menu.getMenuId()).equals(String.valueOf(topMenu.getMenuId())))
                .findFirst()
                .orElse(topMenu);

        log.info(">>> [DEBUG] 최상위 메뉴 선택: {}", fullTopMenu.getMenuName());

        // 하위 메뉴들의 active 상태 설정
        if (fullTopMenu.getSubMenus() != null) {
            log.info(">>> [DEBUG] 서브메뉴 개수: {}", fullTopMenu.getSubMenus().size());
            String matchedPath = currentMenu.getPath();
            fullTopMenu.getSubMenus().forEach(subMenu -> {
                // 현재 메뉴와 경로가 같은 서브메뉴를 활성화
                boolean isActive = matchedPath.equals(subMenu.getPath());
                subMenu.setActive(isActive);
            });

            // 서브메뉴가 존재하면 레이아웃에 표시되도록 submenu 값을 Y로 설정
            model.addAttribute("submenu", "Y");
        } else {
            log.warn(">>> [DEBUG] 서브메뉴가 존재하지 않습니다 (null).");
        }

        // 모델에 속성 추가
        model.addAttribute("currentMainMenuName", fullTopMenu.getMenuName());
        model.addAttribute("currentSubMenus", fullTopMenu.getSubMenus());
        model.addAttribute("currentTopMenu", fullTopMenu);
        model.addAttribute("currentMenu", currentMenu);
        model.addAttribute("currentPath", currentUri);
        
        log.info(">>> [DEBUG] 모델 설정 완료. currentSubMenus 존재 여부: {}", (fullTopMenu.getSubMenus() != null));
    }

    /**
     * 메뉴 트리에서 현재 URI와 가장 잘 매칭되는(가장 긴 경로가 일치하는) 메뉴를 찾습니다.
     * 예: URI가 "/support/qna/write"일 때 "/support/qna" 메뉴를 반환
     */
    private MenuDto findBestMatchMenu(List<MenuDto> menus, String currentUri) {
        MenuDto bestMatch = null;
        int maxLen = -1;

        for (MenuDto menu : menus) {
            // 현재 URI가 메뉴 경로로 시작하는지 확인 (Prefix Match)
            // menu.getPath()가 비어있지 않은지 체크 추가
            if (menu.getPath() != null && !menu.getPath().isEmpty() && currentUri.startsWith(menu.getPath())) {
                if (menu.getPath().length() > maxLen) {
                    bestMatch = menu;
                    maxLen = menu.getPath().length();
                }
            }

            // 재귀적으로 하위 메뉴 검색
            if (menu.getSubMenus() != null) {
                MenuDto subMatch = findBestMatchMenu(menu.getSubMenus(), currentUri);
                if (subMatch != null && subMatch.getPath() != null && subMatch.getPath().length() > maxLen) {
                    bestMatch = subMatch;
                    maxLen = subMatch.getPath().length();
                }
            }
        }
        return bestMatch;
    }
}