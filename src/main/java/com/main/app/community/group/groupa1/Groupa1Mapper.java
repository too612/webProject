package com.main.app.community.group.groupa1;

import com.main.app.community.group.groupa1.dto.Groupa1Dto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface Groupa1Mapper {

    List<Groupa1Dto> selectBoards(
            @Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}
