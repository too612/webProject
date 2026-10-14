package com.main.app.common.popup.employee.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

public final class EmployeePopupDto {
    private EmployeePopupDto() {}

    @Data
    public static class Reorganization {
        private String reorgKey;
        private LocalDate reorgDt;
    }

    @Data
    public static class Department {
        private String deptKey;
        private String parentDeptKey;
        private String deptCd;
        private String deptNm;
    }

    @Data
    public static class Employee {
        private String personKey;
        private String employeeNo;
        private String nameKo;
        private String deptCd;
        private String deptName;
        private String gradeCode;
        private String gradeName;
        private String positionCode;
        private String positionName;
        private String serviceStatusCode;
        private String serviceStatusName;
    }

    @Data
    public static class CodeOption {
        private String code;
        private String name;
    }

    @Data
    public static class Query {
        private String reorgKey;
        private String personKey;
        private String nameKo;
        private String employeeNo;
        private String deptCd;
        private String deptName;
        private String gradeCode;
        private String positionCode;
        private String serviceStatusCode;
        private String sortField;
        private String sortDirection;
        private int page = 0;
        private int size = 50;

        public long getOffset() { return (long) page * size; }
    }

    public record Context(Reorganization reorganization, List<Department> departments,
            List<CodeOption> grades, List<CodeOption> positions, List<CodeOption> serviceStatuses) {}

    public record Result(List<Employee> content, long totalElements, int number, int size) {}
}
