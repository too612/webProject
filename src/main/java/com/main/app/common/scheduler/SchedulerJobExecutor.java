package com.main.app.common.scheduler;

import java.lang.management.ManagementFactory;
import java.time.Clock;
import java.time.DateTimeException;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.main.app.common.scheduler.dto.SchedulerHistoryDto;
import com.main.app.common.scheduler.dto.SchedulerJobDto;

/**
 * 등록된 {@link SchedulerJob}을 정책 확인 → DB lease 잠금 → 이력 기록 → 실행 → 결과 기록 순서로 실행한다.
 * 같은 인스턴스 내 중복 실행은 메모리 가드로, 다중 인스턴스 중복 실행은 sys_scheduler_job 행 잠금(lease)으로 막는다.
 * <p>
 * lease는 실행 중 전용 heartbeat 스레드가 lease 시간의 1/3 간격으로 갱신한다. 갱신이 0건(다른 소유자)이거나
 * 다음 갱신 시점이 만료 이후가 될 때까지 실패하면 lease 상실로 판정하고 작업 스레드를 인터럽트하며,
 * {@link SchedulerJobContext#ensureLeaseHeld()} 호출 시 {@link SchedulerLeaseLostException}이 발생한다.
 * lease 상실 실행은 작업 반환값과 관계없이 FAILED로 기록한다. 협조 중단을 확인하지 않는 작업은
 * 상실 이후 다른 인스턴스와 겹칠 수 있으므로 커밋 단위마다 ensureLeaseHeld()를 호출해야 한다.
 */
@Service
public class SchedulerJobExecutor implements DisposableBean {

    private static final Logger log = LoggerFactory.getLogger(SchedulerJobExecutor.class);
    static final int MAX_TEXT_LENGTH = 4000;
    static final int DEFAULT_LOCK_TIMEOUT_SECONDS = 3600;

    private final SchedulerJobRegistry registry;
    private final SchedulerPolicyService policyService;
    private final SchedulerMapper schedulerMapper;
    private final Clock clock;
    private final ZoneId defaultZone;
    private final String instanceId;
    private final ScheduledExecutorService heartbeatScheduler;
    private final Set<String> running = ConcurrentHashMap.newKeySet();
    private volatile boolean shuttingDown;

    @Autowired
    public SchedulerJobExecutor(SchedulerJobRegistry registry,
                                SchedulerPolicyService policyService,
                                SchedulerMapper schedulerMapper,
                                SchedulerProperties properties) {
        this(registry, policyService, schedulerMapper, Clock.systemUTC(), properties.zoneId(), createInstanceId(),
                createHeartbeatScheduler());
    }

    SchedulerJobExecutor(SchedulerJobRegistry registry,
                         SchedulerPolicyService policyService,
                         SchedulerMapper schedulerMapper,
                         Clock clock,
                         ZoneId defaultZone,
                         String instanceId,
                         ScheduledExecutorService heartbeatScheduler) {
        this.registry = registry;
        this.policyService = policyService;
        this.schedulerMapper = schedulerMapper;
        this.clock = clock;
        this.defaultZone = defaultZone;
        this.instanceId = instanceId;
        this.heartbeatScheduler = heartbeatScheduler;
    }

    /**
     * 즉시 수동 실행. 업무 보류(BUSINESS_HOLD)만 적용되고 작업 비활성(DISABLED)과 작업 일시중지(PAUSED)는 무시한다.
     * 잠금/이력 규칙은 동일하다.
     */
    public SchedulerExecutionResult runNow(String jobCode) {
        return run(jobCode, SchedulerTriggerType.MANUAL, null);
    }

    public SchedulerExecutionResult run(String jobCode, SchedulerTriggerType triggerType, Instant scheduledAt) {
        if (shuttingDown) {
            log.warn("[Scheduler] {} {} 실행 생략: 애플리케이션 종료 중", jobCode, triggerType);
            return result(jobCode, SchedulerExecutionStatus.SKIPPED, null, 0, "애플리케이션 종료 중");
        }
        SchedulerJob job = registry.find(jobCode).orElse(null);
        if (job == null) {
            log.warn("[Scheduler] {} 실행 거부: 등록된 SchedulerJob 구현체가 없습니다", jobCode);
            return result(jobCode, SchedulerExecutionStatus.SKIPPED, null, 0, "등록되지 않은 작업 코드");
        }
        if (!running.add(jobCode)) {
            String message = "같은 인스턴스에서 이미 실행 중";
            log.warn("[Scheduler] {} {} 실행 생략: {}", jobCode, triggerType, message);
            Long historyId = recordTerminal(jobCode, triggerType, scheduledAt, SchedulerExecutionStatus.SKIPPED, message);
            return result(jobCode, SchedulerExecutionStatus.SKIPPED, historyId, 0, message);
        }
        try {
            return runGuarded(job, jobCode, triggerType, scheduledAt);
        } finally {
            running.remove(jobCode);
        }
    }

