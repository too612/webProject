package com.main.app.official.worship.live.dto;

import lombok.Data;

@Data
public class LiveStreamStatusDto {
    /** 현재 실시간 라이브 방송 중인지 여부 */
    private boolean live;
    /** API 호출 성공 여부 (false면 프론트가 기존 live_stream embed로 폴백) */
    private boolean available;
    /** 현재 라이브 영상 ID */
    private String videoId;
    /** 라이브 영상 제목 */
    private String title;
    /** 채널 URL */
    private String channelUrl;
}
