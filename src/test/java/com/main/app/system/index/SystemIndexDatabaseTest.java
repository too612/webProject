package com.main.app.system.index;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import com.main.app.system.index.dto.SystemIndexDto;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional(readOnly = true)
class SystemIndexDatabaseTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SystemIndexController controller;

    @Test
    void inspectDocumentedSourcesWithoutChangingData() {
        for (String table : new String[] {"sys_menu", "com_code", "sys_role", "sys_program",
                "sys_role_program_permission"}) {
            boolean exists = Boolean.TRUE.equals(jdbcTemplate.queryForObject(
                    "SELECT to_regclass(?) IS NOT NULL", Boolean.class, table));
            assertThat(exists).as("Required system source %s exists", table).isTrue();
            var columns = jdbcTemplate.queryForList("""
                    SELECT column_name FROM information_schema.columns
                    WHERE table_schema = current_schema() AND table_name = ?
                    ORDER BY ordinal_position
                    """, String.class, table);
            assertThat(columns).contains("reg_dtm", "upd_dtm");
        }
    }

    @Test
    void dashboardQueriesAndTotalsUseTheSameLiveDefinitions() {
        var response = controller.getIndexData();
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getStatusCode()).isEqualTo(200);
        assertThat(response.getMessage()).isEqualTo("OK");
        var data = response.getData();
        assertThat(data.getSource()).isEqualTo("LIVE");
        assertThat(data.getAsOf()).isEqualTo(jdbcTemplate.queryForObject("SELECT CURRENT_DATE", java.time.LocalDate.class));
        assertThat(data.getMenuCount()).isEqualTo(count("SELECT COUNT(*) FROM sys_menu"));
        assertThat(data.getRoutedMenuCount()).isEqualTo(count(
                "SELECT COUNT(*) FROM sys_menu WHERE NULLIF(BTRIM(path), '') IS NOT NULL"));
        assertThat(data.getProgramCount()).isEqualTo(count("SELECT COUNT(*) FROM sys_program"));
        assertThat(data.getActiveProgramCount()).isEqualTo(count("SELECT COUNT(*) FROM sys_program WHERE is_active"));
        assertThat(data.getRoleCount()).isEqualTo(count("SELECT COUNT(*) FROM sys_role"));
        assertThat(data.getActiveRoleCount()).isEqualTo(count("SELECT COUNT(*) FROM sys_role WHERE is_active"));
        assertThat(data.getCodeCount()).isEqualTo(count("SELECT COUNT(*) FROM com_code"));
        assertThat(data.getActiveCodeCount()).isEqualTo(count("SELECT COUNT(*) FROM com_code WHERE use_yn = 'Y'"));
        assertThat(data.getProgramStatus().stream().mapToLong(SystemIndexDto.Distribution::getCount).sum())
                .isEqualTo(data.getProgramCount());
        assertThat(data.getProgramStatus().stream().filter(item -> item.getLabel().equals("사용"))
                .mapToLong(SystemIndexDto.Distribution::getCount).sum()).isEqualTo(data.getActiveProgramCount());
        assertThat(data.getRoleCoverage()).hasSize(Math.toIntExact(data.getActiveRoleCount()));
        assertThat(data.getRoleCoverage()).allSatisfy(item -> {
            assertThat(item.getLabel()).isNotBlank();
            assertThat(item.getReadCount()).isBetween(0L, data.getActiveProgramCount());
            assertThat(item.getWriteCount()).isBetween(0L, data.getActiveProgramCount());
        });
        var permissions = jdbcTemplate.queryForList("""
                SELECT r.role_name AS label,
                       (SELECT COUNT(*) FROM sys_role_program_permission a JOIN sys_program p USING (program_id)
                         WHERE a.role_id = r.role_id AND a.is_open AND p.is_active AND a.can_read) AS read_count,
                       (SELECT COUNT(*) FROM sys_role_program_permission a JOIN sys_program p USING (program_id)
                         WHERE a.role_id = r.role_id AND a.is_open AND p.is_active AND a.can_write) AS write_count
                  FROM sys_role r WHERE r.is_active ORDER BY r.sort_order, r.role_id
                """);
        for (int i = 0; i < permissions.size(); i++) {
            var expected = permissions.get(i);
            var actual = data.getRoleCoverage().get(i);
            assertThat(actual.getLabel()).isEqualTo(expected.get("label"));
            assertThat(expected.get("read_count")).isEqualTo(actual.getReadCount());
            assertThat(expected.get("write_count")).isEqualTo(actual.getWriteCount());
        }
        assertThat(data.getRecentChanges()).hasSizeLessThanOrEqualTo(8).allSatisfy(item -> {
            assertThat(item.getKind()).isIn("MENU", "CODE", "ROLE", "PROGRAM");
            assertThat(item.getLabel()).isNotBlank();
            assertThat(item.getChangedAt()).matches("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}");
        });
    }

    @Test
    void sixMonthsIncludeEmptyBucketsAndMatchPeriodCounts() {
        var data = controller.getIndexData().getData();
        var months = jdbcTemplate.queryForList("""
                SELECT TO_CHAR(m, 'YYYY-MM') FROM generate_series(
                    DATE_TRUNC('month', CURRENT_TIMESTAMP) - INTERVAL '5 months',
                    DATE_TRUNC('month', CURRENT_TIMESTAMP), INTERVAL '1 month') m ORDER BY m
                """, String.class);
        assertThat(data.getMonthlyRegistrations()).hasSize(6)
                .extracting(SystemIndexDto.MonthlyRegistration::getMonth).containsExactlyElementsOf(months);
        assertThat(data.getPeriodStart().toString().substring(0, 7)).isEqualTo(months.getFirst());
        assertThat(data.getMonthlyRegistrations().stream().mapToLong(SystemIndexDto.MonthlyRegistration::getCodeCount).sum())
                .isEqualTo(data.getPeriodCodeCount());
        assertThat(data.getMonthlyRegistrations().stream().mapToLong(SystemIndexDto.MonthlyRegistration::getProgramCount).sum())
                .isEqualTo(data.getPeriodProgramCount());
        for (var item : data.getMonthlyRegistrations()) {
            assertThat(item.getCodeCount()).isEqualTo(jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM com_code WHERE TO_CHAR(reg_dtm, 'YYYY-MM') = ?", Long.class, item.getMonth()));
            assertThat(item.getProgramCount()).isEqualTo(jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM sys_program WHERE TO_CHAR(reg_dtm, 'YYYY-MM') = ?", Long.class, item.getMonth()));
        }
    }

    private long count(String sql) {
        return jdbcTemplate.queryForObject(sql, Long.class);
    }
}
