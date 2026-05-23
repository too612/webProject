package com.main.app.community.group;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface GroupMapper {

        List<GroupDto> selectBoards(@Param("boardType") String boardType,
            @Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countBoards(@Param("boardType") String boardType,
            @Param("keyword") String keyword);
}
