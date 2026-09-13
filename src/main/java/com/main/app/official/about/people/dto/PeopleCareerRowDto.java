package com.main.app.official.about.people.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PeopleCareerRowDto {
    private String companyName;
    private LocalDate hireDate;
    private LocalDate retireDate;
    private String employmentTypeName;
    private String jobTitle;
    private String jobResponsibility;
}