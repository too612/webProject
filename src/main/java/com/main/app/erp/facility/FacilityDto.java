package com.main.app.erp.facility;

import lombok.Data;

public class FacilityDto {

    @Data
    public static class Reservation {
        private String reservationId;
        private String facilityName;
        private String reserverName;
        private String reservationDate;
        private String startTime;
        private String endTime;
        private String purpose;
        private String status;
        private String regDate;
    }

    @Data
    public static class Vehicle {
        private String vehicleId;
        private String vehicleName;
        private String plateNumber;
        private String driver;
        private Integer capacity;
        private String status;
    }

    @Data
    public static class Inventory {
        private String inventoryId;
        private String itemName;
        private String category;
        private int quantity;
        private String unit;
        private String location;
        private String status;
        private String regDate;
    }

    @Data
    public static class Maintenance {
        private String maintenanceId;
        private String facilityName;
        private String title;
        private String maintenanceDate;
        private String description;
        private java.math.BigDecimal cost;
        private String status;
        private String regDate;
    }
}
