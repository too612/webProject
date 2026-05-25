package com.main.app.community.index.dto;

import lombok.Data;
import java.util.List;

@Data
public class CommunityIndexDto {

    /** 최근 게시글 (최대 5건) */
    private List<PostItem> recentPosts;

    /** 공지사항 (최대 3건) */
    private List<NoticeItem> notices;

    /** 활동 소식 (최대 5건) */
    private List<ActivityItem> activities;

    /** 커뮤니티 통계 */
    private Stats stats;

    @Data
    public static class PostItem {
        private String id;
        private String category;
        private String title;
        private String author;
        private String date;
        private Integer views;
    }

    @Data
    public static class NoticeItem {
        private String id;
        private String title;
        private String date;
    }

    @Data
    public static class ActivityItem {
        private String id;
        private String category;
        private String title;
        private String date;
    }

    @Data
    public static class Stats {
        private long totalMembers;
        private long totalPosts;
    }
}
