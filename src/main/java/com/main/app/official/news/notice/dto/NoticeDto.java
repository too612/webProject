package com.main.app.official.news.notice.dto;

import lombok.Data;

@Data
public class NoticeDto {
    private String rqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private java.time.LocalDateTime insDt;
    private java.time.LocalDateTime uptDt;
    private Integer views;
    private String boardType;
    private String groupNo;
    private String parentNo;
    private Integer depth;
    private Integer orderNo;
    private boolean hasFile;
    private Long totalFileSize;
    private String secret;
    private String password;
    private Integer commentCount;
}