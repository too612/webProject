package com.main.app.official.news.eventcalendar.dto;

import lombok.Data;

@Data
public class EventCalendarRequest {
    private Long eventCalendarId;
    private String title;
    private String content;
    private String createdBy;
    private String createdIp;
    private String updatedBy;
    private String updatedIp;
}
