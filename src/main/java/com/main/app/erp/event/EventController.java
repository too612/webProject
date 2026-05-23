package com.main.app.erp.event;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController("erpEventController")
@RequestMapping("/api/erp/event")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/calendar")
    public ApiResponse<Map<String, Object>> calendar(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(Map.of("events", eventService.getCalendarEvents(year, month)));
    }

    @GetMapping("/apply")
    public ApiResponse<Page<EventDto.Apply>> apply(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(eventService.getApplyList(page, keyword));
    }

    @GetMapping("/participant")
    public ApiResponse<Page<EventDto.Apply>> participant(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(eventService.getParticipantList(page, keyword));
    }

    @GetMapping("/result")
    public ApiResponse<Page<EventDto.Event>> result(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(eventService.getResultList(page, keyword));
    }
}
