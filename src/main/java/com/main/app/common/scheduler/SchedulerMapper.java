package com.main.app.common.scheduler;

import java.time.OffsetDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.main.app.common.scheduler.dto.SchedulerBusinessHoldDto;
import com.main.app.common.scheduler.dto.SchedulerHistoryDto;
import com.main.app.common.scheduler.dto.SchedulerJobDto;
import com.main.app.common.scheduler.dto.SchedulerPauseDto;

@Mapper
public interface SchedulerMapper {

    List<SchedulerJobDto> getJobList();

    SchedulerJobDto getJobInfo(@Param("jobCode") String jobCode);

    List<SchedulerPauseDto> getActivePauseList(@Param("jobCode") String jobCode, @Param("now") OffsetDateTime now);

    List<SchedulerBusinessHoldDto> getActiveBusinessHoldList(@Param("businessCode") String businessCode,
                                                             @Param("now") OffsetDateTime now);

    int setAcquireLock(@Param("jobCode") String jobCode,
                       @Param("owner") String owner,
                       @Param("leaseSeconds") int leaseSeconds);

    int setRenewLock(@Param("jobCode") String jobCode,
                     @Param("owner") String owner,
                     @Param("leaseSeconds") int leaseSeconds);

    int setReleaseLock(@Param("jobCode") String jobCode, @Param("owner") String owner);

    int setHistoryCreate(SchedulerHistoryDto history);

    int setHistoryUpdate(SchedulerHistoryDto history);

    int setJobStarted(@Param("jobCode") String jobCode, @Param("startedAt") OffsetDateTime startedAt);

    int setJobFinished(@Param("jobCode") String jobCode,
                       @Param("status") String status,
                       @Param("message") String message,
                       @Param("finishedAt") OffsetDateTime finishedAt,
                       @Param("success") boolean success);
}