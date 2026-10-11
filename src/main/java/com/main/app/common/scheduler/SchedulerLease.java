package com.main.app.common.scheduler;

import java.time.Instant;

/**
 * 실행 중 작업이 보유한 DB 실행 잠금(lease) 상태.
 * <p>
 * 실행기는 lease 시간의 1/3 간격으로 lease를 갱신(heartbeat)한다. 다른 인스턴스가 잠금을 가져갔거나
 * 갱신이 lease 만료 시점까지 계속 실패하면 lease는 상실(lost) 상태가 되고, 작업 스레드는 인터럽트된다.
 * 장시간 작업은 커밋 단위(예: 사람/건 단위 트랜잭션)마다 {@link #ensureHeld()}를 호출해 상실 시 즉시 중단해야 한다.
 * lease 상실 후 실행 결과는 작업 반환값과 무관하게 FAILED로 기록된다.
 */
public final class SchedulerLease {

    private final String jobCode;
    private final String owner;
    private final int leaseSeconds;
    private final Thread worker;
    private volatile Instant expiresAt;
    private volatile String lostReason;

    SchedulerLease(String jobCode, String owner, int leaseSeconds, Thread worker, Instant expiresAt) {
        this.jobCode = jobCode;
        this.owner = owner;
        this.leaseSeconds = leaseSeconds;
        this.worker = worker;
        this.expiresAt = expiresAt;
    }

    public String jobCode() {
        return jobCode;
    }

    public String owner() {
        return owner;
    }

    public int leaseSeconds() {
        return leaseSeconds;
    }

    /** 로컬 기준 마지막으로 확인된 lease 만료 예상 시각. */
    public Instant expiresAt() {
        return expiresAt;
    }

    public boolean isHeld() {
        return lostReason == null;
    }

    /** lease 상실 사유. 보유 중이면 null. */
    public String lostReason() {
        return lostReason;
    }

    /** lease를 잃었으면 {@link SchedulerLeaseLostException}을 던진다. 커밋 단위마다 호출한다. */
    public void ensureHeld() {
        String reason = lostReason;
        if (reason != null) {
            throw new SchedulerLeaseLostException(jobCode, reason);
        }
    }

    void renewed(Instant newExpiresAt) {
        this.expiresAt = newExpiresAt;
    }

    /** 최초 상실만 기록하고 작업 스레드를 인터럽트한다. 이미 상실이면 false. */
    synchronized boolean markLost(String reason) {
        if (lostReason != null) {
            return false;
        }
        lostReason = reason;
        if (worker != null && worker != Thread.currentThread()) {
            worker.interrupt();
        }
        return true;
    }
}