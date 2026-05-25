package com.main.app.system.log.system.dto;

import lombok.Data;

@Data
public class SystemLogRequest {
    private Integer page;
    private Integer size;
    private String keyword;
}