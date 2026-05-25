package com.main.app.erp.stats.attendance;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.stats.attendance.dto.AttendanceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController("erpStatsAttendanceController")
@RequestMapping("/api/erp/stats/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month) {
        List<AttendanceDto.AttendanceStat> content = attendanceService.getAttendanceStats(year, month);
        return ApiResponse.ok(Map.of("content", content));
    }
}
