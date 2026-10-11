package com.main.app.erp.humen.personnelmove;

import com.main.app.common.scheduler.SchedulerPolicyService;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.*;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class AssignmentApplyService {
    public static final String JOB_CODE = "HRM_ASSIGNMENT_SYNC";
    private final PersonnelMoveMapper mapper;
    private final SchedulerPolicyService policy;
    private final Clock clock;

    @Autowired
    public AssignmentApplyService(PersonnelMoveMapper mapper, SchedulerPolicyService policy) {
        this(mapper, policy, Clock.system(ZoneId.of("Asia/Seoul")));
    }

    public AssignmentApplyService(PersonnelMoveMapper mapper, SchedulerPolicyService policy, Clock clock) {
        this.mapper = mapper;
        this.policy = policy;
        this.clock = clock;
    }

    public LocalDate today() {
        return LocalDate.now(clock);
    }

    public boolean isPaused() {
        return policy.isBusinessPaused(SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT);
    }

    @Transactional
    public int synchronizePerson(String personKey) {
        return synchronizePerson(personKey, () -> {});
    }

    @Transactional
    public int synchronizePerson(String personKey, Runnable leaseCheck) {
        leaseCheck.run();
        if (!policy.isEnabled(JOB_CODE)) return 0;
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void beforeCommit(boolean readOnly) { leaseCheck.run(); }
            });
        }
        Person person = mapper.lockPerson(personKey);
        if (person == null) return 0;
        int count = applyLocked(person, null, new Audit("SCHEDULER", null));
        for (Person concurrent : mapper.selectConcurrent(personKey)) {
            leaseCheck.run();
            Person locked = mapper.lockConcurrent(personKey, concurrent.getConcurrentKey());
            count += applyLocked(locked, locked.getConcurrentKey(), new Audit("SCHEDULER", null));
        }
        leaseCheck.run();
        return count;
    }

    public int applyLocked(Person master, String concurrentKey, Audit audit) {
        if (isPaused()) return 0;
        Assignment due = AssignmentRules.effective(
                mapper.selectTargetAssignments(master.getPersonKey(), concurrentKey), today());
        if (due == null || (Objects.equals(due.getAssignmentKey(), master.getAppliedAssignmentKey())
                && Objects.equals(due.getVersion(), master.getAppliedAssignmentVersion()))) return 0;
        if (concurrentKey == null) mapper.applyMain(due, audit);
        else mapper.applyConcurrent(due, audit);
        return 1;
    }
}
