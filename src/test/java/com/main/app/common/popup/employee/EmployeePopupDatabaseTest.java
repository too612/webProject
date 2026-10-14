package com.main.app.common.popup.employee;

import com.main.app.common.popup.employee.dto.EmployeePopupDto;
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

class EmployeePopupDatabaseTest {
    private EmployeePopupService service;
    private EmployeePopupMapper mapper;
    private JdbcTemplate jdbc;
    private TransactionTemplate transaction;

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
                "common", "popup", "employee", "EmployeePopupMapper.xml")));
        mapper = new SqlSessionTemplate(factory.getObject()).getMapper(EmployeePopupMapper.class);
        service = new EmployeePopupService(mapper);
    }

    @Test
    void currentSnapshotExcludesDraftInactiveAndFutureAndTreeMatchesDatabase() {
        transaction.executeWithoutResult(status -> {
            var expected = jdbc.queryForList("""
                    SELECT reorg_key FROM hrm_org_reorg
                    WHERE conf_yn = 'Y' AND use_yn = 'Y' AND reorg_dt <= CURRENT_DATE
                    ORDER BY reorg_dt DESC, reg_dtm DESC, reorg_key LIMIT 1
                    """, String.class);
            assertThat(expected).isNotEmpty();
            var context = service.getContext();
            assertThat(context.reorganization().getReorgKey()).isEqualTo(expected.getFirst());
            assertThat(context.departments()).hasSize(jdbc.queryForObject(
                    "SELECT COUNT(*) FROM hrm_org_dept WHERE reorg_key = ? AND use_yn = 'Y'",
                    Integer.class, expected.getFirst()));
            assertThat(context.grades()).hasSize(jdbc.queryForObject(
                    "SELECT COUNT(*) FROM com_code WHERE parent_code = '102' AND use_yn = 'Y'", Integer.class));
            assertThat(context.positions()).hasSize(jdbc.queryForObject(
                    "SELECT COUNT(*) FROM com_code WHERE parent_code = '103' AND use_yn = 'Y'", Integer.class));
            assertThat(context.serviceStatuses()).hasSize(jdbc.queryForObject(
                    "SELECT COUNT(*) FROM com_code WHERE parent_code = '101' AND use_yn = 'Y'", Integer.class));
            var unavailable = jdbc.queryForList("""
                    SELECT reorg_key FROM hrm_org_reorg
                    WHERE conf_yn != 'Y' OR use_yn != 'Y' OR reorg_dt > CURRENT_DATE
                    """, String.class);
            unavailable.forEach(key -> assertThat(mapper.selectReorganization(key)).isNull());
        });
    }

    @Test
    void pagingFiltersAndAllowedSortsUseFullDatabaseCountsWithoutWrites() {
        transaction.executeWithoutResult(status -> {
            var first = service.getInfo(new EmployeePopupDto.Query());
            assertThat(first.totalElements()).isEqualTo(jdbc.queryForObject("SELECT COUNT(*) FROM hrm_person", Long.class));
            assertThat(first.content()).extracting(EmployeePopupDto.Employee::getEmployeeNo).isSorted();
            var secondQuery = new EmployeePopupDto.Query(); secondQuery.setPage(1);
            var second = service.getInfo(secondQuery);
            assertThat(second.totalElements()).isEqualTo(first.totalElements());
            assertThat(second.content()).extracting(EmployeePopupDto.Employee::getPersonKey)
                    .doesNotContainAnyElementsOf(first.content().stream().map(EmployeePopupDto.Employee::getPersonKey).toList());
            for (String sort : java.util.List.of("nameKo", "deptName", "gradeName", "positionName", "serviceStatusName", "employeeNo")) {
                var query = new EmployeePopupDto.Query(); query.setSortField(sort); query.setSortDirection("desc");
                assertThat(service.getInfo(query).totalElements()).isEqualTo(first.totalElements());
            }
            var active = new EmployeePopupDto.Query(); active.setServiceStatusCode("101-010"); active.setSize(2);
            assertThat(service.getInfo(active).totalElements()).isEqualTo(jdbc.queryForObject(
                    "SELECT COUNT(*) FROM hrm_person WHERE service_status_code = '101-010'", Long.class));
            for (var department : service.getContext().departments()) {
                var query = new EmployeePopupDto.Query(); query.setDeptCd(department.getDeptCd());
                var result = service.getInfo(query);
                assertThat(result.totalElements()).isEqualTo(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM hrm_person WHERE dept_cd = ?", Long.class, department.getDeptCd()));
                assertThat(result.content()).allMatch(item -> department.getDeptCd().equals(item.getDeptCd()));
            }
            if (!first.content().isEmpty()) {
                var row = first.content().getFirst();
                var query = new EmployeePopupDto.Query();
                query.setPersonKey(row.getPersonKey()); query.setNameKo(row.getNameKo()); query.setEmployeeNo(row.getEmployeeNo());
                query.setGradeCode(row.getGradeCode()); query.setPositionCode(row.getPositionCode());
                query.setServiceStatusCode(row.getServiceStatusCode()); query.setDeptName(row.getDeptName());
                assertThat(service.getInfo(query).content()).extracting(EmployeePopupDto.Employee::getPersonKey)
                        .containsExactly(row.getPersonKey());
            }
            var literal = new EmployeePopupDto.Query(); literal.setNameKo("%_");
            assertThat(service.getInfo(literal).totalElements()).isEqualTo(jdbc.queryForObject(
                    "SELECT COUNT(*) FROM hrm_person WHERE STRPOS(name_ko, '%_') > 0", Long.class));
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
