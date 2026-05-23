package com.main.app.erp.account;

import lombok.Data;

public class AccountDto {

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
    public static class Budget {
        private String budgetId;
        private int budgetYear;
        private String category;
        private java.math.BigDecimal plannedAmount;
        private String description;
        private String status;
    }

    @Data
    public static class Expense {
        private String expenseId;
        private String expenseDate;
        private String category;
        private java.math.BigDecimal amount;
        private String description;
        private String approvedBy;
        private String regDate;
    }

    @Data
    public static class Report {
        private java.math.BigDecimal income;
        private java.math.BigDecimal expense;
        private java.math.BigDecimal balance;
        private java.util.List<Offering> items;
    }
}
