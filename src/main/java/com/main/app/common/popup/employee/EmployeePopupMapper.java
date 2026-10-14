package com.main.app.common.popup.employee;

import com.main.app.common.popup.employee.dto.EmployeePopupDto;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface EmployeePopupMapper {
    EmployeePopupDto.Reorganization selectReorganization(@Param("reorgKey") String reorgKey);
    List<EmployeePopupDto.Department> selectDepartments(@Param("reorgKey") String reorgKey);
    List<EmployeePopupDto.CodeOption> selectCodes(@Param("parentCode") String parentCode);
    List<EmployeePopupDto.Employee> selectEmployees(@Param("query") EmployeePopupDto.Query query);
    long countEmployees(@Param("query") EmployeePopupDto.Query query);
}
