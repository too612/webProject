package com.main.app.system.config.code;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import com.main.app.system.config.code.dto.CodeDto;

@Mapper
public interface CodeMapper {

    List<CodeDto> selectCodeList(@Param("groupCode") String groupCode,
            @Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("size") int size);

    long countCodeList(@Param("groupCode") String groupCode,
            @Param("keyword") String keyword);
}