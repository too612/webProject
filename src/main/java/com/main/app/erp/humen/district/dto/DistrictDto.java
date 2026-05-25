package com.main.app.erp.humen.district.dto;

import lombok.Data;

public class DistrictDto {

    @Data
    public static class District {
        private String districtId;
        private String districtName;
        private String leaderName;
        private String description;
        private String status;
        private int memberCount;
    }
}
