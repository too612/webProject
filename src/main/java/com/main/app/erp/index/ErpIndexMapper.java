package com.main.app.erp.index;

import com.main.app.erp.index.dto.ErpIndexDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ErpIndexMapper {

    long selectTotalMembers();

    long selectActiveMemberCount();

    long selectNewMemberCount();

    long selectDepartmentCount();

    List<ErpIndexDto.MonthlyRegistration> selectMonthlyRegistrations();

    List<ErpIndexDto.MemberCategory> selectServiceStatusDistribution();

    List<ErpIndexDto.MemberCategory> selectEmploymentDistribution();

    List<ErpIndexDto.DepartmentStaff> selectDepartmentStaff();
}
