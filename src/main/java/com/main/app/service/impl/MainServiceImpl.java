package com.main.app.service.impl;

import com.main.app.mapper.MainMapper;
import com.main.app.model.MenuDto;
import com.main.app.service.MainService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MainServiceImpl implements MainService {

    @Autowired
    private MainMapper mainMapper;

    @Override
    public List<MenuDto> getMenuList() {
        return mainMapper.getMenuList();
    }

    @Override
    public List<Map<String, String>> getList1(HttpServletRequest request) {
        return mainMapper.getList1();
    }

    @Override
    public List<Map<String, String>> getList2(HttpServletRequest request) {
        return mainMapper.getList2();
    }
}