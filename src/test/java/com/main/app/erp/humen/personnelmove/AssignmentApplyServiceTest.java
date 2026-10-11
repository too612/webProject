package com.main.app.erp.humen.personnelmove;

import com.main.app.common.scheduler.SchedulerPolicyService;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.*;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AssignmentApplyServiceTest {
    private final PersonnelMoveMapper mapper = mock(PersonnelMoveMapper.class);
    private final SchedulerPolicyService policy = mock(SchedulerPolicyService.class);
    private final Clock clock = Clock.fixed(Instant.parse("2026-10-08T16:00:00Z"), ZoneId.of("Asia/Seoul"));
    private final AssignmentApplyService service = new AssignmentApplyService(mapper, policy, clock);

    @Test
    void koreanMidnightAndAppliedVersionPreventOldHistoryReapplication() {
        when(policy.isEnabled(AssignmentApplyService.JOB_CODE)).thenReturn(true);
        Person master = master();
        master.setAppliedAssignmentKey("current");
        master.setAppliedAssignmentVersion(2L);
        Assignment older = row("old", LocalDate.of(2026, 10, 8), 99, 200L);
        Assignment current = row("current", LocalDate.of(2026, 10, 9), 1, 2L);
        when(mapper.selectTargetAssignments("person", null)).thenReturn(List.of(older, current));
        assertThat(service.today()).isEqualTo(LocalDate.of(2026, 10, 9));
        assertThat(service.applyLocked(master, null, new Audit("admin", null))).isZero();
        verify(mapper, never()).applyMain(any(), any());
        current.setVersion(3L);
        assertThat(service.applyLocked(master, null, new Audit("admin", null))).isEqualTo(1);
        verify(mapper).applyMain(eq(current), any());
    }

    @Test
    void pauseBlocksBothImmediateAndAutomaticWithoutFallback() {
        when(policy.isEnabled(AssignmentApplyService.JOB_CODE)).thenReturn(false);
        when(policy.isBusinessPaused(SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT)).thenReturn(true);
        assertThat(service.applyLocked(master(), null, new Audit("admin", null))).isZero();
        assertThat(service.synchronizePerson("person")).isZero();
        verifyNoInteractions(mapper);
        when(policy.isEnabled(AssignmentApplyService.JOB_CODE)).thenThrow(new IllegalStateException("DB unavailable"));
        assertThatThrownBy(() -> service.synchronizePerson("person")).isInstanceOf(IllegalStateException.class);
        when(policy.isBusinessPaused(SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT)).thenThrow(new IllegalStateException("DB unavailable"));
        assertThatThrownBy(() -> service.applyLocked(master(), null, new Audit("admin", null))).isInstanceOf(IllegalStateException.class);
    }

    @Test
    void disabledAutomaticJobDoesNotBlockManualBusinessApplication() {
        when(policy.isEnabled(AssignmentApplyService.JOB_CODE)).thenReturn(false);
        when(policy.isBusinessPaused(SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT)).thenReturn(false);
        Assignment current = row("current", service.today(), 1, 0L);
        when(mapper.selectTargetAssignments("person", null)).thenReturn(List.of(current));
        assertThat(service.applyLocked(master(), null, new Audit("admin", null))).isEqualTo(1);
        assertThat(service.synchronizePerson("person")).isZero();
        verify(mapper).applyMain(eq(current), any());
    }

    @Test
    void concurrentApplicationNeverChangesOriginalMaster() {
        when(policy.isEnabled(AssignmentApplyService.JOB_CODE)).thenReturn(true);
        Assignment concurrent = row("concurrentAssignment", service.today(), 1, 0L);
        concurrent.setConcurrentKey("concurrent");
        when(mapper.selectTargetAssignments("person", "concurrent")).thenReturn(List.of(concurrent));
        assertThat(service.applyLocked(master(), "concurrent", new Audit("admin", null))).isEqualTo(1);
        verify(mapper).applyConcurrent(eq(concurrent), any());
        verify(mapper, never()).applyMain(any(), any());
    }

    private Person master() {
        Person person = new Person();
        person.setPersonKey("person");
        return person;
    }
    private Assignment row(String key, LocalDate date, int order, long version) {
        Assignment row = new Assignment();
        row.setAssignmentKey(key);
        row.setPersonKey("person");
        row.setAssignmentDate(date);
        row.setAssignmentOrder(order);
        row.setVersion(version);
        return row;
    }
}
