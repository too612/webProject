package com.main.app.service;

import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

public interface MainService {
    List<Map<String,String>> getList1(HttpServletRequest request);
    List<Map<String,String>> getList2(HttpServletRequest request);
}
