package com.main.app.official.news.mission.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MissionDto {
    private String employeeNo;
    private String personKey;
    private String name;
    private String country;
    private String countryCode;
    private String city;
    private String region;
    private Double latitude;
    private Double longitude;
    private LocalDate dispatchedDate;
    private LocalDate dispatchDate;
    private String assignmentContent;
    private String groupKey;
}