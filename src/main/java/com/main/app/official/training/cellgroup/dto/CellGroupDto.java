package com.main.app.official.training.cellgroup.dto;

import lombok.Data;

import java.util.List;

@Data
public class CellGroupDto {
    private String headline;
    private String summary;
    private List<CellGroupGroupDto> groups;
}