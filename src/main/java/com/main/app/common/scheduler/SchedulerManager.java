package com.main.app.common.scheduler;

import java.time.Clock;
import java.time.DateTimeException;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.SmartLifecycle;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import com.main.app.common.scheduler.dto.SchedulerJobDto;

/**
 * DB(sys_scheduler_job) 정의를 주기적으로 재조회해 TaskScheduler 등록/변경/취소를 관리한다.
 * DB를 사용할 수 없으면 기동을 중단하지 않고 ERROR 로그를 남긴 뒤 기존 등록을 유지하고 다음 주기에 재시도한다.
 */
@Component
public class SchedulerManager implements SmartLifecycle {

    private static final Logger log = LoggerFactory.getLogger(SchedulerManager.class);

    private final SchedulerProperties properties;
    private final SchedulerJobRegistry registry;
    private final SchedulerMapper schedulerMapper;
    private final SchedulerJobExecutor executor;
    private final TaskScheduler taskScheduler;
    private final Clock clock;

    private final Map<String, Registration> registrations = new ConcurrentHashMap<>();
    private final Set<String> warnedCodes = ConcurrentHashMap.newKeySet();
    private volatile boolean running;
    private volatile boolean active;
    private boolean startupHandled;
    private ScheduledFuture<?> reloadFuture;

    @Autowired
    public SchedulerManager(SchedulerProperties properties,
                            SchedulerJobRegistry registry,
                            SchedulerMapper schedulerMapper,
                            SchedulerJobExecutor executor,
                            @Qualifier("schedulerTaskScheduler") TaskScheduler taskScheduler) {
        this(properties, registry, schedulerMapper, executor, taskScheduler, Clock.systemUTC());
    }

    SchedulerManager(SchedulerProperties properties,
                     SchedulerJobRegistry registry,
                     SchedulerMapper schedulerMapper,
                     SchedulerJobExecutor executor,
                     TaskScheduler taskScheduler,
                     Clock clock) {
        this.properties = properties;
        this.registry = registry;
        this.schedulerMapper = schedulerMapper;
        this.executor = executor;
        this.taskScheduler = taskScheduler;
        this.clock = clock;
    }

    @Override
    public synchronized void start() {
        running = true;
        if (!properties.isEnabled()) {
            log.info("[Scheduler] DB 스케줄러 비활성 (app.scheduler.enabled=false) - 작업을 등록하지 않습니다");
            return;
        }
        active = true;
        Duration interval = properties.reloadDelay();
        Duration initialDelay = properties.initialDelay();
        reloadFuture = taskScheduler.scheduleWithFixedDelay(this::reloadSafely,
                clock.instant().plus(initialDelay), interval);
        log.info("[Scheduler] DB 스케줄러 시작 (구현 작업={}, 첫 조회 {}초 후, 재조회 주기 {}초)",
                registry.getCodes(), initialDelay.toSeconds(), interval.toSeconds());
    }

    @Override
    public void stop() {
        synchronized (this) {
            active = false;
            running = false;
            if (reloadFuture != null) {
                reloadFuture.cancel(false);
                reloadFuture = null;
            }
            registrations.keySet().forEach(code -> cancel(code, "애플리케이션 종료"));
        }
        executor.beginShutdown();
        Duration timeout = properties.shutdownTimeout();
        if (!executor.awaitIdle(timeout)) {
            log.warn("[Scheduler] 종료 대기 {}초 초과 - 실행 중 작업: {} (DB 잠금은 lease 만료 후 해제)",
                    timeout.toSeconds(), executor.getRunningJobCodes());
        }
    }

    @Override
    public boolean isRunning() {
        return running;
    }

    void reloadSafely() {
        try {
            reload();
        } catch (RuntimeException e) {
            log.error("[Scheduler] 스케줄 재조회 중 예상치 못한 오류: {}", e.getMessage(), e);
        }
    }

    /** DB 정의를 다시 읽어 등록을 동기화한다. DB 조회 실패 시 false를 반환하고 기존 등록을 유지한다. */
    public synchronized boolean reload() {
        if (!active) {
            return false;
        }
        List<SchedulerJobDto> rows;
        try {
            rows = schedulerMapper.getJobList();
        } catch (RuntimeException e) {
            log.error("[Scheduler] 작업 정의 조회 실패(DB 미가용) - 기존 등록 {}건 유지, 다음 주기에 재시도: {}",
                    registrations.size(), e.getMessage(), e);
            return false;
        }
        Map<String, SchedulerJobDto> byCode = new HashMap<>();
        for (SchedulerJobDto row : rows == null ? List.<SchedulerJobDto>of() : rows) {
            if (row == null || row.getJobCode() == null) {
                continue;
            }
            if (!registry.contains(row.getJobCode())) {
                warnOnce("db:" + row.getJobCode(), "[Scheduler] DB 작업 {}에 대응하는 SchedulerJob 구현체가 없어 무시합니다",
                        row.getJobCode());
                continue;
            }
            byCode.put(row.getJobCode(), row);
        }

        for (String code : registry.getCodes()) {
            SchedulerJobDto row = byCode.get(code);
            if (row == null) {
                warnOnce("missing:" + code, "[Scheduler] 구현 작업 {}의 DB 정의가 없어 등록하지 않습니다", code);
                cancel(code, "DB 미설정");
                continue;
            }
            warnedCodes.remove("missing:" + code);
            if (!Boolean.TRUE.equals(row.getEnabled())) {
                cancel(code, "비활성");
                continue;
            }
            register(row);
        }

        if (!startupHandled) {
            startupHandled = true;
            triggerStartup(byCode.values());
        }
        return true;
    }

