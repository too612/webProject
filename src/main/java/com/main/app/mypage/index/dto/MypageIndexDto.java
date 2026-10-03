package com.main.app.mypage.index.dto;

import lombok.Data;

import java.util.List;

@Data
public class MypageIndexDto {

    public enum Source { LIVE, DEMO }

    private Source source;
    private String asOf;
    private String periodStart;
    private String periodEnd;
    private Stats stats;
    private List<MonthlyActivity> monthlyActivities;
    private List<Category> categories;
    private List<ActivityItem> recentActivities;

    @Data
    public static class Stats {
        private long totalActivities;
        private long periodActivities;
        private long currentMonthActivities;
        private long inquiryCount;
    }

    @Data
    public static class MonthlyActivity {
        private String month;
        private long count;
    }

    @Data
    public static class Category {
        private String label;
        private long count;
    }

    @Data
    public static class ActivityItem {
        private String title;
        private String type;
        private String date;
    }
}
