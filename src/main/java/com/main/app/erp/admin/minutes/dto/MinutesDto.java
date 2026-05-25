package com.main.app.erp.admin.minutes.dto;

import lombok.Data;

public class MinutesDto {

    @Data
    public static class Minutes {
        private String minutesId;
        private String title;
        private String meetingDate;
        private String participants;
        private String content;
        private String authorName;
        private String regDate;
    }
}

