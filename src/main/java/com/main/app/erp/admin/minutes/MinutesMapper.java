package com.main.app.erp.admin.minutes;

import com.main.app.erp.admin.minutes.dto.MinutesDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MinutesMapper {

    List<MinutesDto.Minutes> selectMinutesList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countMinutesList(@Param("keyword") String keyword);
}

