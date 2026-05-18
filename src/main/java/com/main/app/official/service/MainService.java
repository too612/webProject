package com.main.app.official.service;

import com.main.app.common.dto.MenuDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("officialMainService")
public class MainService {
    public List<MenuDto> getMenuList() {
        // TODO: 메뉴 목록 조회 로직 구현 필요
        return null;
    }

    public List<Map<String, String>> getList1(HttpServletRequest request) {
        // TODO: 게시판 목록 조회 로직 구현 필요
        return null;
    }

    public List<Map<String, String>> getList2(HttpServletRequest request) {
        // TODO: 문의 목록 조회 로직 구현 필요
        return null;
    }
}
