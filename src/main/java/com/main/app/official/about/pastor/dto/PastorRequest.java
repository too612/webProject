package com.main.app.official.about.pastor.dto;

import lombok.Data;

@Data
public class PastorRequest {
    private String corpName;
    private String businessRegistrationNumber;
    private String chiefName;
    private String chiefImagePath;
    private String phoneNumber;
    private String postalCode;
    private String addressLine1;
    private String addressLine2;
    private String introduction;
    private String createdBy;
    private String createdIp;
    private String updatedBy;
    private String updatedIp;
}
