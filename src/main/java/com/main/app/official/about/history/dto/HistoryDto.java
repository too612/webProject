package com.main.app.official.about.history.dto;

import lombok.Data;

import java.util.List;

@Data
public class HistoryDto {
    private List<TimelineItem> timeline;

    @Data
    public static class TimelineItem {
        private String year;
        private List<EventItem> events;
    }

    @Data
    public static class EventItem {
        private String date;
        private String description;
        private List<String> images;   // 표시용 이미지 URL
        private List<String> imageIds; // 편집용 첨부 fileId 목록
    }
}

