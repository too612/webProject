package com.main.app.erp.training.student;

import com.main.app.erp.training.student.dto.StudentDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentMapper {

    List<StudentDto.Student> selectStudentList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countStudentList(@Param("keyword") String keyword);
}
