package com.main.app.service;

import com.main.app.model.MenuDto;
import java.util.List;

public interface MenuService {
    List<MenuDto> getHierarchicalMenus();
}