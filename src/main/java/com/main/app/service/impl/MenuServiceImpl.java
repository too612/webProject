package com.main.app.service.impl;

import com.main.app.mapper.MainMapper;
import com.main.app.model.MenuDto;
import com.main.app.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MainMapper mainMapper;

    @Override
    public List<MenuDto> getHierarchicalMenus() {
        List<MenuDto> allMenus = mainMapper.getMenuList();
        if (allMenus == null || allMenus.isEmpty()) {
            return new ArrayList<>();
        }

        Map<String, MenuDto> menuMap = allMenus.stream()
                .collect(Collectors.toMap(MenuDto::getMenuId, menu -> menu));

        List<MenuDto> rootMenus = new ArrayList<>();
        for (MenuDto menu : allMenus) {
            if (menu.getLevel() == 1) { // Level 1 메뉴를 최상위로 간주
                rootMenus.add(menu);
            } else {
                MenuDto parent = menuMap.get(menu.getParentId());
                if (parent != null) {
                    parent.getSubMenus().add(menu);
                }
            }
        }
        return rootMenus;
    }
}