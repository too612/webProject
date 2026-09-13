package com.main.app.official.news.eventcalendar.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventCalendarRequest {
    private String eventKey;
    private String categoryCd;
    private String title;
    private String description;
    private OffsetDateTime startDtm;
    private OffsetDateTime endDtm;
    private String allDayYn;
    private String locationNm;
    private String colorCd;
    private String updatedBy;
    private String updatedIp;
}
