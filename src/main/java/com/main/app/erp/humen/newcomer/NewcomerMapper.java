package com.main.app.erp.humen.newcomer;

import com.main.app.erp.humen.newcomer.dto.NewcomerDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NewcomerMapper {

    List<NewcomerDto.Newcomer> selectNewcomerList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countNewcomerList(@Param("keyword") String keyword);
}
