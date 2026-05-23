package com.main.app.erp.humen;

import lombok.Data;

public class HumenDto {

    @Data
    public static class Member {
        private String memberId;
        private String name;
        private String gender;
        private String birthDate;
        private String phone;
        private String email;
        private String address;
        private String districtId;
        private String districtName;
        private String joinDate;
        private String memberType;
        private String status;
        private String regDate;
    }

    @Data
    public static class District {
        private String districtId;
        private String districtName;
        private String leaderName;
        private String description;
        private String status;
        private int memberCount;
    }

    @Data
    public static class Change {
        private String changeId;
        private String memberId;
        private String memberName;
        private String changeType;
        private String changeDate;
        private String prevStatus;
        private String newStatus;
        private String reason;
        private String regDate;
    }
}
