package com.main.app.mypage.user.activity.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityPostDto {
    private String rqstNo;
    private String title;
    private String boardType;
    private LocalDateTime insDt;
    private Integer views;
}
