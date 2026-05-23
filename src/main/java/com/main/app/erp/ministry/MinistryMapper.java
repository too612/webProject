package com.main.app.erp.ministry;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface MinistryMapper {

    List<MinistryDto.Department> selectDepartmentList(@Param("keyword") String keyword,
                                                       @Param("offset") int offset,
                                                       @Param("limit") int limit);
    long countDepartmentList(@Param("keyword") String keyword);

    List<MinistryDto.Schedule> selectScheduleList(@Param("keyword") String keyword,
                                                    @Param("offset") int offset,
                                                    @Param("limit") int limit);
    long countScheduleList(@Param("keyword") String keyword);

    List<MinistryDto.Volunteer> selectVolunteerList(@Param("keyword") String keyword,
                                                     @Param("offset") int offset,
                                                     @Param("limit") int limit);
    long countVolunteerList(@Param("keyword") String keyword);

    List<MinistryDto.Report> selectReportList(@Param("keyword") String keyword,
                                               @Param("offset") int offset,
                                               @Param("limit") int limit);
    long countReportList(@Param("keyword") String keyword);
}
