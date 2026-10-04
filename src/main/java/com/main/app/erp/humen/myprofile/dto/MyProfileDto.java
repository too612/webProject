package com.main.app.erp.humen.myprofile.dto;

import java.util.List;

import lombok.Data;

public class MyProfileDto {

    @Data
    public static class Profile {
        private String employeeNo;
        private Boolean employeeLinked;
        private String nameKo;
        private String nameEn;
        private String profilePhotoUrl;
        private String deptName;
        private String gradeName;
        private String positionName;
        private String employmentTypeName;
        private String serviceStatusName;
        private String birthDate;
        private String genderCode;
        private String hireDate;
        private String retireDate;
        private String promotionDate;
        private String email;
        private String phone;
        private String postalCode;
        private String addressLine1;
        private String addressLine2;
        private List<Assignment> assignments;
        private List<Career> careers;
        private List<Education> educations;
    }

    @Data
    public static class ContactUpdate {
        private String email;
        private String phone;
        private String postalCode;
        private String addressLine1;
        private String addressLine2;
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
    public static class Education {
        private String educationKey;
        private String schoolTypeName;
        private String schoolName;
        private String admissionDate;
        private String graduationDate;
        private String graduationStatusName;
        private String degreeName;
        private String fieldName;
        private String major;
        private String minor;
        private Boolean finalEducation;
        private String remark;
    }
}
