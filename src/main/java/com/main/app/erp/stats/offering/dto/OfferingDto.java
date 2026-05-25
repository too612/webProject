package com.main.app.erp.stats.offering.dto;

import lombok.Data;

public class OfferingDto {

    @Data
    public static class OfferingStat {
        private String month;
        private long tithe;
        private long mission;
        private long special;
        private long other;
        private long total;
    }
}
