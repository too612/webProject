package com.main.app.erp.sermon.manager.dto;

import lombok.Data;

public class ManagerDto {

    @Data
    public static class Worship {
        private String worshipId;
        private String title;
        private String preacher;
        private String scripture;
        private String worshipDate;
        private String worshipType;
        private String videoUrl;
        private String description;
        private String status;
        private String regDate;
    }
}
