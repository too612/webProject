package com.main.app.erp.ministry;

import lombok.Data;

public class MinistryDto {

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

    @Data
    public static class Schedule {
        private String scheduleId;
        private String deptId;
        private String deptName;
        private String title;
        private String scheduleDate;
        private String description;
        private String status;
        private String regDate;
    }

    @Data
    public static class Volunteer {
        private String volunteerId;
        private String memberId;
        private String memberName;
        private String deptId;
        private String deptName;
        private String role;
        private String startDate;
        private String endDate;
        private String status;
    }

    @Data
    public static class Report {
        private String reportId;
        private String deptId;
        private String deptName;
        private String title;
        private String reportDate;
        private String content;
        private String authorName;
        private String regDate;
    }
}
