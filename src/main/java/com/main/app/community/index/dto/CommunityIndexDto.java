package com.main.app.community.index.dto;

import lombok.Data;
import java.util.List;

@Data
public class CommunityIndexDto {

    private String source;
    private String asOf;
    private String periodStart;
    private String periodEnd;
    private List<PostItem> recentPosts;
    private List<MonthlyPosts> monthlyPosts;
    private List<Category> categories;
    private Stats stats;

    @Data
    public static class PostItem {
        private String category;
        private String path;
        private String param;
        private String title;
        private String date;
        private long views;
    }

    @Data
    public static class MonthlyPosts {
        private String month;
        private long count;
    }

    @Data
    public static class Category {
        private String code;
        private String label;
        private String path;
        private String param;
        private long count;
        private long periodCount;
    }

    @Data
    public static class Stats {
        private long totalPosts;
        private long contributors;
        private long currentMonthPosts;
        private long totalViews;
        private long periodPosts;
    }
}
