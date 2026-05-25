package com.main.app.community.facilities.dining;

import com.main.app.community.facilities.dining.dto.DiningDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DiningMapper {

    List<DiningDto> selectBoards(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}