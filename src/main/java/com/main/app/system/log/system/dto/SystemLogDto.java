package com.main.app.system.log.system.dto;

import lombok.Data;

@Data
public class SystemLogDto {
    private String timestamp;
    private String level;
    private String category;
    private String message;
    private String ip;
}