package com.main.app.community.index;

import com.main.app.community.index.dto.CommunityIndexDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional(readOnly = true)
class CommunityIndexDatabaseTest {

    @Autowired
    private CommunityIndexController controller;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void sourceTablesAndRequiredColumnsExist() {
        assertThat(jdbcTemplate.queryForObject("SELECT to_regclass('board') IS NOT NULL", Boolean.class)).isTrue();
        assertThat(jdbcTemplate.queryForObject("SELECT to_regclass('sys_menu') IS NOT NULL", Boolean.class)).isTrue();
        assertThat(jdbcTemplate.queryForList("""
                SELECT column_name FROM information_schema.columns
                WHERE table_schema = current_schema()
                  AND table_name = 'board'
                """, String.class)).contains("rqst_no", "title", "board_type", "secret", "password", "views", "ins_dt", "rqst_id");
    }

    @Test
    void liveDashboardOnlyAggregatesPublicKnownCategories() {
        var response = controller.getIndexData();
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getStatusCode()).isEqualTo(200);
        assertThat(response.getMessage()).isEqualTo("OK");
        var data = response.getData();
        assertThat(data.getSource()).isEqualTo("LIVE");
        assertThat(data.getAsOf()).isEqualTo(jdbcTemplate.queryForObject(
                "SELECT TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')", String.class));
        var codes = data.getCategories().stream().map(CommunityIndexDto.Category::getCode).toArray(String[]::new);
        var expected = jdbcTemplate.queryForMap("""
                SELECT COUNT(*) AS total,
                       COUNT(DISTINCT NULLIF(BTRIM(rqst_id), '')) AS contributors,
                       COALESCE(SUM(GREATEST(COALESCE(views, 0), 0)), 0) AS views
                FROM board
                WHERE secret = 'N' AND NULLIF(BTRIM(password), '') IS NULL
                  AND board_type = ANY(?)
                """, (Object) codes);
        assertThat(data.getStats().getTotalPosts()).isEqualTo(((Number) expected.get("total")).longValue());
        assertThat(data.getStats().getContributors()).isEqualTo(((Number) expected.get("contributors")).longValue());
        assertThat(data.getStats().getTotalViews()).isEqualTo(((Number) expected.get("views")).longValue());
        assertThat(data.getCategories()).hasSize(13).allSatisfy(category -> {
            assertThat(category.getLabel()).isNotBlank();
            assertThat(category.getParam()).isNotNull();
            assertThat(category.getPath()).startsWith("/community/");
            assertThat(category.getCount()).isEqualTo(jdbcTemplate.queryForObject("""
                    SELECT COUNT(*) FROM board WHERE board_type = ?
                    AND secret = 'N' AND NULLIF(BTRIM(password), '') IS NULL
                    """, Long.class, category.getCode()));
        });
        assertThat(data.getRecentPosts()).hasSize((int) Math.min(data.getStats().getTotalPosts(), 6));
        assertThat(data.getRecentPosts()).allSatisfy(post -> {
            assertThat(post.getTitle()).isNotNull();
            assertThat(post.getCategory()).isNotBlank();
            assertThat(post.getViews()).isNotNegative();
            assertThat(post.getPath()).startsWith("/community/");
        });
    }

    @Test
    void monthlyPeriodsAndAllWidgetTotalsAgree() {
        var data = controller.getIndexData().getData();
        var expectedMonths = jdbcTemplate.queryForList("""
                SELECT TO_CHAR(m, 'YYYY-MM')
                FROM generate_series(DATE_TRUNC('month', CURRENT_TIMESTAMP) - INTERVAL '5 months',
                    DATE_TRUNC('month', CURRENT_TIMESTAMP), INTERVAL '1 month') m
                ORDER BY m
                """, String.class);
        assertThat(data.getMonthlyPosts()).extracting(CommunityIndexDto.MonthlyPosts::getMonth)
                .containsExactlyElementsOf(expectedMonths);
        assertThat(data.getPeriodStart()).isEqualTo(expectedMonths.getFirst() + "-01");
        assertThat(data.getPeriodEnd()).isEqualTo(jdbcTemplate.queryForObject("""
                SELECT TO_CHAR(DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month', 'YYYY-MM-DD')
                """, String.class));
        assertThat(data.getMonthlyPosts().getLast().getCount()).isEqualTo(data.getStats().getCurrentMonthPosts());
        assertThat(data.getMonthlyPosts().stream().mapToLong(CommunityIndexDto.MonthlyPosts::getCount).sum())
                .isEqualTo(data.getStats().getPeriodPosts());
        assertThat(data.getCategories().stream().mapToLong(CommunityIndexDto.Category::getCount).sum())
                .isEqualTo(data.getStats().getTotalPosts());
        assertThat(data.getCategories().stream().mapToLong(CommunityIndexDto.Category::getPeriodCount).sum())
                .isEqualTo(data.getStats().getPeriodPosts());
        var codes = data.getCategories().stream().map(CommunityIndexDto.Category::getCode).toArray(String[]::new);
        assertThat(data.getStats().getPeriodPosts()).isEqualTo(jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM board WHERE secret = 'N' AND NULLIF(BTRIM(password), '') IS NULL
                  AND board_type = ANY(?)
                  AND ins_dt >= DATE_TRUNC('month', CURRENT_TIMESTAMP) - INTERVAL '5 months'
                  AND ins_dt < DATE_TRUNC('month', CURRENT_TIMESTAMP) + INTERVAL '1 month'
                """, Long.class, (Object) codes));
    }
}
