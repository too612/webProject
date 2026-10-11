package com.main.app.common.scheduler;

import static com.main.app.common.scheduler.SchedulerTestSupport.BUSINESS;
import static com.main.app.common.scheduler.SchedulerTestSupport.CODE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.DataAccessResourceFailureException;

import com.main.app.common.scheduler.dto.SchedulerHistoryDto;
import com.main.app.common.scheduler.dto.SchedulerJobDto;

class SchedulerJobExecutorTest {

    private static final Instant NOW = Instant.parse("2026-10-09T03:00:00Z");
    private static final String OWNER = "test-instance";

    private final SchedulerMapper mapper = mock(SchedulerMapper.class);
    private final MutableClock clock = new MutableClock(NOW);
    private final ScheduledExecutorService heartbeat = mock(ScheduledExecutorService.class);
    private final ScheduledFuture<?> heartbeatFuture = mock(ScheduledFuture.class);
    private final List<SchedulerHistoryDto> created = new ArrayList<>();

    @BeforeEach
    void setUp() {
        doReturn(heartbeatFuture).when(heartbeat).scheduleWithFixedDelay(any(Runnable.class), anyLong(), anyLong(), any());
        when(mapper.getJobInfo(CODE)).thenReturn(SchedulerTestSupport.job(CODE, true));
        when(mapper.getActivePauseList(eq(CODE), any())).thenReturn(List.of());
        when(mapper.setAcquireLock(CODE, OWNER, 1800)).thenReturn(1);
        doAnswer(invocation -> {
            SchedulerHistoryDto history = invocation.getArgument(0);
            history.setHistoryId(100L + created.size());
            SchedulerHistoryDto copy = new SchedulerHistoryDto();
            copy.setStatus(history.getStatus());
            copy.setMessage(history.getMessage());
            copy.setTriggerType(history.getTriggerType());
            created.add(copy);
            return 1;
        }).when(mapper).setHistoryCreate(any());
    }

    private SchedulerJobExecutor executor(SchedulerJob job) {
        SchedulerJobRegistry registry = new SchedulerJobRegistry(List.of(job));
        return new SchedulerJobExecutor(registry, new SchedulerPolicyService(mapper, clock), mapper, clock,
                ZoneId.of("Asia/Seoul"), OWNER, heartbeat);
    }

    @Test
    void successfulRunRecordsHistoryAndReleasesLock() {
        AtomicReference<SchedulerJobContext> seen = new AtomicReference<>();
        SchedulerJob job = new SchedulerJob() {
            public String getCode() { return CODE; }
            public SchedulerJobResult execute(SchedulerJobContext context) {
                seen.set(context);
                return SchedulerJobResult.of(3, "3건 반영");
            }
        };

        SchedulerExecutionResult result = executor(job).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.SUCCESS);
        assertThat(result.processedCount()).isEqualTo(3);
        assertThat(result.historyId()).isEqualTo(100L);
        assertThat(seen.get().zoneId()).isEqualTo(ZoneId.of("Asia/Seoul"));
        assertThat(seen.get().historyId()).isEqualTo(100L);
        assertThat(created).extracting(SchedulerHistoryDto::getStatus).containsExactly("RUNNING");

