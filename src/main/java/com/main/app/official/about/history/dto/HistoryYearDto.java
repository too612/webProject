package com.main.app.official.about.history.dto;

import lombok.Data;

@Data
public class HistoryYearDto {
    private Long historyId;
    private String yearLabel;
    private Integer yearNo;
    private Integer sortOrder;
}
