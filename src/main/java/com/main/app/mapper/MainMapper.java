package com.main.app.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MainMapper {
    List<Map<String,String>> getMenuList();
    List<Map<String,String>> getList1();
    List<Map<String,String>> getList2();
}
