package com.main.app.erp.ministry.schedule;

import com.main.app.erp.ministry.schedule.dto.ScheduleDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleMapper {

    List<ScheduleDto.Schedule> selectScheduleList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countScheduleList(@Param("keyword") String keyword);
}
