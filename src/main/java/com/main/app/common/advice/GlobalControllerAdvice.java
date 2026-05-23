package com.main.app.common.advice;

import com.main.app.common.menu.MenuService;
import com.main.app.common.menu.dto.MenuDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalControllerAdvice {

    private static final Logger log = LoggerFactory.getLogger(GlobalControllerAdvice.class);

    private final MenuService menuService;

    /**
     * 모든 페이지에서 사용하는 공통 모델 속성을 추가합니다.
     * - 메뉴 관련 속성(계층형 메뉴, 최상위 메뉴)
     * - 현재 요청 URI 기반 사이드바 속성
     * getHierarchicalMenus() 호출을 한 번으로 최적화했습니다.
     */
    @ModelAttribute
    public void addCommonAttributes(Model model, HttpServletRequest request, HttpSession session) {
        // 세션 정보를 모델에 추가
        Object userId = session.getAttribute("userId");
        Object userName = session.getAttribute("userName");
        Object loginUser = session.getAttribute("loginUser");

        log.debug("세션 조회: 사용자아이디={}, 사용자명={}, 로그인사용자존재여부={}", userId, userName, loginUser != null);

        if (userId != null) {
            model.addAttribute("sessionUserId", userId);
            model.addAttribute("sessionUserName", userName);
            model.addAttribute("sessionLoginUser", loginUser);
            log.debug("세션 정보를 모델에 추가했습니다.");
        } else {
            log.debug("세션에 userId가 없습니다.");
        }

        // 현재 요청 URI를 기반으로 systemType 결정
        String currentUri = request.getRequestURI();
        log.debug("현재 요청 경로={}", currentUri);

        String systemType = extractSystemType(currentUri);
        log.debug("추출된 시스템구분={}", systemType);
        model.addAttribute("currentSystemType", systemType);

        // 우선 추출된 systemType으로 메뉴 조회
        List<MenuDto> hierarchicalMenus = menuService.getHierarchicalMenus(systemType);

        // 모든 페이지에서 공통으로 사용하는 메뉴 속성 추가
        // 'topMenuList'와 'allTopMenus'는 템플릿 호환성을 위해 함께 추가
        model.addAttribute("menuList", hierarchicalMenus);
        model.addAttribute("topMenuList", hierarchicalMenus);
        model.addAttribute("allTopMenus", hierarchicalMenus);

        List<String> topMenuNames = hierarchicalMenus.stream()
                .map(MenuDto::getMenuName)
                .collect(Collectors.toList());
        // 'topMenuNames'와 'allTopMenuNames'는 템플릿 호환성을 위해 함께 추가
        model.addAttribute("topMenuNames", topMenuNames);
        model.addAttribute("allTopMenuNames", topMenuNames);

        // 현재 요청 URI를 기반으로 사이드바 관련 속성을 동적으로 설정
        log.debug("사이드바 계산 대상 경로={}", currentUri);

        // 현재 경로로 메뉴 찾기 (정확히 일치하거나 현재 경로를 포함하는 가장 하위 메뉴)
        MenuDto currentMenu = findBestMatchMenu(hierarchicalMenus, currentUri);

        // 커뮤니티 경로 호환 처리
        if (currentMenu == null && isPathMatch(currentUri, "/community")) {
            String legacyUri = currentUri.substring("/community".length());
            if (legacyUri.isEmpty()) {
                legacyUri = "/";
            }
            currentMenu = findBestMatchMenu(hierarchicalMenus, legacyUri);
            if (currentMenu != null) {
                log.debug("커뮤니티 레거시 경로로 메뉴 매칭 성공: {}", legacyUri);
            }
        }

        // 시스템 경로 호환 처리: DB는 /user/... 형태인데 실제 요청이 /system/user/...인 경우 대응
        if (currentMenu == null && isPathMatch(currentUri, "/system")) {
            String legacyUri = currentUri.substring("/system".length());
            if (legacyUri.isEmpty()) {
                legacyUri = "/";
            }
            currentMenu = findBestMatchMenu(hierarchicalMenus, legacyUri);
            if (currentMenu != null) {
                log.debug("시스템 레거시 경로로 메뉴 매칭 성공: {}", legacyUri);
            }
        }

        // 마이페이지 경로 호환 처리: DB는 /user/... 형태인데 실제 요청이 /mypage/user/...인 경우 대응
        if (currentMenu == null && isPathMatch(currentUri, "/mypage")) {
            String legacyUri = currentUri.substring("/mypage".length());
            if (legacyUri.isEmpty()) {
                legacyUri = "/";
            }
            currentMenu = findBestMatchMenu(hierarchicalMenus, legacyUri);
            if (currentMenu != null) {
                log.debug("마이페이지 레거시 경로로 메뉴 매칭 성공: {}", legacyUri);
            }
        }

        // URI prefix 기준 systemType이 맞지 않는 경우를 대비해 다른 시스템 메뉴에서도 탐색
        if (currentMenu == null) {
            String[] candidates = { "community", "erp", "system", "mypage", "official" };
            for (String candidate : candidates) {
                if (candidate.equals(systemType)) {
                    continue;
                }
                List<MenuDto> candidateMenus = menuService.getHierarchicalMenus(candidate);
                MenuDto candidateMenu = findBestMatchMenu(candidateMenus, currentUri);
                if (candidateMenu != null) {
                    systemType = candidate;
                    hierarchicalMenus = candidateMenus;
                    currentMenu = candidateMenu;
                    log.debug("메뉴 매칭으로 시스템구분 재설정: {}", systemType);
                    break;
                }
            }
        }

        if (currentMenu == null) {
            log.warn("메뉴 매칭 실패: 요청경로={}", currentUri);
            return;
        }

        log.debug("메뉴 매칭 성공: 메뉴명={}, 경로={}", currentMenu.getMenuName(), currentMenu.getPath());

        // 최상위 부모 메뉴 찾기 (찾은 메뉴의 경로를 기준으로 조회)
        MenuDto topMenu = menuService.findTopMenuByPath(currentMenu.getPath(), systemType);
        if (topMenu == null) {
            log.warn("최상위 메뉴 조회 실패: 경로={}", currentMenu.getPath());
            return;
        }

        // 계층형 메뉴에서 하위 메뉴를 포함한 전체 정보 가져오기 (이미 조회된 hierarchicalMenus 사용)
        // ID 타입 불일치 방지를 위해 String으로 변환해 비교
        MenuDto fullTopMenu = hierarchicalMenus.stream()
                .filter(menu -> String.valueOf(menu.getMenuId()).equals(String.valueOf(topMenu.getMenuId())))
                .findFirst()
                .orElse(topMenu);

        log.debug("최상위 메뉴 선택: {}", fullTopMenu.getMenuName());

        // 하위 메뉴 active 상태 설정
        if (fullTopMenu.getSubMenus() != null) {
            log.debug("서브메뉴 개수: {}", fullTopMenu.getSubMenus().size());
            String matchedPath = currentMenu.getPath();
            fullTopMenu.getSubMenus().forEach(subMenu -> {
                // 현재 메뉴와 경로가 같은 서브메뉴를 활성화
                boolean isActive = matchedPath.equals(subMenu.getPath());
                subMenu.setActive(isActive);
            });

            // 서브메뉴가 존재하면 레이아웃에서 표시되도록 submenu 값을 Y로 설정
            model.addAttribute("submenu", "Y");
        } else {
            log.debug("서브메뉴가 없습니다.");
        }

        // 모델 속성 추가
        model.addAttribute("currentSystemType", systemType);
        model.addAttribute("currentMainMenuName", fullTopMenu.getMenuName());
        model.addAttribute("currentSubMenus", fullTopMenu.getSubMenus());
        model.addAttribute("currentTopMenu", fullTopMenu);
        model.addAttribute("currentMenu", currentMenu);
        model.addAttribute("currentPath", currentUri);

        log.debug("모델 설정 완료: 현재서브메뉴존재여부={}", fullTopMenu.getSubMenus() != null);
    }

    /**
     * 메뉴 트리에서 현재 URI와 가장 잘 매칭되는(가장 긴 경로가 일치하는) 메뉴를 찾습니다.
     * 예: URI가 "/support/qna/write"이면 "/support/qna" 메뉴를 반환
     */
    private MenuDto findBestMatchMenu(List<MenuDto> menus, String currentUri) {
        MenuDto bestMatch = null;
        int maxLen = -1;

        for (MenuDto menu : menus) {
            // 현재 URI가 메뉴 경로로 시작하는지 확인 (Prefix Match)
            // menu.getPath() null/빈 값 방지 체크
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

    /**
     * URI에서 systemType을 추출합니다.
     * 
     * @param uri 현재 요청 URI
     * @return systemType (official, erp, community, mypage) 또는 null
     */
    private String extractSystemType(String uri) {
        if (uri == null || uri.isEmpty()) {
            return null;
        }

        // URI 패턴에 따라 systemType 결정
        if (isPathMatch(uri, "/official")) {
            return "official";
        } else if (isPathMatch(uri, "/system")) {
            return "system";
        } else if (isPathMatch(uri, "/mypage")) {
            return "mypage";
        } else if (isPathMatch(uri, "/erp")
                || isPathMatch(uri, "/humen")
                || isPathMatch(uri, "/account")
                || isPathMatch(uri, "/sermon")
                || isPathMatch(uri, "/training")
                || isPathMatch(uri, "/ministry")
                || isPathMatch(uri, "/event")
                || isPathMatch(uri, "/facility")
                || isPathMatch(uri, "/comm")
                || isPathMatch(uri, "/stats")) {
            return "erp";
        } else if (isPathMatch(uri, "/community")
                || isPathMatch(uri, "/group")
                || isPathMatch(uri, "/facilities")
                || isPathMatch(uri, "/saint")
                || isPathMatch(uri, "/world")
                || isPathMatch(uri, "/board")) {
            return "community";
        }

        // 기본값은 official (메인 페이지 등)
        return "official";
    }

    private boolean isPathMatch(String uri, String basePath) {
        return uri != null && (uri.equals(basePath) || uri.startsWith(basePath + "/"));
    }
}
