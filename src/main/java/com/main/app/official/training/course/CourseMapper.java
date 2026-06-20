package com.main.app.official.training.course;

import com.main.app.official.training.course.dto.CourseDto;
import com.main.app.official.training.course.dto.CourseRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CourseMapper {

    CourseDto selectCourse();

    int insertCourse(CourseRequest request);

    int updateCourse(@Param("id") Long id, @Param("request") CourseRequest request);

    int deleteCourse(@Param("id") Long id);
}