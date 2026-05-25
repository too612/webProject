package com.main.app.mypage.user.inquiry.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InquiryPostDto {
    private String rqstNo;
    private String title;
    private String boardType;
    private LocalDateTime insDt;
    private Integer views;
}