    private SchedulerExecutionResult runGuarded(SchedulerJob job, String jobCode,
                                                SchedulerTriggerType triggerType, Instant scheduledAt) {
        SchedulerPolicyService.PolicyCheck check;
        try {
            check = policyService.check(jobCode);
        } catch (SchedulerPolicyUnavailableException e) {
            log.error("[Scheduler] {} {} 실행 중단: 정책 DB 확인 실패 - {}", jobCode, triggerType, e.getMessage(), e);
            return result(jobCode, SchedulerExecutionStatus.FAILED, null, 0, "정책 DB 확인 실패: " + e.getMessage());
        }
        SchedulerPolicyDecision decision = check.decision();
        boolean manualIgnoresJobState = triggerType == SchedulerTriggerType.MANUAL
                && (SchedulerPolicyDecision.DISABLED.equals(decision.reasonCode())
                    || SchedulerPolicyDecision.PAUSED.equals(decision.reasonCode()));
        if (!decision.allowed() && !manualIgnoresJobState) {
            log.info("[Scheduler] {} {} 실행 생략: {}", jobCode, triggerType, decision.message());
            Long historyId = SchedulerPolicyDecision.NOT_CONFIGURED.equals(decision.reasonCode())
                    ? null
                    : recordTerminal(jobCode, triggerType, scheduledAt, SchedulerExecutionStatus.SKIPPED, decision.message());
            return result(jobCode, SchedulerExecutionStatus.SKIPPED, historyId, 0, decision.message());
        }

        SchedulerJobDto definition = check.job();
        ZoneId zone;
        try {
            zone = resolveZone(definition, defaultZone);
        } catch (DateTimeException e) {
            String message = "DB 시간대 설정 오류: " + e.getMessage();
            log.error("[Scheduler] {} {} 실행 중단: {}", jobCode, triggerType, message);
            Long historyId = recordTerminal(jobCode, triggerType, scheduledAt, SchedulerExecutionStatus.FAILED, message);
            return result(jobCode, SchedulerExecutionStatus.FAILED, historyId, 0, message);
        }
        int leaseSeconds = lockTimeoutSeconds(definition);
        Instant lockRequestedAt = clock.instant();
        boolean locked;
        try {
            locked = schedulerMapper.setAcquireLock(jobCode, instanceId, leaseSeconds) > 0;
        } catch (RuntimeException e) {
            log.error("[Scheduler] {} {} 실행 중단: 실행 잠금 획득 중 DB 오류 - {}", jobCode, triggerType, e.getMessage(), e);
            return result(jobCode, SchedulerExecutionStatus.FAILED, null, 0, "실행 잠금 획득 실패: " + e.getMessage());
        }
        if (!locked) {
            String message = "다른 인스턴스 또는 이전 실행이 잠금을 보유 중";
            log.warn("[Scheduler] {} {} 실행 생략: {}", jobCode, triggerType, message);
            Long historyId = recordTerminal(jobCode, triggerType, scheduledAt, SchedulerExecutionStatus.SKIPPED, message);
            return result(jobCode, SchedulerExecutionStatus.SKIPPED, historyId, 0, message);
        }

        SchedulerLease lease = new SchedulerLease(jobCode, instanceId, leaseSeconds, Thread.currentThread(),
                lockRequestedAt.plusSeconds(leaseSeconds));
        Heartbeat heartbeat;
        try {
            heartbeat = startHeartbeat(lease);
        } catch (RuntimeException e) {
            String message = "실행 잠금 heartbeat 시작 실패: " + e.getMessage();
            log.error("[Scheduler] {} {} 실행 중단: {}", jobCode, triggerType, message, e);
            releaseLock(jobCode, leaseSeconds);
            Long historyId = recordTerminal(jobCode, triggerType, scheduledAt, SchedulerExecutionStatus.FAILED, message);
            return result(jobCode, SchedulerExecutionStatus.FAILED, historyId, 0, message);
        }
        try {
            return executeLocked(job, jobCode, triggerType, scheduledAt, zone, lease, heartbeat);
        } finally {
            heartbeat.stop();
            if (!lease.isHeld()) {
                // heartbeat가 보낸 인터럽트가 풀 스레드에 남지 않도록 지운다.
                Thread.interrupted();
            }
            releaseLock(jobCode, leaseSeconds);
        }
    }

