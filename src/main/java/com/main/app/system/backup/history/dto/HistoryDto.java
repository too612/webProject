package com.main.app.system.backup.history.dto;

import lombok.Data;

@Data
public class HistoryDto {
    private String backupId;
    private String target;
    private String startTime;
    private String endTime;
    private String size;
    private String result;
}