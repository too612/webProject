package com.main.app.official.about.people.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PeopleEducationRowDto {
    private String schoolTypeName;
    private String schoolName;
    private String degreeName;
    private String major;
    private String graduationStatusName;
    private LocalDate admissionDate;
    private LocalDate graduationDate;
    private boolean finalEducation;
}