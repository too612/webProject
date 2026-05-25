package com.main.app.community.facilities.calendar;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;
import com.main.app.community.facilities.calendar.dto.CalendarDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller("communityFacilitiesCalendarController")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping("/community/facilities/calendar")
    public String calendarPage(Model model) {
        model.addAttribute("submenu", "Y");
        return "community/facilities/calendar";
    }

    @GetMapping("/api/community/facilities/pages")
    @ResponseBody
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("Facility Calendar", "/community/facilities/calendar", "community",
                        "community/facilities/calendar"),
                new PageMetaDto("Dining", "/community/facilities/dining", "community", "community/facilities/dining"),
                new PageMetaDto("Prayer Room", "/community/facilities/prayer", "community",
                        "community/facilities/prayer")));
    }

    @GetMapping("/api/community/facilities/calendar")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getCalendar(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        List<CalendarDto> events = calendarService.getCalendar(year, month);
        return ApiResponse.ok(Map.of("events", events));
    }
}