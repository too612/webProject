package com.main.app.system.config.code.dto;

import lombok.Data;

@Data
public class CodeRequest {
    private Integer page;
    private Integer size;
    private String keyword;
}