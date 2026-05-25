package com.main.app.erp.sermon.write.dto;

import lombok.Data;

public class WriteDto {

    @Data
    public static class WriteRequest {
        private String title;
        private String preacher;
        private String scripture;
        private String content;
        private String sermonDate;
    }
}
