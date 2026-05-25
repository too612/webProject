package com.main.app.erp.facility.vehicle.dto;

import lombok.Data;

public class VehicleDto {

    @Data
    public static class Vehicle {
        private String vehicleId;
        private String vehicleName;
        private String plateNumber;
        private String driver;
        private Integer capacity;
        private String status;
    }
}