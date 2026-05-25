package com.main.app.erp.account.manager.dto;

import lombok.Data;

public class ManagerDto {

    @Data
    public static class Offering {
        private String offeringId;
        private String memberId;
        private String memberName;
        private java.math.BigDecimal amount;
        private String offeringType;
        private String offeringDate;
        private String description;
        private String inputBy;
        private String regDate;
    }
}

