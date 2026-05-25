package com.main.app.erp.admin.approval.dto;

import lombok.Data;

public class ApprovalDto {

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
}

