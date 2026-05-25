package com.main.app.erp.event.apply.dto;

import lombok.Data;

public class ApplyDto {

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