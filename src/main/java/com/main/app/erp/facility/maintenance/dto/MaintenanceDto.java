package com.main.app.erp.facility.maintenance.dto;

import lombok.Data;

import java.math.BigDecimal;

public class MaintenanceDto {

    @Data
    public static class Maintenance {
        private String maintenanceId;
        private String facilityName;
        private String title;
        private String maintenanceDate;
        private String description;
        private BigDecimal cost;
        private String status;
        private String regDate;
    }
}
