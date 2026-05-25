package com.main.app.erp.event.calendar;

import com.main.app.erp.event.calendar.dto.CalendarDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpEventCalendarService")
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarMapper eventCalendarMapper;

    public List<CalendarDto.Event> getCalendarEvents(String year, String month) {
        try {
            return eventCalendarMapper.selectCalendarEvents(year, month);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
