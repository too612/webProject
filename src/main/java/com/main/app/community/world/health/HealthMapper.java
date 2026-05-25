package com.main.app.community.world.health;

import com.main.app.community.world.health.dto.HealthDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HealthMapper {

    List<HealthDto> selectBoards(@Param("keyword") String keyword,
                                 @Param("offset") int offset,
                                 @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}