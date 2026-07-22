package com.main.app.official.training.servicegroup.dto;

import lombok.Data;

import java.util.List;

@Data
public class ServiceGroupGroupDto {
    private String deptCode;
    private String title;
    private String description;
    private String leaderName;
    private String leaderRole;
    private String pastorName;
    private String elderName;
    private List<ServiceGroupMemberDto> members;
}