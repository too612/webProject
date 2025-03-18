package com.main.app.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.main.app.mapper.MainMapper;
import com.main.app.service.MainService;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class MainServiceImpl implements MainService {

    @Autowired
    private MainMapper mainMapper;

    @Override
    public List<Map<String, String>> getList1(HttpServletRequest request) {

        List<Map<String, String>> list = mainMapper.getList1();
        System.out.println("list1 value--->" + list);
        return list;
    }

    @Override
    public List<Map<String, String>> getList2(HttpServletRequest request) {

        List<Map<String, String>> list = mainMapper.getList2();
        System.out.println("list2 value--->" + list);
        return list;
    }
}