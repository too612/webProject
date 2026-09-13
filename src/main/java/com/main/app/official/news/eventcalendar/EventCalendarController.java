package com.main.app.official.news.eventcalendar;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.news.eventcalendar.dto.EventCalendarDto;
import com.main.app.official.news.eventcalendar.dto.EventCalendarRequest;
import com.main.app.official.news.eventcalendar.dto.EventCategoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/official/news/eventcalendar")
@RequiredArgsConstructor
public class EventCalendarController {

    private final EventCalendarService eventCalendarService;

    @GetMapping("/getList")
    public ApiResponse<List<EventCalendarDto>> getList() {
        return ApiResponse.ok(eventCalendarService.getList());
    }

    @GetMapping("/getCategoryList")
    public ApiResponse<List<EventCategoryDto>> getCategoryList() {
        return ApiResponse.ok(eventCalendarService.getCategoryList());
    }

    @PostMapping("/setCreate")
    public ApiResponse<Void> setCreate(@RequestBody EventCalendarRequest request) {
        eventCalendarService.setCreate(request);
        return ApiResponse.ok(null, "행사 일정을 등록했습니다.");
    }

    @PutMapping("/setUpdate/{eventKey}")
    public ApiResponse<Void> setUpdate(
            @PathVariable String eventKey,
            @RequestBody EventCalendarRequest request) {
        eventCalendarService.setUpdate(eventKey, request);
        return ApiResponse.ok(null, "행사 일정을 수정했습니다.");
    }

    @DeleteMapping("/delRemove/{eventKey}")
    public ApiResponse<Void> delRemove(@PathVariable String eventKey) {
        eventCalendarService.delRemove(eventKey);
        return ApiResponse.ok(null, "행사 일정을 삭제했습니다.");
    }
}
