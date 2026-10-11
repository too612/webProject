package com.main.app.common.scheduler;

public record SchedulerExecutionResult(
        String jobCode,
        SchedulerExecutionStatus status,
        Long historyId,
        int processedCount,
        String message) {
}