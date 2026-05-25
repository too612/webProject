package com.main.app.official.support.faq.dto;

import lombok.Data;

@Data
public class FaqRequest {
    private String question;
    private String answer;
    private Integer orderNo;
}