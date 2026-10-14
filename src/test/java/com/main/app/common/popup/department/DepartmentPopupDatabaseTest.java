package com.main.app.common.popup.department;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.transaction.support.TransactionTemplate;
import static org.assertj.core.api.Assertions.*;

class DepartmentPopupDatabaseTest {
    private DepartmentPopupService service;
    private JdbcTemplate jdbc;
    private TransactionTemplate transaction;
    private SqlSessionTemplate sessions;

    @BeforeEach
    void setUp() throws Exception {
        var properties = new Properties();
        try (var input = Files.newInputStream(Path.of("src", "main", "resources", "application-dev.properties"))) {
            properties.load(input);
        }
        var dataSource = new DriverManagerDataSource(resolve(properties.getProperty("spring.datasource.url")),
                resolve(properties.getProperty("spring.datasource.username")),
                resolve(properties.getProperty("spring.datasource.password")));
        jdbc = new JdbcTemplate(dataSource);
        transaction = new TransactionTemplate(new DataSourceTransactionManager(dataSource));
        transaction.setReadOnly(true);
        var configuration = new Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        var factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource); factory.setConfiguration(configuration);
        factory.setMapperLocations(new FileSystemResource(Path.of("src", "main", "resources", "mapper",
                "common", "popup", "department", "DepartmentPopupMapper.xml")));
        sessions = new SqlSessionTemplate(factory.getObject());
        var mapper = sessions.getMapper(DepartmentPopupMapper.class);
        service = new DepartmentPopupService(mapper);
    }

    @Test
    void allDatesAndEverySnapshotMatchRealDataWithoutWrites() {
        transaction.executeWithoutResult(status -> {
            var dates = service.getReorganizations();
            assertThat(dates).hasSize(jdbc.queryForObject("SELECT COUNT(*) FROM hrm_org_reorg", Integer.class));
            assertThat(dates).extracting(item -> item.getReorgDt()).isSortedAccordingTo(java.util.Comparator.reverseOrder());
            for (var date : dates) {
                var result = service.getInfo(date.getReorgKey(), "", "", false);
                assertThat(result.matchCount()).isEqualTo(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM hrm_org_dept WHERE reorg_key = ? AND use_yn = 'Y'",
                        Long.class, date.getReorgKey()));
                assertThat(result.departments()).allMatch(item -> item.isMatched());
                for (var item : result.departments()) {
                    var found = service.getInfo(date.getReorgKey(), item.getDeptCd(), "", true);
                    assertThat(found.matchCount()).isEqualTo(1);
                    assertThat(found.departments()).filteredOn(department -> department.isMatched())
                            .extracting(department -> department.getDeptCd()).containsExactly(item.getDeptCd());
                    if (item.getParentDeptKey() != null && result.departments().stream()
                            .anyMatch(parent -> parent.getDeptKey().equals(item.getParentDeptKey()))) {
                        assertThat(found.departments()).extracting(department -> department.getDeptKey())
                                .contains(item.getParentDeptKey());
                    }
                }
            }
            var latest = service.getInfo(null, "", "", false);
            if (!dates.isEmpty()) assertThat(latest.reorganization().getReorgKey()).isEqualTo(dates.getFirst().getReorgKey());
            assertThat(service.getInfo(null, "", "no-match-department-popup-82e178", false).matchCount()).isZero();
            assertThat(service.getInfo(null, "%_", "", false).matchCount()).isEqualTo(
                    latest.departments().stream().filter(item -> item.getDeptCd().contains("%_")).count());
        });
    }

    private static String resolve(String value) {
        if (value != null && value.startsWith("${") && value.endsWith("}")) {
            String expression = value.substring(2, value.length() - 1);
            int separator = expression.indexOf(':');
            String key = separator < 0 ? expression : expression.substring(0, separator);
            String environment = System.getenv(key);
            if (environment != null) return environment;
            if (separator >= 0) return expression.substring(separator + 1);
            throw new IllegalStateException("Missing environment variable: " + key);
        }
        return value;
    }
}
