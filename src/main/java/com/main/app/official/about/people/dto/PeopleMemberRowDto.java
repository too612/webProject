package com.main.app.official.about.people.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PeopleMemberRowDto {
    private String employeeNo;
    private String nameKo;
    private String gradeCode;
    private String gradeName;
    private String positionCode;
    private String positionName;
    private String employmentTypeName;
    private String serviceStatusName;
    private String profilePhotoUrl;
    private String photoUrl;
    private String aiSummary;
    private String deptName;
    private String dutyName;
    private LocalDate hireDate;
}
