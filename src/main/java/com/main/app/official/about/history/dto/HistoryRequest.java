package com.main.app.official.about.history.dto;

import lombok.Data;

import java.util.List;

@Data
public class HistoryRequest {
    private List<YearItem> timeline;
    private List<Long> deletedFileIds;

    @Data
    public static class YearItem {
        private Long historyId;
        private String year;
        private List<EventItem> events;
    }

    @Data
    public static class EventItem {
        private Long eventId;
        private String date;
        private String description;
        private List<String> images; // 첨부 fileId 문자열 또는 레거시 정적 경로
    }
}

