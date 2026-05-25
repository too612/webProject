package com.main.app.official.index.dto;

import lombok.Data;
import java.util.List;

@Data
public class OfficialIndexDto {

    /** 최근 설교 목록 (최대 4건) */
    private List<Item> recentSermons;

    /** 최근 공지 목록 (최대 4건) */
    private List<Item> recentAnnouncements;

    @Data
    public static class Item {
        private String id;
        private String title;
        private String date;
    }
}
