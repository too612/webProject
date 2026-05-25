package com.main.app.community.facilities.calendar;

import com.main.app.community.facilities.calendar.dto.CalendarDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarService {

    private final CalendarMapper calendarMapper;

    public CalendarService(CalendarMapper calendarMapper) {
        this.calendarMapper = calendarMapper;
    }

    public List<CalendarDto> getCalendar(String year, String month) {
        return calendarMapper.selectBoards(0, 100);
    }
}