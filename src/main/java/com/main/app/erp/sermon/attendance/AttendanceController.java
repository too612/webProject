package com.main.app.erp.sermon.attendance;

import com.main.app.common.dto.ApiResponse;
import com.main.app.erp.sermon.attendance.dto.AttendanceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("erpSermonAttendanceController")
@RequestMapping("/api/erp/sermon/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ApiResponse<Page<AttendanceDto.Attendance>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(attendanceService.getAttendanceList(page, keyword));
    }
}
