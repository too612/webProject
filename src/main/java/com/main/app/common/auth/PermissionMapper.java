package com.main.app.common.auth;

import com.main.app.common.auth.dto.UserPermissionDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PermissionMapper {

    List<String> selectRoleIdsByUserId(@Param("userId") String userId);

    List<UserPermissionDto> selectEffectivePermissionsByUserId(@Param("userId") String userId);
}
