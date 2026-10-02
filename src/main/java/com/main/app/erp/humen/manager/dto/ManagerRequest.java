package com.main.app.erp.humen.manager.dto;

import lombok.Data;

@Data
public class ManagerRequest {

    private String employeeNo;
    private String nameKo;
    private String nameEn;
    private String nameHanja;
    private String deptCd;
    private String gradeCode;
    private String positionCode;
    private String employmentTypeCode;
    private String serviceStatusCode;
    private String genderCode;
    private String birthDate;
    private String hireDate;
    private String postalCode;
    private String addressLine1;
    private String addressLine2;
}