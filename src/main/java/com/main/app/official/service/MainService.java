package com.main.app.official.service;

import com.main.app.common.dto.MenuDto;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface MainService {
    List<MenuDto> getMenuList();
    List<Map<String, String>> getList1(HttpServletRequest request);
    List<Map<String, String>> getList2(HttpServletRequest request);
}