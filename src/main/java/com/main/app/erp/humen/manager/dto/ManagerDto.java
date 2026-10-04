package com.main.app.erp.humen.manager.dto;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

public class ManagerDto {

    @Data
    public static class Person {
        private String personKey;
        private String employeeNo;
        private String nameKo;
        private String nameEn;
        private String profilePhotoUrl;
        private String deptCd;
        private String deptName;
        private String gradeCode;
        private String gradeName;
        private String positionCode;
        private String positionName;
        private String employmentTypeCode;
        private String employmentTypeName;
        private String serviceStatusCode;
        private String serviceStatusName;
        private String hireDate;
    }

    @Data
    @EqualsAndHashCode(callSuper = true)
    public static class PersonDetail extends Person {
        private String nameHanja;
        private String birthDate;
        private String genderCode;
        private String postalCode;
        private String addressLine1;
        private String addressLine2;
        private String retireDate;
        private String promotionDate;
        private String photoUrl;
        private String aiSummary;
        private List<Career> careers;
        private List<Assignment> assignments;
    }

    @Data
    public static class Career {
        private String careerKey;
        private String companyName;
        private String jobTitle;
        private String jobResponsibility;
        private String hireDate;
        private String retireDate;
        private String employmentTypeName;
        private String remark;
    }

    @Data
    public static class Assignment {
        private String assignmentKey;
        private String assignmentDate;
        private String assignmentEndDate;
        private String assignmentTypeName;
        private String deptName;
        private String gradeName;
        private String positionName;
        private String jobTitleName;
        private String assignmentContent;
        private String concurrentAssignmentYn;
        private String remark;
    }

    @Data
    public static class CodeOption {
        private String code;
        private String name;
    }

    @Data
    public static class FilterOptions {
        private List<CodeOption> departments;
        private List<CodeOption> grades;
        private List<CodeOption> positions;
        private List<CodeOption> employmentTypes;
        private List<CodeOption> serviceStatuses;
    }

    @Data
    public static class ListQuery {
        private int page;
        private int size = 10;
        private String keyword;
        private String deptCd;
        private String gradeCode;
        private String positionCode;
        private String employmentTypeCode;
        private String serviceStatusCode;
        private String sortField = "employeeNo";
        private String sortDirection = "asc";
    }

    @Data
    public static class SearchCondition {
        private String keyword;
        private String deptCd;
        private String gradeCode;
        private String positionCode;
        private String employmentTypeCode;
        private String serviceStatusCode;
        private String sortField;
        private String sortDirection;
        private long offset;
        private int limit;
    }
}
