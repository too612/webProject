package com.main.app.erp.event.calendar;

import com.main.app.erp.event.calendar.dto.CalendarDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CalendarMapper {

    List<CalendarDto.Event> selectCalendarEvents(@Param("year") String year, @Param("month") String month);
}
