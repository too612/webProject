package com.main.app.official.news.announcement.dto;

import lombok.Data;

@Data
public class AnnouncementRequest {
    private String rqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private String groupNo;
    private String parentNo;
    private Integer depth;
    private Integer orderNo;
    private String secret;
    private String password;
}