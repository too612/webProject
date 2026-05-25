package com.main.app.system.config.menu.dto;

import lombok.Data;

@Data
public class MenuDto {
    private String menuId;
    private String menuName;
    private String path;
    private Integer level;
    private String visibleRole;
}