package com.main.app.official.training.servicegroup;

import com.main.app.official.training.servicegroup.dto.ServiceGroupDto;
import com.main.app.official.training.servicegroup.dto.ServiceGroupGroupDto;
import com.main.app.official.training.servicegroup.dto.ServiceGroupMemberDto;
import com.main.app.official.training.servicegroup.dto.ServiceGroupRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ServiceGroupMapper {

    ServiceGroupDto selectServiceGroup();

    List<ServiceGroupGroupDto> selectServiceGroups(@Param("parentDeptCd") String parentDeptCd);

    List<ServiceGroupMemberDto> selectServiceMembers(@Param("deptCode") String deptCode);

    int insertServiceGroup(ServiceGroupRequest request);

    int updateServiceGroup(@Param("id") Long id, @Param("request") ServiceGroupRequest request);

    int deleteServiceGroup(@Param("id") Long id);
}