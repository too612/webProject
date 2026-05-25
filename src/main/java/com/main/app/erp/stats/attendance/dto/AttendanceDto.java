package com.main.app.erp.stats.attendance.dto;

import lombok.Data;

public class AttendanceDto {

    @Data
    public static class AttendanceStat {
        private String date;
        private int total;
        private int present;
        private int absent;
        private double rate;
    }
}
