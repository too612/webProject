package com.main.app.erp.stats;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface StatsMapper {

    Map<String, Object> selectDashboard();

    List<StatsDto.AttendanceStat> selectAttendanceStats(@Param("year") String year,
                                                         @Param("month") String month);

    List<StatsDto.OfferingStat> selectOfferingStats(@Param("year") String year,
                                                     @Param("month") String month);

    List<StatsDto.MinistryStat> selectMinistryStats(@Param("year") String year);
}

