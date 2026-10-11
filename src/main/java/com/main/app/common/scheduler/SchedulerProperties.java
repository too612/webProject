package com.main.app.common.scheduler;

import java.time.DateTimeException;
import java.time.Duration;
import java.time.ZoneId;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;

/**
 * app.scheduler.* 설정. 기본값은 보수적으로 비활성(enabled=false)이며, DB 마이그레이션 후 명시적으로 켠다.
 */
@Getter
@ConfigurationProperties(prefix = "app.scheduler")
public class SchedulerProperties {

    /** DB 스케줄러 전체 사용 여부. false면 작업을 등록하지 않는다. */
    private boolean enabled = false;

    /** DB 정의(cron/zone/사용 여부) 재조회 주기(ms). 최소 10초. */
    private long reloadDelayMs = 300_000L;

    /** 기동 후 첫 DB 정의 조회까지 대기 시간(ms). */
    private long initialDelayMs = 30_000L;

    /** DB zone_id가 비어 있을 때 사용하는 기본 시간대. 잘못된 값이면 기동 시 설정 오류로 실패한다. */
    private String zone = "Asia/Seoul";

    /** 스케줄러 스레드 수. */
    private int poolSize = 2;

    /** 종료 시 실행 중 작업 완료 대기 시간(ms). */
    private long shutdownTimeoutMs = 30_000L;

    static final long MIN_RELOAD_DELAY_MS = 10_000L;
    static final String DEFAULT_ZONE = "Asia/Seoul";

    // 설정값을 조용히 보정하지 않고, 잘못된 값은 바인딩 시점에 원인을 담은 예외로 거부한다.

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setReloadDelayMs(long reloadDelayMs) {
        if (reloadDelayMs < MIN_RELOAD_DELAY_MS) {
            throw new IllegalArgumentException("app.scheduler.reload-delay-ms must be >= " + MIN_RELOAD_DELAY_MS
                    + " but was " + reloadDelayMs);
        }
        this.reloadDelayMs = reloadDelayMs;
    }

    public void setInitialDelayMs(long initialDelayMs) {
        if (initialDelayMs < 0) {
            throw new IllegalArgumentException("app.scheduler.initial-delay-ms must be >= 0 but was " + initialDelayMs);
        }
        this.initialDelayMs = initialDelayMs;
    }

    public void setZone(String zone) {
        this.zone = zone;
        zoneId();
    }

    public void setPoolSize(int poolSize) {
        if (poolSize < 1) {
            throw new IllegalArgumentException("app.scheduler.pool-size must be >= 1 but was " + poolSize);
        }
        this.poolSize = poolSize;
    }

    public void setShutdownTimeoutMs(long shutdownTimeoutMs) {
        if (shutdownTimeoutMs < 0) {
            throw new IllegalArgumentException("app.scheduler.shutdown-timeout-ms must be >= 0 but was " + shutdownTimeoutMs);
        }
        this.shutdownTimeoutMs = shutdownTimeoutMs;
    }

    public Duration reloadDelay() {
        return Duration.ofMillis(reloadDelayMs);
    }

    public Duration initialDelay() {
        return Duration.ofMillis(initialDelayMs);
    }

    public Duration shutdownTimeout() {
        return Duration.ofMillis(shutdownTimeoutMs);
    }

    /** 비어 있으면 Asia/Seoul. 잘못된 값이면 {@link IllegalArgumentException}(대체 시간대 사용 안 함). */
    public ZoneId zoneId() {
        if (zone == null || zone.isBlank()) {
            return ZoneId.of(DEFAULT_ZONE);
        }
        try {
            return ZoneId.of(zone.trim());
        } catch (DateTimeException e) {
            throw new IllegalArgumentException("app.scheduler.zone is not a valid time zone id: '" + zone
                    + "' (e.g. Asia/Seoul): " + e.getMessage(), e);
        }
    }
}
