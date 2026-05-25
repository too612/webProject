package com.main.app.erp.comm.notice.dto;

import lombok.Data;

public class NoticeDto {

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
}

