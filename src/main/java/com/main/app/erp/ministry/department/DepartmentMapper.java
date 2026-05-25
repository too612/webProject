package com.main.app.erp.ministry.department;

import com.main.app.erp.ministry.department.dto.DepartmentDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DepartmentMapper {

    List<DepartmentDto.Department> selectDepartmentList(@Param("keyword") String keyword,
            @Param("offset") int offset,
            @Param("limit") int limit);

    long countDepartmentList(@Param("keyword") String keyword);
}
