package com.main.app.system.log.audit.dto;

import lombok.Data;

@Data
public class AuditLogDto {
    private String timestamp;
    private String userId;
    private String action;
    private String target;
    private String result;
}