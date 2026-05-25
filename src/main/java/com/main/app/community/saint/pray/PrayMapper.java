package com.main.app.community.saint.pray;

import com.main.app.community.saint.pray.dto.PrayDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PrayMapper {

    List<PrayDto> selectBoards(@Param("keyword") String keyword,
                               @Param("offset") int offset,
                               @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}