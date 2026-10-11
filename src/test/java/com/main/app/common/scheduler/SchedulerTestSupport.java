package com.main.app.common.scheduler;

import java.time.OffsetDateTime;

import com.main.app.common.scheduler.dto.SchedulerBusinessHoldDto;
import com.main.app.common.scheduler.dto.SchedulerJobDto;
import com.main.app.common.scheduler.dto.SchedulerPauseDto;

final class SchedulerTestSupport {

    static final String CODE = "HRM_ASSIGNMENT_SYNC";
    static final String BUSINESS = SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT;

    private SchedulerTestSupport() {
    }

    static SchedulerJobDto job(String code, boolean enabled) {
        SchedulerJobDto dto = new SchedulerJobDto();
        dto.setJobCode(code);
        dto.setJobName(code);
        dto.setCronExpression("0 0/30 * * * *");
        dto.setZoneId("Asia/Seoul");
        dto.setBusinessCode(BUSINESS);
        dto.setEnabled(enabled);
        dto.setRunOnStartup(false);
        dto.setCatchupEnabled(false);
        dto.setLockTimeoutSeconds(1800);
        return dto;
    }

    static SchedulerPauseDto pause(String code, OffsetDateTime end, String reason) {
        SchedulerPauseDto dto = new SchedulerPauseDto();
        dto.setPauseId(1L);
        dto.setJobCode(code);
        dto.setPauseStartAt(end.minusHours(2));
        dto.setPauseEndAt(end);
        dto.setReason(reason);
        return dto;
    }

    static SchedulerBusinessHoldDto hold(String businessCode, OffsetDateTime end, String reason) {
        SchedulerBusinessHoldDto dto = new SchedulerBusinessHoldDto();
        dto.setHoldId(1L);
        dto.setBusinessCode(businessCode);
        dto.setHoldStartAt(end.minusHours(2));
        dto.setHoldEndAt(end);
        dto.setReason(reason);
        return dto;
    }

    static SchedulerJob fixedJob(String code, SchedulerJobResult result) {
        return new SchedulerJob() {
            @Override
            public String getCode() {
                return code;
            }

            @Override
            public SchedulerJobResult execute(SchedulerJobContext context) {
                return result;
            }
        };
    }
}