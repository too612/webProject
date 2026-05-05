package com.main.app.community.api;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.main.app.common.dto.ApiResponse;
import com.main.app.common.dto.PageMetaDto;

@RestController
@RequestMapping("/api/community/facilities")
public class FacilitiesApiController {

    @GetMapping("/pages")
    public ApiResponse<List<PageMetaDto>> getPages() {
        return ApiResponse.ok(List.of(
                new PageMetaDto("시설달력", "/community/facilities/calendar", "community", "community/facilities/calendar"),
                new PageMetaDto("식당안내", "/community/facilities/dining", "community", "community/facilities/dining"),
                new PageMetaDto("기도실", "/community/facilities/prayer", "community", "community/facilities/prayer")));
    }

    @GetMapping("/calendar")
    public ApiResponse<Map<String, Object>> getCalendar(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(Map.of("events", List.of()));
    }

    @GetMapping("/dining")
    public ApiResponse<Map<String, Object>> getDiningList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/prayer")
    public ApiResponse<Map<String, Object>> getPrayerInfo() {
        return ApiResponse.ok(Map.of("rooms", List.of()));
    }
}