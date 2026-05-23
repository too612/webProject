package com.main.app.official.about.pastor.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class PastorDto {
    private Long corpId;
    private String corpName;
    private String businessRegistrationNumber;
    private String chiefName;
    private String chiefImagePath;
    private String phoneNumber;
    private String postalCode;
    private String addressLine1;
    private String addressLine2;
    private String introduction;
    private OffsetDateTime updatedAt;
}
