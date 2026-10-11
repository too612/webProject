package com.main.app.common.scheduler.dto;

import java.time.OffsetDateTime;

import lombok.Data;

@Data
public class SchedulerHistoryDto {
    private Long historyId;
    private String jobCode;
    private String triggerType;
    private String status;
    private OffsetDateTime scheduledAt;
    private OffsetDateTime startedAt;
    private OffsetDateTime finishedAt;
    private Long durationMs;
    private Integer processedCount;
    private String message;
    private String errorMessage;
    private String instanceId;
}