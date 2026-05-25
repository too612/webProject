package com.main.app.erp.ministry.schedule.dto;

import lombok.Data;

public class ScheduleDto {

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
}
