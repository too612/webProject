package com.main.app.erp.comm;

import lombok.Data;

public class CommDto {

    @Data
    public static class Notice {
        private String noticeId;
        private String title;
        private String content;
        private String authorName;
        private String publishDate;
        private String category;
        private String status;
        private String regDate;
    }

    @Data
    public static class Message {
        private String messageId;
        private String senderName;
        private String receiverName;
        private String title;
        private String content;
        private String sendDate;
        private String readDate;
        private String status;
    }

    @Data
    public static class Prayer {
        private String prayerId;
        private String memberName;
        private String title;
        private String content;
        private String status;
        private String regDate;
    }

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
