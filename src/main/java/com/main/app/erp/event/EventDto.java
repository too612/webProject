package com.main.app.erp.event;

import lombok.Data;

public class EventDto {

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

    @Data
    public static class Apply {
        private String applyId;
        private String eventId;
        private String eventTitle;
        private String eventDate;
        private String memberId;
        private String memberName;
        private String applyDate;
        private String status;
    }
}
