package com.main.app.common.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AutoNoMapper {
    /**
     * 자동번호 생성 - 최대값 조회
     */
    String selectMaxSeq(@Param("key") String key);
    
    /**
     * 자동번호 생성 - 값 조회
     */
    Map<String, String> selectKey(@Param("map") Map<String, String> map);
    
    /**
     * 자동번호 생성 - 키 등록
     */
    int insertKey(@Param("key") String key, @Param("val") String val);
    
    /**
     * 자동번호 생성 - 값 증가
     */
    int updateKey(@Param("key") String key);
    
    /**
     * 자동번호 생성 - 값 삭제
     */
    int deleteKey(@Param("key") String key);
}
