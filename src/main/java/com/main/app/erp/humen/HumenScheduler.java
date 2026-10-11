package com.main.app.erp.humen;

import com.main.app.common.scheduler.SchedulerJob;
import com.main.app.common.scheduler.SchedulerJobContext;
import com.main.app.common.scheduler.SchedulerJobResult;
import com.main.app.erp.humen.personnelmove.AssignmentApplyService;
import com.main.app.erp.humen.personnelmove.PersonnelMoveMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class HumenScheduler implements SchedulerJob {
    private final PersonnelMoveMapper mapper;
    private final AssignmentApplyService applyService;

    @Override
    public String getCode() { return AssignmentApplyService.JOB_CODE; }

    @Override
    public SchedulerJobResult execute(SchedulerJobContext context) {
        int count = 0;
        int failures = 0;
        RuntimeException firstFailure = null;
        for (String personKey : mapper.selectSyncPersonKeys()) {
            context.ensureLeaseHeld();
            try {
                count += applyService.synchronizePerson(personKey, context::ensureLeaseHeld);
            } catch (RuntimeException exception) {
                context.ensureLeaseHeld();
                failures++;
                if (firstFailure == null) firstFailure = exception;
                log.error("인사 발령 동기화 실패: personKey={}", personKey, exception);
            }
            context.ensureLeaseHeld();
        }
        if (failures > 0) throw new IllegalStateException(
                "발령 동기화 일부 실패: 반영 " + count + "건, 실패 " + failures + "명", firstFailure);
        return SchedulerJobResult.of(count, "발령 마스터 동기화 완료");
    }
}
