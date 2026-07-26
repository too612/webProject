package com.main.app.common.auth.dto;

import lombok.Data;

@Data
public class UserTermsConsentDto {
    private Long userSeq;
    private String termsType;
    private String termsVersion;
    private Boolean isRequired;
    private Boolean isAgreed;
    private String consentSource;
    private String consentIp;
    private String userAgent;
}
