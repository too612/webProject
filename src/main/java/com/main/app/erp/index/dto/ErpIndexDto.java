package com.main.app.erp.index.dto;

import lombok.Data;

import java.util.List;

@Data
public class ErpIndexDto {

    private long totalMembers;
    private long activeMemberCount;
    private long newMemberCount;
    private long departmentCount;
    private List<MonthlyRegistration> monthlyRegistrations;
    private List<MemberCategory> serviceStatusDistribution;
    private List<MemberCategory> employmentDistribution;
    private List<DepartmentStaff> departmentStaff;

    @Data
    public static class MonthlyRegistration {
        private String month;
        private long count;
    }

    @Data
    public static class MemberCategory {
        private String code;
        private String label;
        private long count;
    }

    @Data
    public static class DepartmentStaff {
        private String departmentCode;
        private String department;
        private long staffCount;
    }
}
