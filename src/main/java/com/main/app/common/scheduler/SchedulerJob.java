package com.main.app.common.scheduler;

/**
 * DB 스케줄러가 실행할 수 있는 작업 구현 계약.
 * Spring 빈으로 등록된 구현체의 {@link #getCode()}만 실행 허용 목록에 포함되며, DB 값으로 임의 클래스/메서드를 호출하지 않는다.
 */
public interface SchedulerJob {

    /** sys_scheduler_job.job_code와 일치하는 고유 코드 (^[A-Z][A-Z0-9_]{1,49}$). */
    String getCode();

    /** 실패 시 예외를 던지면 FAILED 이력으로 기록된다. 정책/잠금 확인은 실행기가 호출 전에 수행한다. */
    SchedulerJobResult execute(SchedulerJobContext context) throws Exception;
}