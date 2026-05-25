package com.main.app.community.world.economic;

import com.main.app.community.world.economic.dto.EconomicDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EconomicMapper {

    List<EconomicDto> selectBoards(@Param("keyword") String keyword,
                                   @Param("offset") int offset,
                                   @Param("limit") int limit);

    long countBoards(@Param("keyword") String keyword);
}