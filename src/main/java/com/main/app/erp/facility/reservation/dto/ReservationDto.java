package com.main.app.erp.facility.reservation.dto;

import lombok.Data;

public class ReservationDto {

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
}