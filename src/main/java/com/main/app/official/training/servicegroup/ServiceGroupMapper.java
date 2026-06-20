package com.main.app.official.training.servicegroup;

import com.main.app.official.training.servicegroup.dto.ServiceGroupDto;
import com.main.app.official.training.servicegroup.dto.ServiceGroupRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ServiceGroupMapper {

    ServiceGroupDto selectServiceGroup();

    int insertServiceGroup(ServiceGroupRequest request);

    int updateServiceGroup(@Param("id") Long id, @Param("request") ServiceGroupRequest request);

    int deleteServiceGroup(@Param("id") Long id);
}