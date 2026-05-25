package com.main.app.system.user.manager.dto;

import lombok.Data;

@Data
public class UserManagerRequest {
    private Integer page;
    private Integer size;
    private String keyword;
}