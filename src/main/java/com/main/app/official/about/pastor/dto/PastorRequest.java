package com.main.app.official.about.pastor.dto;

import lombok.Data;

import java.util.List;

@Data
public class PastorRequest {
    private Long corpId;
    private String corpName;
    private String businessRegistrationNumber;
    private String chiefName;
    private String phoneNumber;
    private String postalCode;
    private String addressLine1;
    private String addressLine2;
    private String introduction;
    private List<Long> deletedFileIds;
    private String createdBy;
    private String createdIp;
    private String updatedBy;
    private String updatedIp;
}
