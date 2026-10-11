package com.main.app.common.scheduler;

import static com.main.app.common.scheduler.SchedulerTestSupport.CODE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.concurrent.ScheduledFuture;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.support.CronTrigger;

import com.main.app.common.scheduler.dto.SchedulerJobDto;

class SchedulerManagerTest {

    private static final Instant NOW = Instant.parse("2026-10-09T03:10:00Z");

    private final SchedulerMapper mapper = mock(SchedulerMapper.class);
    private final SchedulerJobExecutor executor = mock(SchedulerJobExecutor.class);
    private final TaskScheduler taskScheduler = mock(TaskScheduler.class);
    private final SchedulerJobRegistry registry = new SchedulerJobRegistry(List.of(
            SchedulerTestSupport.fixedJob(CODE, SchedulerJobResult.empty())));
    private final SchedulerProperties properties = new SchedulerProperties();
    private SchedulerManager manager;

    @BeforeEach
    @SuppressWarnings({"unchecked", "rawtypes"})
    void setUp() {
        properties.setEnabled(true);
        when(taskScheduler.scheduleWithFixedDelay(any(Runnable.class), any(Instant.class), any(Duration.class)))
                .thenReturn((ScheduledFuture) mock(ScheduledFuture.class));
        when(taskScheduler.schedule(any(Runnable.class), any(Trigger.class)))
                .thenAnswer(invocation -> mock(ScheduledFuture.class));
        manager = new SchedulerManager(properties, registry, mapper, executor, taskScheduler,
                Clock.fixed(NOW, ZoneOffset.UTC));
    }

    @Test
    void disabledPropertyRegistersNothingAndNeverTouchesDatabase() {
        properties.setEnabled(false);

        manager.start();

        assertThat(manager.isRunning()).isTrue();
        assertThat(manager.reload()).isFalse();
        verifyNoInteractions(mapper, taskScheduler);
    }

    @Test
    void startSchedulesPeriodicReloadWithConfiguredDelay() {
        properties.setReloadDelayMs(60_000L);
        properties.setInitialDelayMs(5_000L);

        manager.start();

        verify(taskScheduler).scheduleWithFixedDelay(any(Runnable.class),
                eq(NOW.plusSeconds(5)), eq(Duration.ofMinutes(1)));
    }

    @Test
    void reloadIntervalBelowMinimumIsRejectedNotClamped() {
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> properties.setReloadDelayMs(1L))
                .isInstanceOf(IllegalArgumentException.class);
        properties.setReloadDelayMs(10_000L);

        manager.start();

