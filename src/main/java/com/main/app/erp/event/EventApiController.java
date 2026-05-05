package com.main.app.erp.event;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.main.app.common.dto.ApiResponse;

@RestController
@RequestMapping("/api/erp/event")
public class EventApiController {

    @GetMapping("/calendar")
    public ApiResponse<Map<String, Object>> getCalendarList(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(Map.of(
                "events", List.of()));
    }

    @GetMapping("/apply")
    public ApiResponse<Map<String, Object>> getApplyList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/participant")
    public ApiResponse<Map<String, Object>> getParticipantList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/result")
    public ApiResponse<Map<String, Object>> getResultList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }
}
