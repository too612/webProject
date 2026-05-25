package com.main.app.erp.account.report.dto;

import lombok.Data;

import java.util.List;

public class ReportDto {

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

    @Data
    public static class Report {
        private java.math.BigDecimal income;
        private java.math.BigDecimal expense;
        private java.math.BigDecimal balance;
        private List<Offering> items;
    }
}