    private SchedulerExecutionResult executeLocked(SchedulerJob job, String jobCode, SchedulerTriggerType triggerType,
                                                   Instant scheduledAt, ZoneId zone,
                                                   SchedulerLease lease, Heartbeat heartbeat) {
        Instant startedAt = clock.instant();
        SchedulerHistoryDto history = newHistory(jobCode, triggerType, SchedulerExecutionStatus.RUNNING, scheduledAt, startedAt);
        try {
            schedulerMapper.setHistoryCreate(history);
            schedulerMapper.setJobStarted(jobCode, toOffset(startedAt));
        } catch (RuntimeException e) {
            log.error("[Scheduler] {} {} 실행 중단: 실행 이력 기록 실패 - {}", jobCode, triggerType, e.getMessage(), e);
            return result(jobCode, SchedulerExecutionStatus.FAILED, history.getHistoryId(), 0, "실행 이력 기록 실패: " + e.getMessage());
        }

        log.info("[Scheduler] {} {} 실행 시작 (historyId={})", jobCode, triggerType, history.getHistoryId());
        SchedulerJobContext context = new SchedulerJobContext(jobCode, triggerType, scheduledAt,
                zone, history.getHistoryId(), lease);
        SchedulerJobResult jobResult = null;
        Exception failure = null;
        try {
            jobResult = job.execute(context);
        } catch (Exception e) {
            failure = e;
        } catch (Error e) {
            heartbeat.stop();
            log.error("[Scheduler] {} {} 치명적 오류 (historyId={})", jobCode, triggerType, history.getHistoryId(), e);
            finish(history, startedAt, SchedulerExecutionStatus.FAILED, 0, null, errorText(e));
            throw e;
        }
        heartbeat.stop();
        int processed = jobResult == null ? 0 : jobResult.processedCount();

        if (!lease.isHeld()) {
            String error = "실행 잠금 lease 상실로 결과를 신뢰할 수 없음(다른 인스턴스와 중복 실행 가능): " + lease.lostReason();
            if (failure != null) {
                error = error + " / 작업 오류: " + errorText(failure);
            }
            log.error("[Scheduler] {} {} 실행 실패 (historyId={}): {}", jobCode, triggerType, history.getHistoryId(), error, failure);
            return failed(history, startedAt, processed, jobResult == null ? null : jobResult.message(), error);
        }
        if (failure != null) {
            String error = errorText(failure);
            log.error("[Scheduler] {} {} 실행 실패 (historyId={}): {}", jobCode, triggerType, history.getHistoryId(), error, failure);
            return failed(history, startedAt, 0, null, error);
        }
        if (jobResult == null) {
            String error = "SchedulerJob.execute가 null을 반환했습니다(계약 위반: SchedulerJobResult.of/empty를 반환해야 함)";
            log.error("[Scheduler] {} {} 실행 실패 (historyId={}): {}", jobCode, triggerType, history.getHistoryId(), error);
            return failed(history, startedAt, 0, null, error);
        }
        if (!finish(history, startedAt, SchedulerExecutionStatus.SUCCESS, processed, jobResult.message(), null)) {
            String error = "작업은 실행되었으나 결과 이력 기록에 실패해 성공을 확정할 수 없음"
                    + "(이력/작업 상태가 RUNNING으로 남을 수 있음)";
            log.error("[Scheduler] {} {} 실행 결과 미확정 (historyId={}, processed={}): {}",
                    jobCode, triggerType, history.getHistoryId(), processed, error);
            return result(jobCode, SchedulerExecutionStatus.FAILED, history.getHistoryId(), processed,
                    appendText(jobResult.message(), error));
        }
        log.info("[Scheduler] {} {} 실행 완료 (historyId={}, processed={})",
                jobCode, triggerType, history.getHistoryId(), processed);
        return result(jobCode, SchedulerExecutionStatus.SUCCESS, history.getHistoryId(), processed, jobResult.message());
    }

    private SchedulerExecutionResult failed(SchedulerHistoryDto history, Instant startedAt, int processed,
                                            String message, String error) {
        boolean recorded = finish(history, startedAt, SchedulerExecutionStatus.FAILED, processed, message, error);
        String text = recorded ? error : appendText(error, "실패 결과 이력 기록도 실패");
        return result(history.getJobCode(), SchedulerExecutionStatus.FAILED, history.getHistoryId(), processed, text);
    }

