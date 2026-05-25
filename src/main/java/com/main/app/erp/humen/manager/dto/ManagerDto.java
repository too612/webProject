package com.main.app.erp.humen.manager.dto;

import lombok.Data;

public class ManagerDto {

    @Data
    public static class Member {
        private String memberId;
        private String name;
        private String district;
        private String phone;
        private String registeredAt;
    }
}
