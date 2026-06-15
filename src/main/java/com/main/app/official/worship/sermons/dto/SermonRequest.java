package com.main.app.official.worship.sermons.dto;

import lombok.Data;

@Data
public class SermonRequest {

    private Long rqstNo;
    private String title;
    private String cont;
    private String rqstId;
    private String preacherName;
    private String scriptureReference;
    private String sermonDate;
    private String worshipType;
    private Long parentNo;
    private Long groupNo;
    private Integer depth;
    private Integer orderNo;
    private String secret;
    private String password;
}
