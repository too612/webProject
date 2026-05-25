package com.main.app.community.group.groupb2;

import com.main.app.community.group.groupb2.dto.Groupb2Dto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface Groupb2Mapper {

    List<Groupb2Dto> selectBoards(
            @Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}