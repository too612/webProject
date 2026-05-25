package com.main.app.community.world.christian.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChristianDto {
    private String rqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private LocalDateTime insDt;
    private LocalDateTime uptDt;
    private Integer views;
    private String groupNo;
    private String parentNo;
    private Integer depth;
    private Integer orderNo;
    private String secret;
    private String password;
    private String boardType;
}