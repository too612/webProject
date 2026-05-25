package com.main.app.official.worship.time.dto;

import lombok.Data;

@Data
public class TimeDto {
    private String category;
    private String title;
    private String time;
    private String note;
    private String location;
    private Integer orderNo;
}
