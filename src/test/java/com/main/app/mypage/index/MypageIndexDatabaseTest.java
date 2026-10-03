package com.main.app.mypage.index;

import com.main.app.mypage.index.dto.MypageIndexDto;
import org.junit.jupiter.api.Test;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(properties = "mybatis.configuration.log-impl=org.apache.ibatis.logging.nologging.NoLoggingImpl")
@Transactional(readOnly = true)
class MypageIndexDatabaseTest {
    @Autowired
    private MypageIndexService service;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private SqlSessionFactory sqlSessionFactory;

    @Autowired
    private MypageIndexController controller;

    @Test
    void invalidModeReturnsAnExplicitFailureContract() {
        var response = controller.invalidMode();
        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getStatusCode()).isEqualTo(400);
        assertThat(response.getMessage()).isNotBlank();
        assertThat(response.getData()).isNull();
    }

    @Test
    void allLiveStatementsBindTheUserAndDemoStatementsDoNotReferenceTables() {
        var configuration = sqlSessionFactory.getConfiguration();
        for (String suffix : new String[] {"Stats", "MonthlyActivities", "Categories", "RecentActivities"}) {
            var liveSql = configuration.getMappedStatement(MypageIndexMapper.class.getName() + ".select" + suffix)
                    .getBoundSql(Map.of("userId", "dashboard-readonly-no-records"));
            assertThat(liveSql.getSql()).contains("WHERE rqst_id = ?");
            assertThat(liveSql.getParameterMappings()).extracting(mapping -> mapping.getProperty())
                    .containsExactly("userId");
            var demoSql = configuration.getMappedStatement(MypageIndexMapper.class.getName() + ".selectDemo" + suffix)
                    .getBoundSql(null);
            assertThat(demoSql.getSql()).contains("generate_series(1, 24)").doesNotContain("FROM board");
            assertThat(demoSql.getParameterMappings()).isEmpty();
        }
    }

    @Test
    void liveQueriesAreScopedToTheSuppliedAuthenticatedIdentity() {
        assertThat(jdbc.queryForObject("SELECT to_regclass('board') IS NOT NULL", Boolean.class)).isTrue();
        String identity = "dashboard-readonly-no-records";
        var data = service.getIndexData(identity, MypageIndexDto.Source.LIVE);
        assertThat(data.getSource()).isEqualTo(MypageIndexDto.Source.LIVE);
        assertThat(data.getStats().getTotalActivities()).isEqualTo(jdbc.queryForObject(
                "SELECT COUNT(*) FROM board WHERE rqst_id = ?", Long.class, identity));
        assertThat(data.getStats().getInquiryCount()).isEqualTo(jdbc.queryForObject(
                "SELECT COUNT(*) FROM board WHERE rqst_id = ? AND board_type = 'QNA'", Long.class, identity));
        assertPeriodsAndTotals(data);
        for (var month : data.getMonthlyActivities()) {
            assertThat(month.getCount()).isEqualTo(jdbc.queryForObject("""
                    SELECT COUNT(*) FROM board
                    WHERE rqst_id = ? AND TO_CHAR(ins_dt, 'YYYY-MM') = ?
                    """, Long.class, identity, month.getMonth()));
        }
        assertThat(data.getRecentActivities()).hasSizeLessThanOrEqualTo(5);
    }

    @Test
    void demoUsesXmlOnlyAndHasConsistentCounts() {
        var data = service.getIndexData("dashboard-readonly-no-records", MypageIndexDto.Source.DEMO);
        assertThat(data.getSource()).isEqualTo(MypageIndexDto.Source.DEMO);
        assertThat(data.getStats().getTotalActivities()).isEqualTo(24);
        assertThat(data.getStats().getPeriodActivities()).isEqualTo(24);
        assertThat(data.getStats().getCurrentMonthActivities()).isEqualTo(4);
        assertThat(data.getStats().getInquiryCount()).isEqualTo(6);
        assertThat(data.getMonthlyActivities()).allSatisfy(month -> assertThat(month.getCount()).isEqualTo(4));
        assertThat(data.getRecentActivities()).hasSize(5).allSatisfy(item -> {
            assertThat(item.getTitle()).startsWith("활동 예시 ");
            assertThat(item.getDate()).matches("\\d{4}-\\d{2}-\\d{2}");
        });
        assertPeriodsAndTotals(data);
    }

    @Test
    void missingIdentityIsRejectedEvenForDemo() {
        assertThatThrownBy(() -> service.getIndexData(null, MypageIndexDto.Source.LIVE))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> service.getIndexData(" ", MypageIndexDto.Source.DEMO))
                .isInstanceOf(IllegalArgumentException.class);
    }

    private void assertPeriodsAndTotals(MypageIndexDto data) {
        var months = jdbc.queryForList("""
                SELECT TO_CHAR(m, 'YYYY-MM')
                FROM generate_series(DATE_TRUNC('month', CURRENT_TIMESTAMP) - INTERVAL '5 months',
                     DATE_TRUNC('month', CURRENT_TIMESTAMP), INTERVAL '1 month') m
                ORDER BY m
                """, String.class);
        assertThat(data.getMonthlyActivities()).extracting(MypageIndexDto.MonthlyActivity::getMonth)
                .containsExactlyElementsOf(months);
        assertThat(data.getMonthlyActivities().stream().mapToLong(MypageIndexDto.MonthlyActivity::getCount).sum())
                .isEqualTo(data.getStats().getPeriodActivities());
        assertThat(data.getMonthlyActivities().getLast().getCount()).isEqualTo(data.getStats().getCurrentMonthActivities());
        assertThat(data.getCategories().stream().mapToLong(MypageIndexDto.Category::getCount).sum())
                .isEqualTo(data.getStats().getTotalActivities());
        assertThat(data.getAsOf()).isEqualTo(jdbc.queryForObject("SELECT CURRENT_DATE::text", String.class));
        assertThat(data.getPeriodStart()).isEqualTo(months.getFirst() + "-01");
        assertThat(data.getPeriodEnd()).isEqualTo(jdbc.queryForObject(
                "SELECT TO_CHAR(DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month', 'YYYY-MM-DD')",
                String.class));
    }
}
