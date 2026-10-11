package com.main.app.common.scheduler;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

/**
 * 실행 허용 작업 목록. Spring 빈으로 등록된 {@link SchedulerJob} 구현체만 포함하며, DB의 job_code는 이 목록과 일치할 때만 실행된다.
 */
@Component
public class SchedulerJobRegistry {

    static final Pattern CODE_PATTERN = Pattern.compile("^[A-Z][A-Z0-9_]{1,49}$");

    private final Map<String, SchedulerJob> jobs;

    public SchedulerJobRegistry(List<SchedulerJob> jobs) {
        Map<String, SchedulerJob> map = new TreeMap<>();
        for (SchedulerJob job : jobs == null ? List.<SchedulerJob>of() : jobs) {
            String code = job.getCode();
            if (code == null || !CODE_PATTERN.matcher(code).matches()) {
                throw new IllegalStateException("Invalid scheduler job code '" + code + "' in " + job.getClass().getName());
            }
            SchedulerJob previous = map.putIfAbsent(code, job);
            if (previous != null) {
                throw new IllegalStateException("Duplicate scheduler job code '" + code + "': "
                        + previous.getClass().getName() + ", " + job.getClass().getName());
            }
        }
        this.jobs = Collections.unmodifiableMap(map);
    }

    public Optional<SchedulerJob> find(String code) {
        return code == null ? Optional.empty() : Optional.ofNullable(jobs.get(code));
    }

    public boolean contains(String code) {
        return code != null && jobs.containsKey(code);
    }

    public Set<String> getCodes() {
        return jobs.keySet();
    }
}