package com.main.app.erp.humen.manager;

import com.main.app.erp.humen.manager.dto.ManagerDto;
import com.main.app.erp.humen.manager.dto.ManagerRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ManagerMapper {

    List<ManagerDto.Person> selectPersonList(@Param("condition") ManagerDto.SearchCondition condition);

    long countPersonList(@Param("condition") ManagerDto.SearchCondition condition);

    List<ManagerDto.CodeOption> selectCodeOptions(@Param("parentCode") String parentCode);

    List<ManagerDto.CodeOption> selectDepartmentOptions();

    ManagerDto.PersonDetail selectPersonDetail(@Param("employeeNo") String employeeNo);

    List<ManagerDto.Career> selectCareerList(@Param("personKey") String personKey);

    List<ManagerDto.Assignment> selectAssignmentList(@Param("personKey") String personKey);

    int countByEmployeeNo(@Param("employeeNo") String employeeNo);

    int insertPerson(@Param("person") ManagerRequest person, @Param("regUser") String regUser);

    String selectEmployeeNoForUpdate(@Param("personKey") String personKey);

    int updateBasicInfo(@Param("personKey") String personKey,
            @Param("person") ManagerDto.BasicInfoUpdate person, @Param("audit") ManagerDto.Audit audit);

    int updateProfilePhoto(@Param("personKey") String personKey,
            @Param("profilePhotoUrl") String profilePhotoUrl, @Param("audit") ManagerDto.Audit audit);
}