    private Heartbeat startHeartbeat(SchedulerLease lease) {
        long interval = heartbeatIntervalSeconds(lease.leaseSeconds());
        ScheduledFuture<?> future = heartbeatScheduler.scheduleWithFixedDelay(() -> {
            try {
                renewLease(lease);
            } catch (RuntimeException e) {
                log.error("[Scheduler] {} lease heartbeat 처리 오류: {}", lease.jobCode(), e.getMessage(), e);
            }
        }, interval, interval, TimeUnit.SECONDS);
        if (future == null) {
            throw new IllegalStateException("heartbeat 예약 결과가 없습니다");
        }
        return new Heartbeat(future);
    }

    /**
     * lease를 1회 갱신한다. 0건 갱신이면 즉시 상실, DB 오류면 다음 시도 전에 만료될 때만 상실로 판정한다.
     *
     * @return 갱신 후 lease 보유 여부
     */
    boolean renewLease(SchedulerLease lease) {
        if (!lease.isHeld()) {
            return false;
        }
        Instant attemptAt = clock.instant();
        try {
            if (schedulerMapper.setRenewLock(lease.jobCode(), lease.owner(), lease.leaseSeconds()) > 0) {
                lease.renewed(attemptAt.plusSeconds(lease.leaseSeconds()));
                return true;
            }
            loseLease(lease, "lease 갱신 0건 - 다른 인스턴스가 잠금을 가져갔거나 잠금 행이 없음");
            return false;
        } catch (RuntimeException e) {
            Instant nextAttempt = clock.instant().plusSeconds(heartbeatIntervalSeconds(lease.leaseSeconds()));
            if (!nextAttempt.isBefore(lease.expiresAt())) {
                loseLease(lease, "lease 갱신 DB 오류가 만료 시점(" + lease.expiresAt() + ")까지 지속: " + e.getMessage());
                return false;
            }
            log.warn("[Scheduler] {} lease 갱신 실패, 만료({}) 전까지 재시도: {}",
                    lease.jobCode(), lease.expiresAt(), e.getMessage());
            return true;
        }
    }

    private void loseLease(SchedulerLease lease, String reason) {
        if (lease.markLost(reason)) {
            log.error("[Scheduler] {} 실행 잠금 lease 상실 - 작업 스레드를 인터럽트하고 결과를 FAILED로 기록합니다: {}",
                    lease.jobCode(), reason);
        }
    }

    static long heartbeatIntervalSeconds(int leaseSeconds) {
        return Math.max(1, leaseSeconds / 3);
    }

    @Override
    public void destroy() {
        heartbeatScheduler.shutdownNow();
    }

    private record Heartbeat(ScheduledFuture<?> future) {
        void stop() {
            future.cancel(false);
        }
    }
    private boolean finish(SchedulerHistoryDto history, Instant startedAt, SchedulerExecutionStatus status,
                           int processedCount, String message, String errorMessage) {
        Instant finishedAt = clock.instant();
        history.setStatus(status.name());
        history.setFinishedAt(toOffset(finishedAt));
        history.setDurationMs(Math.max(0, Duration.between(startedAt, finishedAt).toMillis()));
        history.setProcessedCount(processedCount);
        history.setMessage(truncate(message));
        history.setErrorMessage(truncate(errorMessage));
        try {
            schedulerMapper.setHistoryUpdate(history);
            schedulerMapper.setJobFinished(history.getJobCode(), status.name(),
                    truncate(errorMessage != null ? errorMessage : message),
                    history.getFinishedAt(), status == SchedulerExecutionStatus.SUCCESS);
            return true;
        } catch (RuntimeException e) {
            log.error("[Scheduler] {} 실행 결과({}) 이력 기록 실패 (historyId={}): {}",
                    history.getJobCode(), status, history.getHistoryId(), e.getMessage(), e);
            return false;
        }
    }

    private Long recordTerminal(String jobCode, SchedulerTriggerType triggerType, Instant scheduledAt,
                                SchedulerExecutionStatus status, String message) {
        Instant now = clock.instant();
        SchedulerHistoryDto history = newHistory(jobCode, triggerType, status, scheduledAt, now);
        history.setFinishedAt(toOffset(now));
        history.setDurationMs(0L);
        history.setProcessedCount(0);
        if (status == SchedulerExecutionStatus.FAILED) {
            history.setErrorMessage(truncate(message));
        } else {
            history.setMessage(truncate(message));
        }
        try {
            schedulerMapper.setHistoryCreate(history);
            return history.getHistoryId();
        } catch (RuntimeException e) {
            log.error("[Scheduler] {} {} 이력 기록 실패: {}", jobCode, status, e.getMessage(), e);
            return null;
        }
    }

