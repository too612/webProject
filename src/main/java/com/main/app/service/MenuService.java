package com.main.app.service;

import com.main.app.model.MenuDto;
import java.util.List;

public interface MenuService {
    /**
     * 계층구조로 정렬된 메뉴 리스트 조회
     * @return 최상위 메뉴들과 그 하위 메뉴들
     */
    List<MenuDto> getHierarchicalMenus();
    
    /**
     * 최상위 레벨(level 1) 메뉴만 조회
     * @return 최상위 메뉴 리스트
     */
    List<MenuDto> getTopLevelMenus();
    
    /**
     * 특정 경로로 메뉴 찾기
     * @param path 메뉴 경로
     * @return 해당 경로의 메뉴, 없으면 null
     */
    MenuDto findMenuByPath(String path);
    
    /**
     * 특정 경로의 최상위 부모 메뉴 찾기
     * @param path 현재 메뉴 경로
     * @return 최상위 부모 메뉴, 없으면 null
     */
    MenuDto findTopMenuByPath(String path);
}