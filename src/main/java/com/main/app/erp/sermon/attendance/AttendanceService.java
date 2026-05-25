package com.main.app.erp.sermon.attendance;

import com.main.app.common.util.PaginationUtil;
import com.main.app.erp.sermon.attendance.dto.AttendanceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service("erpSermonAttendanceService")
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;

    public Page<AttendanceDto.Attendance> getAttendanceList(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10);
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        try {
            List<AttendanceDto.Attendance> list = attendanceMapper.selectAttendanceList(keyword, offset, limit);
            long total = attendanceMapper.countAttendanceList(keyword);
            return PaginationUtil.toPage(list, pageable, total);
        } catch (Exception e) {
            return PaginationUtil.toPage(Collections.emptyList(), pageable, 0);
        }
    }
}
