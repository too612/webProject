package com.main.app.erp.admin.archive.dto;

import lombok.Data;

public class ArchiveDto {

    @Data
    public static class Archive {
        private String archiveId;
        private String title;
        private String docType;
        private String filePath;
        private String regBy;
        private String status;
        private String regDate;
    }
}

