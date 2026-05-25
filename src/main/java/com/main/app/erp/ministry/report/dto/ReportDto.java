package com.main.app.erp.ministry.report.dto;

import lombok.Data;

public class ReportDto {

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
