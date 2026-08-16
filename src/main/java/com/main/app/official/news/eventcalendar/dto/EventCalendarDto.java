package com.main.app.official.news.eventcalendar.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventCalendarDto {
    private Long eventCalendarId;
    private String title;
    private String content;
    private OffsetDateTime updatedAt;
}
