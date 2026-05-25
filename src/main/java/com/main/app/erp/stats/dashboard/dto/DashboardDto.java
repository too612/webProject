package com.main.app.erp.stats.dashboard.dto;

import lombok.Data;

import java.math.BigDecimal;

public class DashboardDto {

    @Data
    public static class Summary {
        private int totalMembers;
        private int newMembers;
        private double avgAttendance;
        private BigDecimal totalOffering;
    }
}
