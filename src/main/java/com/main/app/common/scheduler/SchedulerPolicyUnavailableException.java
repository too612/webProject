package com.main.app.common.scheduler;

/** 스케줄 정책(DB)을 확인할 수 없을 때 발생한다. 실행 허용으로 간주하지 않는다. */
public class SchedulerPolicyUnavailableException extends RuntimeException {

    public SchedulerPolicyUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}