package com.main.app.common.scheduler.dto;

import java.time.OffsetDateTime;

import lombok.Data;

@Data
public class SchedulerBusinessHoldDto {
    private Long holdId;
    private String businessCode;
    private OffsetDateTime holdStartAt;
    private OffsetDateTime holdEndAt;
    private String reason;
}