package com.main.app.common.popup.department;

import com.main.app.common.popup.department.dto.DepartmentPopupDto;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DepartmentPopupMapper {
    List<DepartmentPopupDto.Reorganization> selectReorganizations();

    DepartmentPopupDto.Reorganization selectReorganization(@Param("reorgKey") String reorgKey);

    List<DepartmentPopupDto.Department> selectDepartments(
            @Param("reorgKey") String reorgKey,
            @Param("deptCd") String deptCd,
            @Param("deptNm") String deptNm,
            @Param("exactCode") boolean exactCode);
}
