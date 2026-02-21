package com.main.app.official.dto;

import lombok.Data;

@Data
public class CompanyInfo {
    private String name;
    private String address;
    private String city;
    private String state;
    private String zip;
    
    public CompanyInfo() {}
}