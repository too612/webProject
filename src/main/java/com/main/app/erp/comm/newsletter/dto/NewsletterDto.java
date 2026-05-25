package com.main.app.erp.comm.newsletter.dto;

import lombok.Data;

public class NewsletterDto {

    @Data
    public static class Newsletter {
        private String newsletterId;
        private String title;
        private String content;
        private String authorName;
        private String publishDate;
        private String status;
        private String regDate;
    }
}
