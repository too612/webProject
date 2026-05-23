package com.main.app.erp.sermon;

import lombok.Data;

public class SermonErpDto {

    @Data
    public static class Worship {
        private String worshipId;
        private String title;
        private String preacher;
        private String scripture;
        private String worshipDate;
        private String worshipType;
        private String videoUrl;
        private String description;
        private String status;
        private String regDate;
    }

    @Data
    public static class Order {
        private String orderId;
        private String worshipId;
        private String worshipTitle;
        private String worshipDate;
        private int orderSeq;
        private String roleName;
        private String participant;
    }

    @Data
    public static class Attendance {
        private String attendanceId;
        private String worshipId;
        private String worshipTitle;
        private String memberId;
        private String memberName;
        private String attendDate;
        private String status;
    }
}
