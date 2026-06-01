package com.main.app.common.corp.dto;

import lombok.Data;

@Data
public class CorpDto {
    private String corpName;
    private String postalCode;
    private String addressLine1;
    private String addressLine2;
    private String chiefName;
    private String businessRegistrationNumber;
    private String phoneNumber;
    private String sessIp;
}