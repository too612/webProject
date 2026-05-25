package com.main.app.system.user.manager.dto;

import lombok.Data;

@Data
public class UserManagerDto {
    private String id;
    private String name;
    private String role;
    private String status;
    private String lastLogin;
}