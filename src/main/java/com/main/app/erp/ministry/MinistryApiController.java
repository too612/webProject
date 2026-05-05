package com.main.app.erp.ministry;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.main.app.common.dto.ApiResponse;

@RestController
@RequestMapping("/api/erp/ministry")
public class MinistryApiController {

    @GetMapping("/department")
    public ApiResponse<Map<String, Object>> getDepartmentList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/schedule")
    public ApiResponse<Map<String, Object>> getScheduleList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(Map.of(
                "content", List.of(),
                "totalElements", 0,
                "totalPages", 0,
                "number", page,
                "size", size));
    }

    @GetMapping("/volunteer")
    public ApiResponse<Map<String, Object>> getVolunteerList(
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

    @GetMapping("/report")
    public ApiResponse<Map<String, Object>> getReportList(
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
