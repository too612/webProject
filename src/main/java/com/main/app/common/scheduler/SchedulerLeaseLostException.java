package com.main.app.common.scheduler;

/** 실행 잠금 lease를 잃어 다른 인스턴스와 중복 실행될 수 있어 작업을 중단해야 할 때 발생한다. */
public class SchedulerLeaseLostException extends RuntimeException {

    private final String jobCode;

    public SchedulerLeaseLostException(String jobCode, String reason) {
        super("실행 잠금 lease 상실(job=" + jobCode + "): " + reason);
        this.jobCode = jobCode;
    }

    public String getJobCode() {
        return jobCode;
    }
}