package com.main.app.community.saint.sales;

import com.main.app.community.saint.sales.dto.SalesDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SalesMapper {

    List<SalesDto> selectBoards(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}