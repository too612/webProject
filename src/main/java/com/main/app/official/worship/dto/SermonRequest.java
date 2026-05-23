package com.main.app.official.worship.dto;

import lombok.Data;

@Data
public class SermonRequest {

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
