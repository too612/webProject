package com.main.app.erp.stats.ministry.dto;

import lombok.Data;

public class MinistryDto {

    @Data
    public static class MinistryStat {
        private String ministryName;
        private int memberCount;
        private int activityCount;
        private int volunteerCount;
    }
}
