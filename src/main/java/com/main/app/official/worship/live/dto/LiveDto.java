package com.main.app.official.worship.live.dto;

import lombok.Data;

@Data
public class LiveDto {
    private String tabType;
    private String title;
    private String description;
    private String linkUrl;
    private String cta;
    private String thumbnailUrl; // 유튜브 썸네일 경로
    private String videoId; // 유튜브 영상 고유 ID
    private Integer orderNo;
}
