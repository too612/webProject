package com.main.app.common.scheduler;

/**
 * 정책 판정 결과. {@code jobCode}에는 판정 대상 코드(작업 코드 또는 업무 보류 판정 시 업무 코드)가 들어간다.
 */
public record SchedulerPolicyDecision(String jobCode, boolean allowed, String reasonCode, String message) {

    public static final String ALLOWED = "ALLOWED";
    /** 작업 사용 여부(is_enabled=false). 자동 실행만 막는다. */
    public static final String DISABLED = "DISABLED";
    /** 작업 일시중지(sys_scheduler_pause). 자동 실행만 막는다. */
    public static final String PAUSED = "PAUSED";
    /** 업무 보류(sys_scheduler_business_hold). 자동 실행과 수동 즉시 반영을 모두 막는다. */
    public static final String BUSINESS_HOLD = "BUSINESS_HOLD";
    public static final String NOT_CONFIGURED = "NOT_CONFIGURED";
}