package com.main.app.system.log.audit.dto;

import lombok.Data;

@Data
public class AuditLogRequest {
    private Integer page;
    private Integer size;
    private String keyword;
}