package com.main.app.service.impl;

import com.main.app.mapper.MenuMapper;
import com.main.app.model.MenuDto;
import com.main.app.service.MenuService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuServiceImpl implements MenuService {

    private static final Logger log = LoggerFactory.getLogger(MenuServiceImpl.class);

    @Autowired
    private MenuMapper menuMapper;

    @Override
    public List<MenuDto> getHierarchicalMenus() {
        List<MenuDto> allMenus = menuMapper.getMenuList();
        if (allMenus == null || allMenus.isEmpty()) {
            log.warn("메뉴 데이터가 없습니다.");
            return new ArrayList<>();
        }

        log.debug("전체 메뉴 개수: {}", allMenus.size());

        // 메뉴 ID를 키로 하는 Map 생성
        Map<String, MenuDto> menuMap = allMenus.stream()
                .collect(Collectors.toMap(MenuDto::getMenuId, menu -> menu));

        // 최상위 메뉴(level 1) 수집
        List<MenuDto> rootMenus = allMenus.stream()
                .filter(menu -> menu.getLevel() == 1)
                .collect(Collectors.toList());

        log.debug("최상위 메뉴 개수: {}", rootMenus.size());

        // 하위 메뉴를 부모 메뉴에 연결
        for (MenuDto menu : allMenus) {
            if (menu.getLevel() > 1 && menu.getParentId() != null) {
                MenuDto parent = menuMap.get(menu.getParentId());
                if (parent != null) {
                    parent.getSubMenus().add(menu);
                } else {
                    log.warn("부모 메뉴를 찾을 수 없습니다. menuId: {}, parentId: {}", 
                            menu.getMenuId(), menu.getParentId());
                }
            }
        }

        // 각 메뉴의 하위 메뉴들을 orderNo로 정렬
        rootMenus.forEach(this::sortSubMenusRecursively);

        return rootMenus;
    }

    /**
     * 하위 메뉴들을 재귀적으로 정렬
     */
    private void sortSubMenusRecursively(MenuDto menu) {
        if (menu.getSubMenus() != null && !menu.getSubMenus().isEmpty()) {
            menu.getSubMenus().sort((m1, m2) -> Integer.compare(m1.getOrderNo(), m2.getOrderNo()));
            menu.getSubMenus().forEach(this::sortSubMenusRecursively);
        }
    }

    @Override
    public List<MenuDto> getTopLevelMenus() {
        return menuMapper.getMenuListByLevel(1);
    }

    @Override
    public MenuDto findMenuByPath(String path) {
        if (path == null || path.trim().isEmpty()) {
            return null;
        }

        List<MenuDto> allMenus = menuMapper.getMenuList();
        return allMenus.stream()
                .filter(menu -> path.equals(menu.getPath()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public MenuDto findTopMenuByPath(String path) {
        MenuDto currentMenu = findMenuByPath(path);
        if (currentMenu == null) {
            return null;
        }

        // 이미 최상위 메뉴인 경우
        if (currentMenu.getLevel() == 1) {
            return currentMenu;
        }

        // 부모 메뉴를 찾아 올라가기
        List<MenuDto> allMenus = menuMapper.getMenuList();
        MenuDto topMenu = currentMenu;
        
        while (topMenu.getLevel() > 1 && topMenu.getParentId() != null) {
            final String parentId = topMenu.getParentId();
            topMenu = allMenus.stream()
                    .filter(menu -> parentId.equals(menu.getMenuId()))
                    .findFirst()
                    .orElse(null);
            
            if (topMenu == null) {
                log.warn("부모 메뉴를 찾을 수 없습니다. parentId: {}", parentId);
                break;
            }
        }

        return topMenu;
    }
}