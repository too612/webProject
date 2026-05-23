package com.main.app.erp.training;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface TrainingMapper {

    List<TrainingDto.Course> selectCourseList(@Param("keyword") String keyword,
                                               @Param("offset") int offset,
                                               @Param("limit") int limit);
    long countCourseList(@Param("keyword") String keyword);

    List<TrainingDto.Student> selectStudentList(@Param("keyword") String keyword,
                                                 @Param("offset") int offset,
                                                 @Param("limit") int limit);
    long countStudentList(@Param("keyword") String keyword);

    List<TrainingDto.Attendance> selectAttendanceList(@Param("keyword") String keyword,
                                                       @Param("offset") int offset,
                                                       @Param("limit") int limit);
    long countAttendanceList(@Param("keyword") String keyword);

    List<TrainingDto.Student> selectCompleteList(@Param("keyword") String keyword,
                                                  @Param("offset") int offset,
                                                  @Param("limit") int limit);
    long countCompleteList(@Param("keyword") String keyword);
}
