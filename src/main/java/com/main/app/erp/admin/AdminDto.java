package com.main.app.erp.admin;

import lombok.Data;

public class AdminDto {

    @Data
    public static class Certificate {
        private String certificateId;
        private String memberName;
        private String certType;
        private String issueDate;
        private String status;
        private String reqDate;
    }

    @Data
    public static class Approval {
        private String approvalId;
        private String title;
        private String requesterName;
        private String submitDate;
        private String approverName;
        private String approveDate;
        private String status;
    }

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
