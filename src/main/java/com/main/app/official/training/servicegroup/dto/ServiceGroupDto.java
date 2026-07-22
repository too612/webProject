package com.main.app.official.training.servicegroup.dto;

import lombok.Data;

import java.util.List;

@Data
public class ServiceGroupDto {
    private String headline;
    private String summary;
    private String parentDepartmentName;
    private String parentDepartmentLeader;
    private String parentDepartmentLeaderRole;
    private String parentDepartmentDescription;
    private List<ServiceGroupGroupDto> groups;
}