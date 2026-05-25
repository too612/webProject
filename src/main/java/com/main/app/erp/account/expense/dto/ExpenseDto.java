package com.main.app.erp.account.expense.dto;

import lombok.Data;

public class ExpenseDto {

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
}