    private void register(SchedulerJobDto row) {
        String code = row.getJobCode();
        String cron = row.getCronExpression() == null ? "" : row.getCronExpression().trim();
        ZoneId zone;
        try {
            CronExpression.parse(cron);
            // 잘못된 DB zone_id는 기본 시간대로 대체하지 않고 등록을 거부한다(빈 값만 app.scheduler.zone 사용).
            zone = SchedulerJobExecutor.resolveZone(row, properties.zoneId());
        } catch (IllegalArgumentException | DateTimeException e) {
            log.error("[Scheduler] {} cron/zone 설정 오류로 등록 해제 (cron='{}', zone='{}'): {}",
                    code, cron, row.getZoneId(), e.getMessage());
            cancel(code, "설정 오류");
            return;
        }
        Registration existing = registrations.get(code);
        if (existing != null && existing.cron().equals(cron) && existing.zone().equals(zone)
                && !existing.future().isDone()) {
            return;
        }
        cancel(code, existing == null ? null : "설정 변경");
        ScheduledFuture<?> future = taskScheduler.schedule(() -> runSafely(code, SchedulerTriggerType.SCHEDULED),
                new CronTrigger(cron, zone));
        if (future == null) {
            log.error("[Scheduler] {} 다음 실행 시각이 없어 등록하지 못했습니다 (cron='{}', zone={})", code, cron, zone);
            return;
        }
        registrations.put(code, new Registration(cron, zone, future));
        log.info("[Scheduler] {} 등록 (cron='{}', zone={})", code, cron, zone);
    }

    private void cancel(String code, String reason) {
        Registration registration = registrations.remove(code);
        if (registration != null) {
            registration.future().cancel(false);
            if (reason != null) {
                log.info("[Scheduler] {} 등록 해제 ({})", code, reason);
            }
        }
    }

    private void triggerStartup(Iterable<SchedulerJobDto> rows) {
        Instant now = clock.instant();
        for (SchedulerJobDto row : rows) {
            if (!Boolean.TRUE.equals(row.getEnabled()) || !registrations.containsKey(row.getJobCode())) {
                continue;
            }
            SchedulerTriggerType type = null;
            if (Boolean.TRUE.equals(row.getRunOnStartup())) {
                type = SchedulerTriggerType.STARTUP;
            } else if (Boolean.TRUE.equals(row.getCatchupEnabled()) && isCatchupRequired(row, now, properties.zoneId())) {
                type = SchedulerTriggerType.CATCHUP;
            }
            if (type != null) {
                SchedulerTriggerType triggerType = type;
                log.info("[Scheduler] {} {} 실행 예약 (마지막 성공: {})", row.getJobCode(), triggerType, row.getLastSuccessAt());
                taskScheduler.schedule(() -> runSafely(row.getJobCode(), triggerType), now);
            }
        }
    }

    /** 마지막 성공 이후 예정 실행 시각이 지났으면(또는 성공 이력이 없으면) 보정 실행이 필요하다. */
    static boolean isCatchupRequired(SchedulerJobDto row, Instant now, ZoneId defaultZone) {
        CronExpression cron;
        ZoneId zone;
        try {
            cron = CronExpression.parse(row.getCronExpression().trim());
            zone = SchedulerJobExecutor.resolveZone(row, defaultZone);
        } catch (RuntimeException e) {
            return false;
        }
        if (row.getLastSuccessAt() == null) {
            return true;
        }
        ZonedDateTime next = cron.next(row.getLastSuccessAt().atZoneSameInstant(zone));
        return next != null && !next.toInstant().isAfter(now);
    }

    private void runSafely(String code, SchedulerTriggerType triggerType) {
        if (!active) {
            return;
        }
        try {
            executor.run(code, triggerType, clock.instant());
        } catch (RuntimeException e) {
            log.error("[Scheduler] {} {} 실행기 오류: {}", code, triggerType, e.getMessage(), e);
        }
    }

    private void warnOnce(String key, String message, Object arg) {
        if (warnedCodes.add(key)) {
            log.warn(message, arg);
        }
    }

    public Set<String> getRegisteredCodes() {
        return new TreeSet<>(registrations.keySet());
    }

    record Registration(String cron, ZoneId zone, ScheduledFuture<?> future) {
    }
}
