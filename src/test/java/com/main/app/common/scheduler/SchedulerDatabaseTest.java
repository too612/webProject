package com.main.app.common.scheduler;

import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Properties;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class SchedulerDatabaseTest {
    private static final String JOB = "HRM_ASSIGNMENT_SYNC";
    private JdbcTemplate admin;
    private JdbcTemplate jdbc;
    private String schema;
    private SchedulerMapper mapper;
    private SqlSessionTemplate sessions;
    private SchedulerPolicyService policy;

    @BeforeEach
    void setup() throws Exception {
        var properties = new Properties();
        try (var stream = Files.newInputStream(Path.of("src", "main", "resources", "application-dev.properties"))) {
            properties.load(stream);
        }
        String url = resolve(properties.getProperty("spring.datasource.url"));
        String user = resolve(properties.getProperty("spring.datasource.username"));
        String password = resolve(properties.getProperty("spring.datasource.password"));
        admin = new JdbcTemplate(new DriverManagerDataSource(url, user, password));
        schema = "scheduler_test_" + UUID.randomUUID().toString().replace("-", "");
        admin.execute("CREATE SCHEMA " + schema);
        var source = new DriverManagerDataSource(
                url + (url.contains("?") ? "&" : "?") + "currentSchema=" + schema, user, password);
        jdbc = new JdbcTemplate(source);
        jdbc.execute(Files.readString(Path.of("docs", "table", "sys_scheduler.sql")));
        jdbc.execute(Files.readString(Path.of("docs", "table", "sys_scheduler_seed.sql")));
        jdbc.execute(Files.readString(Path.of("docs", "table", "sys_scheduler.sql")));
        var factory = new SqlSessionFactoryBean();
        factory.setDataSource(source);
        factory.setConfiguration(new Configuration());
        factory.setMapperLocations(new FileSystemResource(
                Path.of("src", "main", "resources", "mapper", "common", "scheduler", "SchedulerMapper.xml")));
        sessions = new SqlSessionTemplate(java.util.Objects.requireNonNull(factory.getObject()));
        mapper = sessions.getMapper(SchedulerMapper.class);
        policy = new SchedulerPolicyService(mapper,
                Clock.fixed(Instant.parse("2026-10-09T09:00:00Z"), ZoneOffset.UTC));
    }

    @AfterEach
    void cleanup() {
        if (admin != null && schema != null) admin.execute("DROP SCHEMA " + schema + " CASCADE");
    }

    @Test
    void disabledScheduleDoesNotBlockManualApplyButBusinessHoldDoes() {
        assertTrue(policy.isEnabled(JOB));
        jdbc.update("UPDATE sys_scheduler_job SET is_enabled=FALSE WHERE job_code=?", JOB);
        assertFalse(policy.isEnabled(JOB));
        assertTrue(policy.isApplyAllowed("HRM_ASSIGNMENT"));
        jdbc.update("""
                INSERT INTO sys_scheduler_business_hold(business_code,hold_start_at,hold_end_at)
                VALUES('HRM_ASSIGNMENT','2026-10-09 08:00:00+00','2026-10-09 10:00:00+00')
                """);
        assertFalse(policy.isApplyAllowed("HRM_ASSIGNMENT"));
        assertEquals(SchedulerPolicyDecision.BUSINESS_HOLD, policy.evaluate(JOB).reasonCode());
    }

    @Test
    void pauseEndIsExclusiveAndJobPauseDoesNotBlockManualApply() {
        jdbc.update("""
                INSERT INTO sys_scheduler_pause(job_code,pause_start_at,pause_end_at)
                VALUES(?,'2026-10-09 08:00:00+00','2026-10-09 09:00:00+00')
                """, JOB);
        assertTrue(policy.isEnabled(JOB));
        jdbc.update("UPDATE sys_scheduler_pause SET pause_end_at='2026-10-09 10:00:00+00'");
        assertFalse(policy.isEnabled(JOB));
        assertTrue(policy.isApplyAllowed("HRM_ASSIGNMENT"));
    }

    @Test
    void databaseLeaseCanOnlyBeAcquiredRenewedAndReleasedByItsOwner() {
        assertEquals(1, mapper.setAcquireLock(JOB, "first", 60));
        assertEquals(0, mapper.setAcquireLock(JOB, "second", 60));
        assertEquals(0, mapper.setRenewLock(JOB, "second", 60));
        assertEquals(1, mapper.setRenewLock(JOB, "first", 60));
        assertEquals(0, mapper.setReleaseLock(JOB, "second"));
        assertEquals(1, mapper.setReleaseLock(JOB, "first"));
        assertEquals(1, mapper.setAcquireLock(JOB, "second", 60));
    }

    private static String resolve(String value) {
        if (value.startsWith("${") && value.endsWith("}")) {
            String expression = value.substring(2, value.length() - 1);
            int separator = expression.indexOf(':');
            String name = separator < 0 ? expression : expression.substring(0, separator);
            String environment = System.getenv(name);
            if (environment != null) return environment;
            if (separator >= 0) return expression.substring(separator + 1);
            throw new IllegalStateException("Required database environment variable is missing: " + name);
        }
        return value;
    }
}
