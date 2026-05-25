package com.main.app.erp.event.result.dto;

import lombok.Data;

public class ResultDto {

    @Data
    public static class Event {
        private String eventId;
        private String title;
        private String eventDate;
        private String endDate;
        private String location;
        private String description;
        private int capacity;
        private String organizer;
        private String status;
        private int applicantCount;
        private String regDate;
    }
}