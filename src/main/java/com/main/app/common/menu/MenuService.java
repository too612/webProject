package com.main.app.common.menu;

import com.main.app.common.menu.dto.MenuDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private static final Logger log = LoggerFactory.getLogger(MenuService.class);

    private final MenuMapper menuMapper;

    public List<MenuDto> getHierarchicalMenus(String systemType) {
        List<MenuDto> allMenus = menuMapper.getMenuList(systemType);
        if (allMenus == null || allMenus.isEmpty()) {
            log.warn("메뉴 데이터가 없습니다. 시스템구분={}", systemType);
            return new ArrayList<>();
        }

        Map<String, MenuDto> menuMap = allMenus.stream()
                .collect(Collectors.toMap(MenuDto::getMenuId, menu -> menu));

        List<MenuDto> rootMenus = allMenus.stream()
                .filter(menu -> menu.getLevel() == 1)
                .collect(Collectors.toList());

        for (MenuDto menu : allMenus) {
            if (menu.getLevel() > 1 && menu.getParentId() != null) {
                MenuDto parent = menuMap.get(menu.getParentId());
                if (parent != null) {
                    parent.getSubMenus().add(menu);
                }
            }
        }

        rootMenus.forEach(this::sortSubMenusRecursively);
        return rootMenus;
    }

    private void sortSubMenusRecursively(MenuDto menu) {
        if (menu.getSubMenus() != null && !menu.getSubMenus().isEmpty()) {
            menu.getSubMenus().sort((m1, m2) -> Integer.compare(m1.getOrderNo(), m2.getOrderNo()));
            menu.getSubMenus().forEach(this::sortSubMenusRecursively);
        }
    }

    public List<MenuDto> getTopLevelMenus(String systemType) {
        return menuMapper.getMenuListByLevel(1, systemType);
    }

    public MenuDto findMenuByPath(String path, String systemType) {
        if (path == null || path.trim().isEmpty()) {
            return null;
        }

        List<MenuDto> allMenus = menuMapper.getMenuList(systemType);
        return allMenus.stream()
                .filter(menu -> path.equals(menu.getPath()))
                .findFirst()
                .orElse(null);
    }

    public MenuDto findTopMenuByPath(String path, String systemType) {
        MenuDto currentMenu = findMenuByPath(path, systemType);
        if (currentMenu == null) {
            return null;
        }

        if (currentMenu.getLevel() == 1) {
            return currentMenu;
        }

        List<MenuDto> allMenus = menuMapper.getMenuList(systemType);
        MenuDto topMenu = currentMenu;

        while (topMenu.getLevel() > 1 && topMenu.getParentId() != null) {
            final String parentId = topMenu.getParentId();
            topMenu = allMenus.stream()
                    .filter(menu -> parentId.equals(menu.getMenuId()))
                    .findFirst()
                    .orElse(null);

            if (topMenu == null) {
                log.warn("부모 메뉴를 찾을 수 없습니다. 부모메뉴아이디={}", parentId);
                break;
            }
        }

        return topMenu;
    }
}
