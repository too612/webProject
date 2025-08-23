package com.main.app.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.main.app.model.MenuDto;

@Mapper
public interface MainMapper {
    List<MenuDto> getMenuList();
    List<Map<String,String>> getList1();
    List<Map<String,String>> getList2();
}
