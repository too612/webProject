package com.main.app.community.facilities.calendar;

import com.main.app.community.facilities.calendar.dto.CalendarDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CalendarMapper {

    List<CalendarDto> selectBoards(@Param("offset") int offset,
            @Param("limit") int limit);
}