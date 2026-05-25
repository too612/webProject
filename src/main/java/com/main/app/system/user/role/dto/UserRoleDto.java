package com.main.app.system.user.role.dto;

import lombok.Data;

@Data
public class UserRoleDto {
    private String roleId;
    private String roleName;
    private String description;
    private Integer userCount;
}