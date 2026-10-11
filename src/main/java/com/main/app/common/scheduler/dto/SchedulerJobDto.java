package com.main.app.common.scheduler.dto;

import java.time.OffsetDateTime;

import lombok.Data;

@Data
public class SchedulerJobDto {
    private String jobCode;
    private String jobName;
    private String cronExpression;
    private String zoneId;
    private String businessCode;
    private Boolean enabled;
    private Boolean runOnStartup;
    private Boolean catchupEnabled;
    private Integer lockTimeoutSeconds;
    private OffsetDateTime lastStartedAt;
    private OffsetDateTime lastSuccessAt;
    private String lastStatus;
}