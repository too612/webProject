package com.main.app.common.menu;

import com.main.app.common.menu.dto.MenuDto;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MenuMapper {
    List<MenuDto> getMenuList(@Param("systemType") String systemType);

    List<MenuDto> getMenuListByLevel(@Param("level") int level, @Param("systemType") String systemType);

    List<MenuDto> getSubMenusByParentId(@Param("parentId") String parentId, @Param("systemType") String systemType);

    List<Map<String, String>> getList1();

    List<Map<String, String>> getList2();
}
