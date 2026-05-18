package com.main.app.common.dto;

import java.util.ArrayList;
import java.util.List;

public class MenuDto {
    private String menuId;
    private String menuName;
    private String menuUrl;
    private String parentId;
    private String path;
    private int level;
    private int orderNo;
    private List<MenuDto> subMenus = new ArrayList<>();
    private boolean active = false;

    public String getMenuId() {
        return menuId;
    }

    public void setMenuId(String menuId) {
        this.menuId = menuId;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public String getMenuUrl() {
        return menuUrl;
    }

    public void setMenuUrl(String menuUrl) {
        this.menuUrl = menuUrl;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(int orderNo) {
        this.orderNo = orderNo;
    }

    public List<MenuDto> getSubMenus() {
        return subMenus;
    }

    public void setSubMenus(List<MenuDto> subMenus) {
        this.subMenus = subMenus;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
