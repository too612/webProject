package com.main.app.common.scheduler;

import static com.main.app.common.scheduler.SchedulerTestSupport.BUSINESS;
import static com.main.app.common.scheduler.SchedulerTestSupport.CODE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;

class SchedulerPolicyServiceTest {

    private static final Instant NOW = Instant.parse("2026-10-09T03:00:00Z");
    private final SchedulerMapper mapper = mock(SchedulerMapper.class);
    private final SchedulerPolicyService service =
            new SchedulerPolicyService(mapper, Clock.fixed(NOW, ZoneOffset.UTC));

    @Test
    void allowsEnabledJobWithoutPause() {
        when(mapper.getJobInfo(CODE)).thenReturn(SchedulerTestSupport.job(CODE, true));
        when(mapper.getActivePauseList(eq(CODE), any())).thenReturn(List.of());

        SchedulerPolicyDecision decision = service.evaluate(CODE);

        assertThat(decision.allowed()).isTrue();
        assertThat(decision.reasonCode()).isEqualTo(SchedulerPolicyDecision.ALLOWED);
        assertThat(service.isEnabled(CODE)).isTrue();
        verify(mapper, org.mockito.Mockito.atLeastOnce())
                .getActivePauseList(CODE, OffsetDateTime.ofInstant(NOW, ZoneOffset.UTC));
    }

    @Test
    void blocksDisabledJobButHoldCheckIgnoresEnabledFlag() {
        when(mapper.getJobInfo(CODE)).thenReturn(SchedulerTestSupport.job(CODE, false));
        when(mapper.getActivePauseList(eq(CODE), any())).thenReturn(List.of());

        assertThat(service.evaluate(CODE).reasonCode()).isEqualTo(SchedulerPolicyDecision.DISABLED);
        assertThat(service.isEnabled(CODE)).isFalse();
        assertThat(service.isPaused(CODE)).isFalse();
        assertThat(service.isApplyAllowed(BUSINESS)).isTrue();
        assertThat(service.evaluateHold(CODE).allowed()).isTrue();
        assertThat(service.evaluateBusinessHold(BUSINESS).allowed()).isTrue();
    }

    @Test
    void jobPauseBlocksScheduledPathOnly() {
        when(mapper.getJobInfo(CODE)).thenReturn(SchedulerTestSupport.job(CODE, true));
        when(mapper.getActivePauseList(eq(CODE), any())).thenReturn(List.of(
                SchedulerTestSupport.pause(null, OffsetDateTime.parse("2026-10-09T05:00:00Z"), "점검")));

        SchedulerPolicyDecision decision = service.evaluate(CODE);

        assertThat(decision.allowed()).isFalse();
        assertThat(decision.reasonCode()).isEqualTo(SchedulerPolicyDecision.PAUSED);
        assertThat(decision.message()).contains("전체 작업").contains("점검");
        assertThat(service.isPaused(CODE)).isTrue();
        assertThat(service.evaluateHold(CODE).reasonCode()).isEqualTo(SchedulerPolicyDecision.PAUSED);
        assertThat(service.isApplyAllowed(BUSINESS)).isTrue();
        assertThat(service.isBusinessPaused(BUSINESS)).isFalse();
    }

    @Test
    void businessHoldBlocksScheduledAndManualPathsRegardlessOfEnabledFlag() {
        when(mapper.getJobInfo(CODE)).thenReturn(SchedulerTestSupport.job(CODE, false));
        when(mapper.getActiveBusinessHoldList(eq(BUSINESS), any())).thenReturn(List.of(
                SchedulerTestSupport.hold(BUSINESS, OffsetDateTime.parse("2026-10-09T05:00:00Z"), "인사 확정 대기")));

        SchedulerPolicyDecision scheduled = service.evaluate(CODE);
        assertThat(scheduled.allowed()).isFalse();
        assertThat(scheduled.reasonCode()).isEqualTo(SchedulerPolicyDecision.BUSINESS_HOLD);
        assertThat(service.isEnabled(CODE)).isFalse();

        SchedulerPolicyDecision manual = service.evaluateBusinessHold(BUSINESS);
        assertThat(manual.allowed()).isFalse();
        assertThat(manual.reasonCode()).isEqualTo(SchedulerPolicyDecision.BUSINESS_HOLD);
        assertThat(manual.message()).contains(BUSINESS).contains("인사 확정 대기");
        assertThat(service.isBusinessPaused(BUSINESS)).isTrue();
        assertThat(service.isApplyAllowed(BUSINESS)).isFalse();
        verify(mapper, never()).getActivePauseList(any(), any());
        verify(mapper, atLeastOnce()).getActiveBusinessHoldList(BUSINESS, OffsetDateTime.ofInstant(NOW, ZoneOffset.UTC));
    }

    @Test
    void manualApplyCheckDoesNotReadJobDefinitionOrJobPause() {
        assertThat(service.isApplyAllowed(BUSINESS)).isTrue();
        verify(mapper, never()).getJobInfo(any());
        verify(mapper, never()).getActivePauseList(any(), any());
    }

    @Test
    void missingDefinitionIsNotConfigured() {
        when(mapper.getJobInfo(CODE)).thenReturn(null);

        SchedulerPolicyDecision decision = service.evaluate(CODE);

        assertThat(decision.allowed()).isFalse();
        assertThat(decision.reasonCode()).isEqualTo(SchedulerPolicyDecision.NOT_CONFIGURED);
        verify(mapper, never()).getActivePauseList(any(), any());
    }

    @Test
    void databaseFailureIsNeverTreatedAsAllowed() {
        when(mapper.getJobInfo(CODE)).thenThrow(new DataAccessResourceFailureException("db down"));
        when(mapper.getActivePauseList(eq(CODE), any())).thenThrow(new DataAccessResourceFailureException("db down"));

        assertThatThrownBy(() -> service.isEnabled(CODE)).isInstanceOf(SchedulerPolicyUnavailableException.class);
        assertThatThrownBy(() -> service.isPaused(CODE)).isInstanceOf(SchedulerPolicyUnavailableException.class);
        when(mapper.getActiveBusinessHoldList(eq(BUSINESS), any()))
                .thenThrow(new DataAccessResourceFailureException("db down"));
        assertThatThrownBy(() -> service.isApplyAllowed(BUSINESS)).isInstanceOf(SchedulerPolicyUnavailableException.class);
        assertThatThrownBy(() -> service.isBusinessPaused(BUSINESS)).isInstanceOf(SchedulerPolicyUnavailableException.class);
    }

    @Test
    void rejectsBlankCode() {
        assertThatThrownBy(() -> service.evaluate(" ")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> service.isApplyAllowed(null)).isInstanceOf(IllegalArgumentException.class);
    }
}