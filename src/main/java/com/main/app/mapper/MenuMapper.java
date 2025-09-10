package com.main.app.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.main.app.model.MenuDto;

@Mapper
public interface MenuMapper {
    /**
     * 모든 메뉴 조회
     */
    List<MenuDto> getMenuList();
    
    /**
     * 특정 레벨의 메뉴만 조회
     * @param level 메뉴 레벨
     * @return 해당 레벨의 메뉴 리스트
     */
    List<MenuDto> getMenuListByLevel(@Param("level") int level);
    
    /**
     * 특정 부모 메뉴의 하위 메뉴 조회
     * @param parentId 부모 메뉴 ID
     * @return 하위 메뉴 리스트
     */
    List<MenuDto> getSubMenusByParentId(@Param("parentId") String parentId);
    
    List<Map<String,String>> getList1();
    List<Map<String,String>> getList2();
}