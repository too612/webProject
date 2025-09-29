package com.main.app.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AutoNoMapper {
    Map<String, Object> selectAutoInfo(Map<String, Object> params);
    Map<String, Object> selectAutoDtlInfo(Map<String, Object> params);
    void insertAutoDtl(Map<String, Object> params);
    void updateAutoDtl(Map<String, Object> params);
    String getAutoNoKey(Map<String, Object> params);
}
