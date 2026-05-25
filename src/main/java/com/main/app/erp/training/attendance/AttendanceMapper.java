package com.main.app.erp.training.attendance;

import com.main.app.erp.training.attendance.dto.AttendanceDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AttendanceMapper {

    List<AttendanceDto.Attendance> selectAttendanceList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countAttendanceList(@Param("keyword") String keyword);
}
