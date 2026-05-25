package com.main.app.erp.event.calendar;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController("erpEventCalendarController")
@RequestMapping("/api/erp/event/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService eventCalendarService;

    @GetMapping
    public ApiResponse<Map<String, Object>> getCalendar(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(Map.of("events", eventCalendarService.getCalendarEvents(year, month)));
    }
}
