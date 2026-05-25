package com.main.app.erp.comm.message.dto;

import lombok.Data;

public class MessageDto {

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
}

