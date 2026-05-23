package com.main.app.erp.stats;

import com.main.app.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController("erpStatsController")
@RequestMapping("/api/erp/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> dashboard() {
        return ApiResponse.ok(statsService.getDashboard());
    }

    @GetMapping("/attendance")
    public ApiResponse<Map<String, Object>> attendance(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        List<StatsDto.AttendanceStat> content = statsService.getAttendanceStats(year, month);
        return ApiResponse.ok(Map.of("content", content));
    }

    @GetMapping("/offering")
    public ApiResponse<Map<String, Object>> offering(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        List<StatsDto.OfferingStat> content = statsService.getOfferingStats(year, month);
        return ApiResponse.ok(Map.of("content", content));
    }

    @GetMapping("/ministry")
    public ApiResponse<Map<String, Object>> ministry(
            @RequestParam(required = false) String year) {
        List<StatsDto.MinistryStat> content = statsService.getMinistryStats(year);
        return ApiResponse.ok(Map.of("content", content));
    }
}
