package com.main.app.erp.index;

import com.main.app.erp.index.dto.ErpIndexDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional(readOnly = true)
class ErpIndexDatabaseTest {

    @Autowired
    private ErpIndexController controller;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void dashboardLoadsFromDocumentedHrmTables() {
        for (String table : new String[] {"hrm_person", "hrm_org_dept", "com_code"}) {
            assertThat(jdbcTemplate.queryForObject("SELECT to_regclass(?) IS NOT NULL", Boolean.class, table))
                    .as("Required dashboard table %s exists", table)
                    .isTrue();
        }

        var response = controller.getIndexData();

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getStatusCode()).isEqualTo(200);
        assertThat(response.getMessage()).isEqualTo("OK");
        var data = response.getData();
        assertThat(data.getTotalMembers())
                .isEqualTo(jdbcTemplate.queryForObject("SELECT COUNT(*) FROM hrm_person", Long.class));
        assertThat(data.getActiveMemberCount())
                .isEqualTo(jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM hrm_person WHERE service_status_code = '101-010'", Long.class));
        assertThat(data.getNewMemberCount())
                .isEqualTo(jdbcTemplate.queryForObject("""
                        SELECT COUNT(*) FROM hrm_person
                        WHERE reg_dtm >= DATE_TRUNC('month', CURRENT_TIMESTAMP)
                          AND reg_dtm < DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month'
                        """, Long.class));
        assertThat(data.getDepartmentCount())
                .isEqualTo(jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM hrm_org_dept WHERE use_yn = 'Y'", Long.class));
    }

    @Test
    void registrationsReturnSixOrderedMonthsIncludingZeroCounts() {
        var data = controller.getIndexData().getData();
        var expectedMonths = jdbcTemplate.queryForList("""
                SELECT TO_CHAR(month_start, 'YYYY-MM')
                FROM generate_series(
                    DATE_TRUNC('month', CURRENT_TIMESTAMP) - INTERVAL '5 months',
                    DATE_TRUNC('month', CURRENT_TIMESTAMP),
                    INTERVAL '1 month'
                ) AS month_start
                ORDER BY month_start
                """, String.class);

        assertThat(data.getMonthlyRegistrations())
                .hasSize(6)
                .extracting(ErpIndexDto.MonthlyRegistration::getMonth)
                .containsExactlyElementsOf(expectedMonths);
        for (var month : data.getMonthlyRegistrations()) {
            assertThat(month.getCount()).isEqualTo(jdbcTemplate.queryForObject("""
                    SELECT COUNT(*) FROM hrm_person
                    WHERE TO_CHAR(reg_dtm, 'YYYY-MM') = ?
                    """, Long.class, month.getMonth()));
        }
        assertThat(data.getMonthlyRegistrations().getLast().getCount()).isEqualTo(data.getNewMemberCount());
    }

    @Test
    void categoryAndDepartmentTotalsMatchDashboardMetrics() {
        var data = controller.getIndexData().getData();

        assertThat(data.getServiceStatusDistribution().stream().mapToLong(ErpIndexDto.MemberCategory::getCount).sum())
                .isEqualTo(data.getTotalMembers());
        assertThat(data.getEmploymentDistribution().stream().mapToLong(ErpIndexDto.MemberCategory::getCount).sum())
                .isEqualTo(data.getTotalMembers());
        assertThat(data.getDepartmentStaff().stream().mapToLong(ErpIndexDto.DepartmentStaff::getStaffCount).sum())
                .isEqualTo(data.getActiveMemberCount());
        assertThat(data.getServiceStatusDistribution()).allSatisfy(item -> {
            assertThat(item.getCode()).isNotNull();
            assertThat(item.getLabel()).isNotBlank();
            assertThat(item.getCount()).isPositive();
        });
        assertThat(data.getEmploymentDistribution()).allSatisfy(item -> {
            assertThat(item.getCode()).isNotNull();
            assertThat(item.getLabel()).isNotBlank();
            assertThat(item.getCount()).isPositive();
        });
        assertThat(data.getDepartmentStaff()).allSatisfy(item -> {
            assertThat(item.getDepartmentCode()).isNotNull();
            assertThat(item.getDepartment()).isNotBlank();
            assertThat(item.getStaffCount()).isPositive();
        });
    }
}