        verify(taskScheduler).scheduleWithFixedDelay(any(Runnable.class), any(Instant.class), eq(Duration.ofSeconds(10)));
    }

    @Test
    void registersEnabledJobWithCronAndZone() {
        when(mapper.getJobList()).thenReturn(List.of(SchedulerTestSupport.job(CODE, true)));
        manager.start();

        assertThat(manager.reload()).isTrue();

        ArgumentCaptor<Trigger> trigger = ArgumentCaptor.forClass(Trigger.class);
        verify(taskScheduler).schedule(any(Runnable.class), trigger.capture());
        CronTrigger cron = (CronTrigger) trigger.getValue();
        assertThat(cron.getExpression()).isEqualTo("0 0/30 * * * *");
        assertThat(manager.getRegisteredCodes()).containsExactly(CODE);
    }

    @Test
    @SuppressWarnings("rawtypes")
    void unchangedDefinitionIsNotRescheduledButChangedOneIs() {
        SchedulerJobDto row = SchedulerTestSupport.job(CODE, true);
        when(mapper.getJobList()).thenReturn(List.of(row));
        ScheduledFuture first = mock(ScheduledFuture.class);
        when(taskScheduler.schedule(any(Runnable.class), any(Trigger.class))).thenReturn(first);
        manager.start();

        manager.reload();
        manager.reload();
        verify(taskScheduler, times(1)).schedule(any(Runnable.class), any(Trigger.class));

        row.setCronExpression("0 0 * * * *");
        manager.reload();
        verify(first).cancel(false);
        verify(taskScheduler, times(2)).schedule(any(Runnable.class), any(Trigger.class));
    }

    @Test
    @SuppressWarnings("rawtypes")
    void disablingJobCancelsRegistration() {
        SchedulerJobDto row = SchedulerTestSupport.job(CODE, true);
        when(mapper.getJobList()).thenReturn(List.of(row));
        ScheduledFuture future = mock(ScheduledFuture.class);
        when(taskScheduler.schedule(any(Runnable.class), any(Trigger.class))).thenReturn(future);
        manager.start();
        manager.reload();

        row.setEnabled(false);
        manager.reload();

        verify(future).cancel(false);
        assertThat(manager.getRegisteredCodes()).isEmpty();
    }

    @Test
    void invalidCronOrZoneIsNotRegistered() {
        SchedulerJobDto row = SchedulerTestSupport.job(CODE, true);
        row.setCronExpression("not a cron");
        when(mapper.getJobList()).thenReturn(List.of(row));
        manager.start();

        assertThat(manager.reload()).isTrue();
        row.setCronExpression("0 0/30 * * * *");
        row.setZoneId("Mars/Base");
        manager.reload();

        verify(taskScheduler, never()).schedule(any(Runnable.class), any(Trigger.class));
        assertThat(manager.getRegisteredCodes()).isEmpty();
    }

    @Test
    void unknownDatabaseCodesAreIgnored() {
        when(mapper.getJobList()).thenReturn(List.of(SchedulerTestSupport.job("UNKNOWN_JOB", true)));
        manager.start();

        manager.reload();

        verify(taskScheduler, never()).schedule(any(Runnable.class), any(Trigger.class));
        assertThat(manager.getRegisteredCodes()).isEmpty();
    }

    @Test
    @SuppressWarnings("rawtypes")
    void databaseFailureKeepsExistingRegistrationsWithoutThrowing() {
        ScheduledFuture future = mock(ScheduledFuture.class);
        when(taskScheduler.schedule(any(Runnable.class), any(Trigger.class))).thenReturn(future);
        when(mapper.getJobList())
                .thenReturn(List.of(SchedulerTestSupport.job(CODE, true)))
                .thenThrow(new DataAccessResourceFailureException("relation does not exist"));
        manager.start();
        manager.reload();

        assertThat(manager.reload()).isFalse();
        manager.reloadSafely();

        verify(future, never()).cancel(false);
        assertThat(manager.getRegisteredCodes()).containsExactly(CODE);
    }

    @Test
    void firstSuccessfulReloadTriggersCatchupOnlyOnce() {
        SchedulerJobDto row = SchedulerTestSupport.job(CODE, true);
        row.setCatchupEnabled(true);
        row.setLastSuccessAt(OffsetDateTime.parse("2026-10-09T02:00:00Z"));
        when(mapper.getJobList())
                .thenThrow(new DataAccessResourceFailureException("db down"))
                .thenReturn(List.of(row));
        manager.start();

        manager.reload();
        verify(taskScheduler, never()).schedule(any(Runnable.class), any(Instant.class));

        manager.reload();
        manager.reload();
        verify(taskScheduler, times(1)).schedule(any(Runnable.class), eq(NOW));
    }

    @Test
    void runOnStartupTriggersEvenWithoutMissedRun() {
        SchedulerJobDto row = SchedulerTestSupport.job(CODE, true);
        row.setRunOnStartup(true);
        row.setLastSuccessAt(OffsetDateTime.parse("2026-10-09T03:05:00Z"));
        when(mapper.getJobList()).thenReturn(List.of(row));
        manager.start();

        manager.reload();

        verify(taskScheduler).schedule(any(Runnable.class), eq(NOW));
    }

    @Test
    void catchupDetectionUsesCronAndZone() {
        SchedulerJobDto row = SchedulerTestSupport.job(CODE, true);
        java.time.ZoneId seoul = java.time.ZoneId.of("Asia/Seoul");

        row.setLastSuccessAt(OffsetDateTime.parse("2026-10-09T03:00:00Z"));
        assertThat(SchedulerManager.isCatchupRequired(row, NOW, seoul)).isFalse();

        row.setLastSuccessAt(OffsetDateTime.parse("2026-10-09T02:29:59Z"));
        assertThat(SchedulerManager.isCatchupRequired(row, NOW, seoul)).isTrue();

        row.setLastSuccessAt(null);
        assertThat(SchedulerManager.isCatchupRequired(row, NOW, seoul)).isTrue();

        // 자정(Asia/Seoul 00:00 = 전날 15:00Z)도 실행 시각에 포함된다.
        row.setCronExpression("0 0 0 * * *");
        row.setLastSuccessAt(OffsetDateTime.parse("2026-10-08T14:59:00Z"));
        assertThat(SchedulerManager.isCatchupRequired(row, Instant.parse("2026-10-08T15:00:00Z"), seoul)).isTrue();
        assertThat(SchedulerManager.isCatchupRequired(row, Instant.parse("2026-10-08T14:59:59Z"), seoul)).isFalse();
    }

    @Test
    @SuppressWarnings("rawtypes")
    void stopCancelsRegistrationsAndShutsDownExecutor() {
        ScheduledFuture future = mock(ScheduledFuture.class);
        when(taskScheduler.schedule(any(Runnable.class), any(Trigger.class))).thenReturn(future);
        when(mapper.getJobList()).thenReturn(List.of(SchedulerTestSupport.job(CODE, true)));
        when(executor.awaitIdle(any())).thenReturn(true);
        manager.start();
        manager.reload();

        manager.stop();

        verify(future).cancel(false);
        verify(executor).beginShutdown();
        assertThat(manager.isRunning()).isFalse();
        assertThat(manager.getRegisteredCodes()).isEmpty();
        assertThat(manager.reload()).isFalse();
    }
}