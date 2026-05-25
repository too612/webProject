package com.main.app.erp.stats.attendance;

import com.main.app.erp.stats.attendance.dto.AttendanceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpStatsAttendanceService")
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    public List<AttendanceDto.AttendanceStat> getAttendanceStats(String year, String month) {
        try {
            return attendanceMapper.selectAttendanceStats(year, month);
        } catch (Exception ignored) {
            return Collections.emptyList();
        }
    }
}
