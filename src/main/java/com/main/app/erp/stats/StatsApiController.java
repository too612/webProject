package com.main.app.erp.stats;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.main.app.common.dto.ApiResponse;

@RestController
@RequestMapping("/api/erp/stats")
public class StatsApiController {

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> getDashboard() {
        return ApiResponse.ok(Map.of(
                "totalMembers", 0,
                "thisWeekAttendance", 0,
                "thisMonthOffering", 0,
                "activeMinistries", 0));
    }

    @GetMapping("/attendance")
    public ApiResponse<Map<String, Object>> getAttendanceStats(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(Map.of(
                "summary", List.of(),
                "chart", List.of()));
    }

    @GetMapping("/offering")
    public ApiResponse<Map<String, Object>> getOfferingStats(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        return ApiResponse.ok(Map.of(
                "summary", List.of(),
                "chart", List.of()));
    }

    @GetMapping("/ministry")
    public ApiResponse<Map<String, Object>> getMinistryStats(
            @RequestParam(required = false) String year) {
        return ApiResponse.ok(Map.of(
                "summary", List.of(),
                "chart", List.of()));
    }
}
