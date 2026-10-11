package com.main.app.erp.humen.personnelmove;

import com.main.app.common.scheduler.*;
import com.main.app.erp.humen.HumenScheduler;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class HumenSchedulerTest {
    private final PersonnelMoveMapper mapper = mock(PersonnelMoveMapper.class);
    private final AssignmentApplyService apply = mock(AssignmentApplyService.class);
    private final SchedulerLease lease = mock(SchedulerLease.class);
    private final SchedulerJobContext context = new SchedulerJobContext("HRM_ASSIGNMENT_SYNC",
            SchedulerTriggerType.SCHEDULED, Instant.now(), ZoneId.of("Asia/Seoul"), 1L, lease);
    private final HumenScheduler scheduler = new HumenScheduler(mapper, apply);

    @Test
    void personFailureDoesNotPreventOthersButFinalResultIsFailure() {
        when(mapper.selectSyncPersonKeys()).thenReturn(List.of("first", "second", "third"));
        when(apply.synchronizePerson(eq("first"), any(Runnable.class))).thenReturn(1);
        when(apply.synchronizePerson(eq("second"), any(Runnable.class))).thenThrow(new IllegalStateException("invalid code"));
        when(apply.synchronizePerson(eq("third"), any(Runnable.class))).thenReturn(2);
        assertThatThrownBy(() -> scheduler.execute(context)).isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("반영 3건").hasMessageContaining("실패 1명");
        verify(apply).synchronizePerson(eq("third"), any(Runnable.class));
        verify(lease, times(7)).ensureHeld();
    }

    @Test
    void lostLeaseAbortsWithoutTryingNextPerson() {
        when(mapper.selectSyncPersonKeys()).thenReturn(List.of("first", "second"));
        doThrow(new SchedulerLeaseLostException("HRM_ASSIGNMENT_SYNC", "lost")).when(lease).ensureHeld();
        assertThatThrownBy(() -> scheduler.execute(context)).isInstanceOf(SchedulerLeaseLostException.class);
        verifyNoInteractions(apply);
    }

    @Test
    void successCountsAppliedRowsAndChecksLeaseAroundEveryPerson() {
        when(mapper.selectSyncPersonKeys()).thenReturn(List.of("first", "second"));
        when(apply.synchronizePerson(anyString(), any(Runnable.class))).thenReturn(2);
        assertThat(scheduler.execute(context).processedCount()).isEqualTo(4);
        verify(lease, times(4)).ensureHeld();
    }
}
