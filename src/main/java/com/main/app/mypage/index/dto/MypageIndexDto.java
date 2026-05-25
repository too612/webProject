package com.main.app.mypage.index.dto;

import lombok.Data;

import java.util.List;

@Data
public class MypageIndexDto {

    private long activityCount;
    private long inquiryCount;
    private long notificationCount;
    private List<ActivityItem> recentActivities;

    @Data
    public static class ActivityItem {
        private String id;
        private String title;
        private String type;
        private String date;
    }
}
