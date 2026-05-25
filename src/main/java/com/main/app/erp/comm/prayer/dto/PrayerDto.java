package com.main.app.erp.comm.prayer.dto;

import lombok.Data;

public class PrayerDto {

    @Data
    public static class Prayer {
        private String prayerId;
        private String memberName;
        private String title;
        private String content;
        private String status;
        private String regDate;
    }
}

