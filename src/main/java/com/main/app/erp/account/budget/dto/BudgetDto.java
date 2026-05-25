package com.main.app.erp.account.budget.dto;

import lombok.Data;

public class BudgetDto {

    @Data
    public static class Budget {
        private String budgetId;
        private int budgetYear;
        private String category;
        private java.math.BigDecimal plannedAmount;
        private String description;
        private String status;
    }
}
