package com.main.app.erp.stats.attendance;

import com.main.app.erp.stats.attendance.dto.AttendanceDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AttendanceMapper {

    List<AttendanceDto.AttendanceStat> selectAttendanceStats(@Param("year") String year,
            @Param("month") String month);
}
