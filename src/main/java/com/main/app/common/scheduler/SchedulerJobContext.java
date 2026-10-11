package com.main.app.common.scheduler;

import java.time.Instant;
import java.time.ZoneId;

/**
 * 작업 실행 컨텍스트. 장시간 작업은 커밋 단위마다 {@link #ensureLeaseHeld()}를 호출해
 * 실행 잠금 lease 상실 시 중단해야 한다.
 */
public record SchedulerJobContext(
        String jobCode,
        SchedulerTriggerType triggerType,
        Instant scheduledAt,
        ZoneId zoneId,
        Long historyId,
        SchedulerLease lease) {

    public SchedulerJobContext {
        if (lease == null) {
            throw new IllegalArgumentException("SchedulerJobContext.lease는 필수입니다");
        }
    }

    /** lease를 잃었으면 {@link SchedulerLeaseLostException}을 던진다. */
    public void ensureLeaseHeld() {
        lease.ensureHeld();
    }

    public boolean isLeaseHeld() {
        return lease.isHeld();
    }
}