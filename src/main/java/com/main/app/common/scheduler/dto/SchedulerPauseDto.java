package com.main.app.common.scheduler.dto;

import java.time.OffsetDateTime;

import lombok.Data;

@Data
public class SchedulerPauseDto {
    private Long pauseId;
    private String jobCode;
    private OffsetDateTime pauseStartAt;
    private OffsetDateTime pauseEndAt;
    private String reason;
}