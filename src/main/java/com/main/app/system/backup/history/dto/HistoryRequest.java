package com.main.app.system.backup.history.dto;

import lombok.Data;

@Data
public class HistoryRequest {
    private Integer page;
    private Integer size;
    private String keyword;
}