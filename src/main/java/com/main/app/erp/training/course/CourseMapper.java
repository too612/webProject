package com.main.app.erp.training.course;

import com.main.app.erp.training.course.dto.CourseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CourseMapper {

    List<CourseDto.Course> selectCourseList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countCourseList(@Param("keyword") String keyword);
}