    private void releaseLock(String jobCode, int leaseSeconds) {
        try {
            schedulerMapper.setReleaseLock(jobCode, instanceId);
        } catch (RuntimeException e) {
            log.error("[Scheduler] {} 실행 잠금 해제 실패 - 잠금은 최대 {}초 후 만료됩니다: {}",
                    jobCode, leaseSeconds, e.getMessage(), e);
        }
    }

    private SchedulerHistoryDto newHistory(String jobCode, SchedulerTriggerType triggerType,
                                           SchedulerExecutionStatus status, Instant scheduledAt, Instant startedAt) {
        SchedulerHistoryDto history = new SchedulerHistoryDto();
        history.setJobCode(jobCode);
        history.setTriggerType(triggerType.name());
        history.setStatus(status.name());
        history.setScheduledAt(scheduledAt == null ? null : toOffset(scheduledAt));
        history.setStartedAt(toOffset(startedAt));
        history.setInstanceId(instanceId);
        return history;
    }

    /** 종료 시작: 이후 실행 요청은 생략된다. */
    public void beginShutdown() {
        shuttingDown = true;
    }

    /** 실행 중 작업이 끝날 때까지 최대 timeout 동안 기다린다. */
    public boolean awaitIdle(Duration timeout) {
        long deadline = System.nanoTime() + timeout.toNanos();
        while (!running.isEmpty()) {
            if (System.nanoTime() >= deadline) {
                return false;
            }
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return running.isEmpty();
            }
        }
        return true;
    }

    public Set<String> getRunningJobCodes() {
        return Set.copyOf(running);
    }

    static int lockTimeoutSeconds(SchedulerJobDto definition) {
        Integer value = definition == null ? null : definition.getLockTimeoutSeconds();
        return value == null || value < 60 ? DEFAULT_LOCK_TIMEOUT_SECONDS : value;
    }

    /**
     * DB zone_id가 비어 있으면 설정 기본 시간대(app.scheduler.zone)를 쓰고, 값이 잘못되었으면 대체하지 않고 예외를 던진다.
     */
    static ZoneId resolveZone(SchedulerJobDto definition, ZoneId defaultZone) {
        if (definition == null) {
            return defaultZone;
        }
        String value = definition.getZoneId();
        if (value == null || value.isBlank()) {
            return defaultZone;
        }
        try {
            return ZoneId.of(value.trim());
        } catch (DateTimeException e) {
            throw new DateTimeException("잘못된 zone_id '" + value + "' (job=" + definition.getJobCode() + "): "
                    + e.getMessage(), e);
        }
    }

    static String errorText(Throwable e) {
        String message = e.getMessage();
        return truncate(e.getClass().getName() + (message == null ? "" : ": " + message));
    }

    static String truncate(String value) {
        if (value == null || value.length() <= MAX_TEXT_LENGTH) {
            return value;
        }
        return value.substring(0, MAX_TEXT_LENGTH);
    }

    private static String appendText(String base, String suffix) {
        return base == null || base.isBlank() ? suffix : base + " (" + suffix + ")";
    }

    private static OffsetDateTime toOffset(Instant instant) {
        return instant.atOffset(ZoneOffset.UTC);
    }

    private static SchedulerExecutionResult result(String jobCode, SchedulerExecutionStatus status,
                                                   Long historyId, int processedCount, String message) {
        return new SchedulerExecutionResult(jobCode, status, historyId, processedCount, message);
    }

    private static ScheduledExecutorService createHeartbeatScheduler() {
        return Executors.newSingleThreadScheduledExecutor(runnable -> {
            Thread thread = new Thread(runnable, "db-scheduler-lease-heartbeat");
            thread.setDaemon(true);
            return thread;
        });
    }

    private static String createInstanceId() {
        String runtime;
        try {
            runtime = ManagementFactory.getRuntimeMXBean().getName();
        } catch (RuntimeException e) {
            runtime = "unknown";
        }
        String id = runtime + "#" + UUID.randomUUID().toString().substring(0, 8);
        return id.length() > 150 ? id.substring(id.length() - 150) : id;
    }
}