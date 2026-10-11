package com.main.app.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import com.main.app.common.scheduler.SchedulerProperties;

/**
 * DB 스케줄러 전용 TaskScheduler 구성. 작업 등록/재조회는 SchedulerManager가 담당하며,
 * DB 정의 외의 @Scheduled 실행 경로를 만들지 않도록 @EnableScheduling은 사용하지 않는다.
 */
@Configuration
@EnableConfigurationProperties(SchedulerProperties.class)
public class SchedulingConfig {

    private static final Logger log = LoggerFactory.getLogger(SchedulingConfig.class);

    @Bean(name = "schedulerTaskScheduler")
    public ThreadPoolTaskScheduler schedulerTaskScheduler(SchedulerProperties properties) {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(Math.max(1, properties.getPoolSize()));
        scheduler.setThreadNamePrefix("db-scheduler-");
        scheduler.setRemoveOnCancelPolicy(true);
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds((int) Math.max(1, properties.shutdownTimeout().toSeconds()));
        scheduler.setErrorHandler(t -> log.error("[Scheduler] 스케줄 작업 처리 중 오류: {}", t.getMessage(), t));
        return scheduler;
    }
}