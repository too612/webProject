package com.main.app.erp.sermon.archive.dto;

import lombok.Data;

public class ArchiveDto {

    @Data
    public static class Archive {
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
