package com.main.app.erp.admin.certificate.dto;

import lombok.Data;

public class CertificateDto {

    @Data
    public static class Certificate {
        private String certificateId;
        private String memberName;
        private String certType;
        private String issueDate;
        private String status;
        private String reqDate;
    }
}

