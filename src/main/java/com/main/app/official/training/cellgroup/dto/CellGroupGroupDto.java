package com.main.app.official.training.cellgroup.dto;

import lombok.Data;

import java.util.List;

@Data
public class CellGroupGroupDto {
    private String deptCode;
    private String title;
    private String subtitle;
    private String description;
    private String pastorName;
    private String elderName;
    private String meetingInfo;
    private String imageUrl;
    private List<CellGroupMemberDto> members;
}
