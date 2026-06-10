package com.main.app.official.support.location.dto;

import lombok.Data;

@Data
public class LocationDto {
    private String title;
    private String subtitle;
    private String address;
    private String phone;
    private String hours;
    private String notice;
    private String naverMapUrl;
    private String kakaoMapUrl;
    private Double lat; // 위도
    private Double lng; // 경도
}
