package com.main.app.official.news.eventcalendar;

import com.main.app.common.dto.ApiResponse;
import com.main.app.official.news.eventcalendar.dto.EventCalendarDto;
import com.main.app.official.news.eventcalendar.dto.EventCalendarRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official/news/eventcalendar")
@RequiredArgsConstructor
public class EventCalendarController {

    private final EventCalendarService eventCalendarService;

    @GetMapping("/getInfo")
    public ApiResponse<EventCalendarDto> getInfo() {
        return ApiResponse.ok(eventCalendarService.getInfo());
    }

    @PostMapping("/setCreate")
    public ApiResponse<Void> setCreate(@RequestBody EventCalendarRequest request) {
        eventCalendarService.setCreate(request);
        return ApiResponse.ok(null, "행사달력을 등록했습니다.");
    }

    @PutMapping("/setUpdate/{eventCalendarId}")
    public ApiResponse<Void> setUpdate(
            @PathVariable Long eventCalendarId,
            @RequestBody EventCalendarRequest request) {
        eventCalendarService.setUpdate(eventCalendarId, request);
        return ApiResponse.ok(null, "행사달력을 수정했습니다.");
    }

    @DeleteMapping("/delRemove/{eventCalendarId}")
    public ApiResponse<Void> delRemove(@PathVariable Long eventCalendarId) {
        eventCalendarService.delRemove(eventCalendarId);
        return ApiResponse.ok(null, "행사달력을 삭제했습니다.");
    }
}
