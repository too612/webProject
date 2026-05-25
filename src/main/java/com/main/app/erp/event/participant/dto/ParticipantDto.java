package com.main.app.erp.event.participant.dto;

import lombok.Data;

public class ParticipantDto {

    @Data
    public static class Participant {
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