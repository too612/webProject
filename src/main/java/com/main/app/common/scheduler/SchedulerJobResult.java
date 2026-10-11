package com.main.app.common.scheduler;

public record SchedulerJobResult(int processedCount, String message) {

    public static SchedulerJobResult of(int processedCount, String message) {
        return new SchedulerJobResult(processedCount, message);
    }

    public static SchedulerJobResult empty() {
        return new SchedulerJobResult(0, null);
    }
}