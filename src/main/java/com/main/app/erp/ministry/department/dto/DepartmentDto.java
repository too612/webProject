package com.main.app.erp.ministry.department.dto;

import lombok.Data;

public class DepartmentDto {

    @Data
    public static class Department {
        private String deptId;
        private String deptName;
        private String leaderName;
        private String parentId;
        private String description;
        private String status;
        private int volunteerCount;
        private String regDate;
    }
}
