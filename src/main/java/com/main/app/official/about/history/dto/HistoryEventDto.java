package com.main.app.official.about.history.dto;

import lombok.Data;

@Data
public class HistoryEventDto {
    private Long historyId;
    private String eventDate;
    private String description;
    private String images; // JSON 배열 문자열 (JSONB → TEXT)
}
