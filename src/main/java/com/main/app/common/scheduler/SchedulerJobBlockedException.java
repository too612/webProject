package com.main.app.common.scheduler;

/**
 * 기존 정책 예외 타입을 보존한다.
 * @deprecated 정책 거부는 {@link SchedulerPolicyDecision}으로 판정한다.
 */
@Deprecated
public class SchedulerJobBlockedException extends RuntimeException {

    private final transient SchedulerPolicyDecision decision;

    public SchedulerJobBlockedException(SchedulerPolicyDecision decision) {
        super(decision.message());
        this.decision = decision;
    }

    public SchedulerPolicyDecision getDecision() {
        return decision;
    }
}