        ArgumentCaptor<SchedulerHistoryDto> update = ArgumentCaptor.forClass(SchedulerHistoryDto.class);
        verify(mapper).setHistoryUpdate(update.capture());
        assertThat(update.getValue().getStatus()).isEqualTo("SUCCESS");
        assertThat(update.getValue().getProcessedCount()).isEqualTo(3);
        verify(mapper).setJobFinished(eq(CODE), eq("SUCCESS"), eq("3건 반영"), any(), eq(true));
        verify(mapper).setReleaseLock(CODE, OWNER);
        verify(heartbeat).scheduleWithFixedDelay(any(Runnable.class), eq(600L), eq(600L), eq(TimeUnit.SECONDS));
        verify(heartbeatFuture, org.mockito.Mockito.atLeastOnce()).cancel(false);
        assertThat(seen.get().isLeaseHeld()).isTrue();
    }

    @Test
    void failingJobRecordsExplicitFailureAndReleasesLock() {
        SchedulerJob job = new SchedulerJob() {
            public String getCode() { return CODE; }
            public SchedulerJobResult execute(SchedulerJobContext context) {
                throw new IllegalStateException("boom");
            }
        };

        SchedulerExecutionResult result = executor(job).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(result.message()).contains("IllegalStateException").contains("boom");
        ArgumentCaptor<SchedulerHistoryDto> update = ArgumentCaptor.forClass(SchedulerHistoryDto.class);
        verify(mapper).setHistoryUpdate(update.capture());
        assertThat(update.getValue().getStatus()).isEqualTo("FAILED");
        assertThat(update.getValue().getErrorMessage()).contains("boom");
        verify(mapper).setJobFinished(eq(CODE), eq("FAILED"), anyString(), any(), eq(false));
        verify(mapper).setReleaseLock(CODE, OWNER);
    }

    @Test
    void lockHeldElsewhereSkipsWithoutExecuting() {
        when(mapper.setAcquireLock(CODE, OWNER, 1800)).thenReturn(0);
        CountingJob job = new CountingJob();

        SchedulerExecutionResult result = executor(job).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.SKIPPED);
        assertThat(job.count).isZero();
        assertThat(created).extracting(SchedulerHistoryDto::getStatus).containsExactly("SKIPPED");
        verify(mapper, never()).setReleaseLock(anyString(), anyString());
    }

    @Test
    void jobPauseSkipsScheduledButAllowsManualRun() {
        when(mapper.getActivePauseList(eq(CODE), any())).thenReturn(List.of(
                SchedulerTestSupport.pause(CODE, NOW.atOffset(ZoneOffset.UTC).plusHours(1), "점검")));
        CountingJob job = new CountingJob();
        SchedulerJobExecutor executor = executor(job);

        assertThat(executor.run(CODE, SchedulerTriggerType.SCHEDULED, NOW).status())
                .isEqualTo(SchedulerExecutionStatus.SKIPPED);
        assertThat(job.count).isZero();
        verify(mapper, never()).setAcquireLock(anyString(), anyString(), anyInt());

        assertThat(executor.runNow(CODE).status()).isEqualTo(SchedulerExecutionStatus.SUCCESS);
        assertThat(job.count).isEqualTo(1);
    }

    @Test
    void businessHoldSkipsScheduledAndManualTriggers() {
        when(mapper.getActiveBusinessHoldList(eq(BUSINESS), any())).thenReturn(List.of(
                SchedulerTestSupport.hold(BUSINESS, NOW.atOffset(ZoneOffset.UTC).plusHours(1), "인사 확정 대기")));
        CountingJob job = new CountingJob();
        SchedulerJobExecutor executor = executor(job);

        SchedulerExecutionResult scheduled = executor.run(CODE, SchedulerTriggerType.SCHEDULED, NOW);
        SchedulerExecutionResult manual = executor.runNow(CODE);

        assertThat(scheduled.status()).isEqualTo(SchedulerExecutionStatus.SKIPPED);
        assertThat(manual.status()).isEqualTo(SchedulerExecutionStatus.SKIPPED);
        assertThat(manual.message()).contains("업무 보류");
        assertThat(job.count).isZero();
        verify(mapper, never()).setAcquireLock(anyString(), anyString(), anyInt());
    }

    @Test
    void invalidDatabaseZoneFailsExplicitlyWithoutSubstitution() {
        SchedulerJobDto row = SchedulerTestSupport.job(CODE, true);
        row.setZoneId("Mars/Base");
        when(mapper.getJobInfo(CODE)).thenReturn(row);
        CountingJob job = new CountingJob();

        SchedulerExecutionResult result = executor(job).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(result.message()).contains("Mars/Base");
        assertThat(job.count).isZero();
        assertThat(created).extracting(SchedulerHistoryDto::getStatus).containsExactly("FAILED");
        verify(mapper, never()).setAcquireLock(anyString(), anyString(), anyInt());
    }

    @Test
    void blankDatabaseZoneUsesConfiguredDefault() {
        SchedulerJobDto row = SchedulerTestSupport.job(CODE, true);
        row.setZoneId(" ");
        assertThat(SchedulerJobExecutor.resolveZone(row, ZoneId.of("UTC"))).isEqualTo(ZoneId.of("UTC"));
    }

    @Test
    void disabledJobSkipsScheduledButAllowsManualRun() {
        when(mapper.getJobInfo(CODE)).thenReturn(SchedulerTestSupport.job(CODE, false));
        CountingJob job = new CountingJob();
        SchedulerJobExecutor executor = executor(job);

        assertThat(executor.run(CODE, SchedulerTriggerType.SCHEDULED, NOW).status())
                .isEqualTo(SchedulerExecutionStatus.SKIPPED);
        assertThat(job.count).isZero();

        assertThat(executor.runNow(CODE).status()).isEqualTo(SchedulerExecutionStatus.SUCCESS);
        assertThat(job.count).isEqualTo(1);
    }

    @Test
    void databaseUnavailableFailsExplicitlyWithoutExecuting() {
        when(mapper.getJobInfo(CODE)).thenThrow(new DataAccessResourceFailureException("db down"));
        CountingJob job = new CountingJob();

        SchedulerExecutionResult result = executor(job).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(result.message()).contains("정책 DB");
        assertThat(job.count).isZero();
    }

    @Test
    void historyCreateFailureAbortsExecutionAndReleasesLock() {
        doAnswer(invocation -> { throw new DataAccessResourceFailureException("no table"); })
                .when(mapper).setHistoryCreate(any());
        CountingJob job = new CountingJob();

        SchedulerExecutionResult result = executor(job).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(job.count).isZero();
        verify(mapper).setReleaseLock(CODE, OWNER);
    }

    @Test
    void unknownCodeIsRejectedWithoutDatabaseAccess() {
        SchedulerExecutionResult result = executor(new CountingJob()).run("OTHER_JOB", SchedulerTriggerType.MANUAL, null);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.SKIPPED);
        verify(mapper, never()).getJobInfo("OTHER_JOB");
    }

    @Test
    void sameInstanceOverlapIsSkipped() throws Exception {
        CountDownLatch started = new CountDownLatch(1);
        CountDownLatch release = new CountDownLatch(1);
        SchedulerJob job = new SchedulerJob() {
            public String getCode() { return CODE; }
            public SchedulerJobResult execute(SchedulerJobContext context) throws Exception {
                started.countDown();
                release.await(5, TimeUnit.SECONDS);
                return SchedulerJobResult.empty();
            }
        };
        SchedulerJobExecutor executor = executor(job);
        Thread first = new Thread(() -> executor.run(CODE, SchedulerTriggerType.SCHEDULED, NOW));
        first.start();
        assertThat(started.await(5, TimeUnit.SECONDS)).isTrue();

        SchedulerExecutionResult second = executor.run(CODE, SchedulerTriggerType.CATCHUP, NOW);
        release.countDown();
        first.join(5000);

        assertThat(second.status()).isEqualTo(SchedulerExecutionStatus.SKIPPED);
        assertThat(second.message()).contains("이미 실행 중");
        verify(mapper).setAcquireLock(CODE, OWNER, 1800);
    }

    @Test
    void shutdownStopsNewExecutions() {
        CountingJob job = new CountingJob();
        SchedulerJobExecutor executor = executor(job);
        executor.beginShutdown();

        assertThat(executor.run(CODE, SchedulerTriggerType.SCHEDULED, NOW).status())
                .isEqualTo(SchedulerExecutionStatus.SKIPPED);
        assertThat(job.count).isZero();
        assertThat(executor.awaitIdle(java.time.Duration.ofMillis(10))).isTrue();
        verify(mapper, never()).setJobFinished(anyString(), anyString(), any(), any(), anyBoolean());
    }

    @Test
    void nullJobResultIsContractFailureNotSuccess() {
        SchedulerExecutionResult result = executor(SchedulerTestSupport.fixedJob(CODE, null))
                .run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(result.message()).contains("null").contains("계약 위반");
        ArgumentCaptor<SchedulerHistoryDto> update = ArgumentCaptor.forClass(SchedulerHistoryDto.class);
        verify(mapper).setHistoryUpdate(update.capture());
        assertThat(update.getValue().getStatus()).isEqualTo("FAILED");
        verify(mapper).setJobFinished(eq(CODE), eq("FAILED"), anyString(), any(), eq(false));
        verify(mapper).setReleaseLock(CODE, OWNER);
    }

    @Test
    void successWhoseResultCannotBePersistedIsReportedAsFailed() {
        doThrow(new DataAccessResourceFailureException("db down")).when(mapper).setHistoryUpdate(any());

        SchedulerExecutionResult result = executor(new CountingJob()).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(result.processedCount()).isEqualTo(1);
        assertThat(result.message()).contains("이력 기록에 실패");
        verify(mapper).setReleaseLock(CODE, OWNER);
    }

    @Test
    void failureWhoseResultCannotBePersistedSaysSo() {
        doThrow(new DataAccessResourceFailureException("db down")).when(mapper).setHistoryUpdate(any());
        SchedulerJob job = new SchedulerJob() {
            public String getCode() { return CODE; }
            public SchedulerJobResult execute(SchedulerJobContext context) {
                throw new IllegalStateException("boom");
            }
        };

        SchedulerExecutionResult result = executor(job).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(result.message()).contains("boom").contains("실패 결과 이력 기록도 실패");
    }

    @Test
    void heartbeatRenewsLeaseWhileJobRuns() {
        when(mapper.setRenewLock(CODE, OWNER, 1800)).thenReturn(1);
        AtomicReference<SchedulerJobExecutor> ref = new AtomicReference<>();
        AtomicReference<Instant> expiry = new AtomicReference<>();
        SchedulerJob job = new SchedulerJob() {
            public String getCode() { return CODE; }
            public SchedulerJobResult execute(SchedulerJobContext context) {
                for (int i = 0; i < 6; i++) {
                    clock.advanceSeconds(600);
                    assertThat(ref.get().renewLease(context.lease())).isTrue();
                    context.ensureLeaseHeld();
                }
                expiry.set(context.lease().expiresAt());
                return SchedulerJobResult.of(6, "long run");
            }
        };
        ref.set(executor(job));

        SchedulerExecutionResult result = ref.get().run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.SUCCESS);
        verify(mapper, org.mockito.Mockito.times(6)).setRenewLock(CODE, OWNER, 1800);
        assertThat(expiry.get()).isEqualTo(NOW.plusSeconds(3600 + 1800));
    }

    @Test
    void leaseTakenByOtherOwnerStopsJobAndRecordsFailure() {
        when(mapper.setRenewLock(CODE, OWNER, 1800)).thenReturn(0);
        AtomicReference<SchedulerJobExecutor> ref = new AtomicReference<>();
        int[] processedBeforeStop = {0};
        SchedulerJob job = new SchedulerJob() {
            public String getCode() { return CODE; }
            public SchedulerJobResult execute(SchedulerJobContext context) {
                for (int i = 0; i < 5; i++) {
                    context.ensureLeaseHeld();
                    processedBeforeStop[0]++;
                    clock.advanceSeconds(600);
                    ref.get().renewLease(context.lease());
                }
                return SchedulerJobResult.of(processedBeforeStop[0], "should not be success");
            }
        };
        ref.set(executor(job));

        SchedulerExecutionResult result = ref.get().run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(processedBeforeStop[0]).isEqualTo(1);
        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(result.message()).contains("lease 상실").contains("SchedulerLeaseLostException");
        ArgumentCaptor<SchedulerHistoryDto> update = ArgumentCaptor.forClass(SchedulerHistoryDto.class);
        verify(mapper).setHistoryUpdate(update.capture());
        assertThat(update.getValue().getStatus()).isEqualTo("FAILED");
        assertThat(Thread.currentThread().isInterrupted()).isFalse();
    }

    @Test
    void leaseLostEvenWhenJobIgnoresCheckIsNeverSuccess() {
        when(mapper.setRenewLock(CODE, OWNER, 1800)).thenReturn(0);
        AtomicReference<SchedulerJobExecutor> ref = new AtomicReference<>();
        SchedulerJob job = new SchedulerJob() {
            public String getCode() { return CODE; }
            public SchedulerJobResult execute(SchedulerJobContext context) {
                ref.get().renewLease(context.lease());
                return SchedulerJobResult.of(2, "done");
            }
        };
        ref.set(executor(job));

        SchedulerExecutionResult result = ref.get().run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(result.processedCount()).isEqualTo(2);
        verify(mapper).setJobFinished(eq(CODE), eq("FAILED"), anyString(), any(), eq(false));
    }

    @Test
    void transientRenewFailureRetriesUntilExpiryThenLosesLease() {
        when(mapper.setRenewLock(CODE, OWNER, 1800))
                .thenThrow(new DataAccessResourceFailureException("blip"));
        SchedulerLease lease = new SchedulerLease(CODE, OWNER, 1800, null, NOW.plusSeconds(1800));
        SchedulerJobExecutor executor = executor(new CountingJob());

        clock.advanceSeconds(600);
        assertThat(executor.renewLease(lease)).isTrue();
        assertThat(lease.isHeld()).isTrue();

        clock.advanceSeconds(600);
        assertThat(executor.renewLease(lease)).isFalse();
        assertThat(lease.isHeld()).isFalse();
        assertThat(lease.lostReason()).contains("blip");
        org.assertj.core.api.Assertions.assertThatThrownBy(lease::ensureHeld)
                .isInstanceOf(SchedulerLeaseLostException.class);
    }

    @Test
    void leaseLossInterruptsWorkerThread() throws Exception {
        CountDownLatch done = new CountDownLatch(1);
        AtomicReference<Boolean> interrupted = new AtomicReference<>(false);
        Thread worker = new Thread(() -> {
            try {
                Thread.sleep(5_000);
            } catch (InterruptedException e) {
                interrupted.set(true);
            }
            done.countDown();
        });
        worker.start();
        SchedulerLease lease = new SchedulerLease(CODE, OWNER, 1800, worker, NOW.plusSeconds(1800));

        assertThat(lease.markLost("taken")).isTrue();
        assertThat(lease.markLost("again")).isFalse();
        assertThat(done.await(5, TimeUnit.SECONDS)).isTrue();
        assertThat(interrupted.get()).isTrue();
    }

    @Test
    void heartbeatScheduleFailureDoesNotRunJob() {
        doThrow(new java.util.concurrent.RejectedExecutionException("stopped"))
                .when(heartbeat).scheduleWithFixedDelay(any(Runnable.class), anyLong(), anyLong(), any());
        CountingJob job = new CountingJob();

        SchedulerExecutionResult result = executor(job).run(CODE, SchedulerTriggerType.SCHEDULED, NOW);

        assertThat(result.status()).isEqualTo(SchedulerExecutionStatus.FAILED);
        assertThat(job.count).isZero();
        verify(mapper).setReleaseLock(CODE, OWNER);
    }

    private static final class MutableClock extends Clock {
        private Instant now;

        MutableClock(Instant now) {
            this.now = now;
        }

        void advanceSeconds(long seconds) {
            now = now.plusSeconds(seconds);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return now;
        }
    }

    private static final class CountingJob implements SchedulerJob {        private int count;

        @Override
        public String getCode() {
            return CODE;
        }

        @Override
        public SchedulerJobResult execute(SchedulerJobContext context) {
            count++;
            return SchedulerJobResult.of(1, "ok");
        }
    }
}