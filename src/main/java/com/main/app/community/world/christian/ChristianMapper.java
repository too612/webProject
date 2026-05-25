package com.main.app.community.world.christian;

import com.main.app.community.world.christian.dto.ChristianDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChristianMapper {

    List<ChristianDto> selectBoards(@Param("keyword") String keyword,
                                    @Param("offset") int offset,
                                    @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}