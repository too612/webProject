package com.main.app.common.auth.dto;

import lombok.Data;

@Data
public class TermsPolicyDto {
    private String termsType;
    private String termsVersion;
    private String title;
    private String content;
    private Boolean isRequired;
}
