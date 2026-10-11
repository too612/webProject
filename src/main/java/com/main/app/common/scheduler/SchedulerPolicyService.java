package com.main.app.common.scheduler;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.main.app.common.scheduler.dto.SchedulerBusinessHoldDto;
import com.main.app.common.scheduler.dto.SchedulerJobDto;
import com.main.app.common.scheduler.dto.SchedulerPauseDto;

/**
 * DB 기준 실행 가능 여부를 판정한다. DB를 읽을 수 없으면 {@link SchedulerPolicyUnavailableException}을 던지며
 * 허용으로 간주하지 않는다.
 *
 * <ul>
 *   <li>자동(스케줄) 실행: {@link #evaluate}/{@link #isEnabled}
 *       = 업무 보류 없음 AND 작업 일시중지 없음 AND 작업 사용(is_enabled)</li>
 *   <li>수동 즉시 반영: {@link #evaluateBusinessHold}/{@link #isBusinessPaused}/{@link #isApplyAllowed}
 *       = 업무 보류만 확인 (작업 사용 여부·작업 일시중지와 무관)</li>
 * </ul>
 */
@Service
public class SchedulerPolicyService {

    /** 인사발령 반영 업무 코드 (sys_scheduler_job.business_code / sys_scheduler_business_hold.business_code). */
    public static final String BUSINESS_HRM_ASSIGNMENT = "HRM_ASSIGNMENT";

    private final SchedulerMapper schedulerMapper;
    private final Clock clock;

    @Autowired
    public SchedulerPolicyService(SchedulerMapper schedulerMapper) {
        this(schedulerMapper, Clock.systemUTC());
    }

    SchedulerPolicyService(SchedulerMapper schedulerMapper, Clock clock) {
        this.schedulerMapper = schedulerMapper;
        this.clock = clock;
    }

    // ---- 자동(스케줄) 실행 판정 ----

    public SchedulerPolicyDecision evaluate(String jobCode) {
        return check(jobCode).decision();
    }

    /** 자동 실행 가능 여부: 업무 보류·작업 일시중지가 없고 작업이 사용 상태일 때만 true. */
    public boolean isEnabled(String jobCode) {
        return evaluate(jobCode).allowed();
    }

    // ---- 수동 즉시 반영 판정 (업무 보류만) ----

    public SchedulerPolicyDecision evaluateBusinessHold(String businessCode) {
        requireCode(businessCode, "businessCode");
        SchedulerPolicyDecision hold = findBusinessHold(businessCode, businessCode, OffsetDateTime.now(clock));
        return hold != null ? hold
                : new SchedulerPolicyDecision(businessCode, true, SchedulerPolicyDecision.ALLOWED, null);
    }

    public boolean isBusinessPaused(String businessCode) {
        return !evaluateBusinessHold(businessCode).allowed();
    }

    public boolean isApplyAllowed(String businessCode) {
        return !isBusinessPaused(businessCode);
    }

    // ---- 작업 일시중지 단독 판정 (자동 실행 구성 요소, 수동 반영 판정용 아님) ----

    /**
     * 작업 일시중지(sys_scheduler_pause)만 확인한다. 작업 사용 여부와 업무 보류는 보지 않는다.
     * 수동 즉시 반영 판정에는 {@link #isApplyAllowed(String)}를 사용한다.
     */
    public SchedulerPolicyDecision evaluateHold(String jobCode) {
        requireCode(jobCode, "jobCode");
        SchedulerPolicyDecision paused = findPause(jobCode, OffsetDateTime.now(clock));
        return paused != null ? paused
                : new SchedulerPolicyDecision(jobCode, true, SchedulerPolicyDecision.ALLOWED, null);
    }

    public boolean isPaused(String jobCode) {
        return !evaluateHold(jobCode).allowed();
    }

    PolicyCheck check(String jobCode) {
        requireCode(jobCode, "jobCode");
        OffsetDateTime now = OffsetDateTime.now(clock);
        SchedulerJobDto job;
        try {
            job = schedulerMapper.getJobInfo(jobCode);
        } catch (RuntimeException e) {
            throw new SchedulerPolicyUnavailableException(
                    "스케줄 작업 정책을 조회할 수 없습니다: " + jobCode, e);
        }
        if (job == null) {
            return new PolicyCheck(null, new SchedulerPolicyDecision(jobCode, false,
                    SchedulerPolicyDecision.NOT_CONFIGURED, "스케줄 작업이 DB에 설정되어 있지 않습니다: " + jobCode));
        }
        String businessCode = job.getBusinessCode();
        if (businessCode != null && !businessCode.isBlank()) {
            SchedulerPolicyDecision hold = findBusinessHold(jobCode, businessCode.trim(), now);
            if (hold != null) {
                return new PolicyCheck(job, hold);
            }
        }
        SchedulerPolicyDecision paused = findPause(jobCode, now);
        if (paused != null) {
            return new PolicyCheck(job, paused);
        }
        if (!Boolean.TRUE.equals(job.getEnabled())) {
            return new PolicyCheck(job, new SchedulerPolicyDecision(jobCode, false,
                    SchedulerPolicyDecision.DISABLED, "스케줄 작업이 비활성 상태입니다: " + jobCode));
        }
        return new PolicyCheck(job, new SchedulerPolicyDecision(jobCode, true, SchedulerPolicyDecision.ALLOWED, null));
    }

    private SchedulerPolicyDecision findBusinessHold(String subjectCode, String businessCode, OffsetDateTime now) {
        List<SchedulerBusinessHoldDto> holds;
        try {
            holds = schedulerMapper.getActiveBusinessHoldList(businessCode, now);
        } catch (RuntimeException e) {
            throw new SchedulerPolicyUnavailableException(
                    "업무 보류 정보를 조회할 수 없습니다: " + businessCode, e);
        }
        if (holds == null || holds.isEmpty()) {
            return null;
        }
        SchedulerBusinessHoldDto hold = holds.get(0);
        String reason = hold.getReason() == null || hold.getReason().isBlank() ? "" : " - " + hold.getReason();
        return new SchedulerPolicyDecision(subjectCode, false, SchedulerPolicyDecision.BUSINESS_HOLD,
                "업무 보류 중입니다(" + businessCode + ", ~" + hold.getHoldEndAt() + ")" + reason);
    }

    private SchedulerPolicyDecision findPause(String jobCode, OffsetDateTime now) {
        List<SchedulerPauseDto> pauses;
        try {
            pauses = schedulerMapper.getActivePauseList(jobCode, now);
        } catch (RuntimeException e) {
            throw new SchedulerPolicyUnavailableException(
                    "스케줄 작업 일시중지 정보를 조회할 수 없습니다: " + jobCode, e);
        }
        if (pauses == null || pauses.isEmpty()) {
            return null;
        }
        SchedulerPauseDto pause = pauses.get(0);
        String scope = pause.getJobCode() == null ? "전체 작업" : jobCode;
        String reason = pause.getReason() == null || pause.getReason().isBlank() ? "" : " - " + pause.getReason();
        return new SchedulerPolicyDecision(jobCode, false, SchedulerPolicyDecision.PAUSED,
                "작업이 일시중지 중입니다(" + scope + ", ~" + pause.getPauseEndAt() + ")" + reason);
    }

    private static void requireCode(String code, String name) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException(name + " is required");
        }
    }

    record PolicyCheck(SchedulerJobDto job, SchedulerPolicyDecision decision) {
    }
}