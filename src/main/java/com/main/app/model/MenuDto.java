package com.main.app.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MenuDto {
    private String menuId;
    private String menuName;
    private String menuUrl;
    private String parentId;
    private String path;
    private int level;
    private int orderNo;
    private List<MenuDto> subMenus = new ArrayList<>();
}