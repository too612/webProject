package com.main.app.erp.humen.personnelmove;

import com.main.app.common.scheduler.SchedulerPolicyService;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Properties;
import java.util.UUID;
import java.util.function.Supplier;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 실제 PostgreSQL/Mapper 검증. dev 설정을 사용하되 매 테스트 전용 스키마만 생성/삭제한다.
 * shared public 데이터나 운영 마이그레이션은 실행하지 않는다.
 */
class PersonnelMoveDatabaseTest {
    private static final String PERSON = "a".repeat(80);
    private static final String LEGACY_MAIN = "b".repeat(80);
    private static final String LEGACY_CONCURRENT = "c".repeat(80);
    private static final Audit AUDIT = new Audit("assignment-db-test", "127.0.0.1");
    private static final LocalDate TODAY = LocalDate.of(2026, 10, 9);
    private String schema;
    private JdbcTemplate admin;
    private JdbcTemplate jdbc;
    private TransactionTemplate transaction;
    private PersonnelMoveMapper mapper;
    private PersonnelMoveService service;
    private AssignmentApplyService apply;
    private SchedulerPolicyService policy;

    @BeforeEach
    void setUp() throws Exception {
        Properties properties = new Properties();
        try (var input = Files.newInputStream(Path.of("src", "main", "resources", "application-dev.properties"))) {
            properties.load(input);
        }
        String url = resolve(properties.getProperty("spring.datasource.url"));
        String user = resolve(properties.getProperty("spring.datasource.username"));
        String password = resolve(properties.getProperty("spring.datasource.password"));
        admin = new JdbcTemplate(new DriverManagerDataSource(url, user, password));
        schema = "assignment_test_" + UUID.randomUUID().toString().replace("-", "");
        admin.execute("CREATE SCHEMA " + schema);
        var dataSource = new DriverManagerDataSource(url + (url.contains("?") ? "&" : "?") + "currentSchema=" + schema, user, password);
        jdbc = new JdbcTemplate(dataSource);
        jdbc.execute("""
            CREATE TABLE hrm_person(
                person_key CHAR(80) PRIMARY KEY,employee_no VARCHAR(30) UNIQUE NOT NULL,name_ko VARCHAR(100) NOT NULL,
                dept_cd VARCHAR(30),grade_code VARCHAR(30),position_code VARCHAR(30),employment_type_code VARCHAR(30),
                service_status_code VARCHAR(30),hire_date DATE,retire_date DATE,
                reg_user VARCHAR(50) DEFAULT 'SYSTEM',reg_dtm TIMESTAMPTZ DEFAULT NOW(),reg_ip INET,
                upd_user VARCHAR(50),upd_dtm TIMESTAMPTZ,upd_ip INET);
            CREATE TABLE hrm_org_dept(dept_cd VARCHAR(30) PRIMARY KEY,use_yn CHAR(1) DEFAULT 'Y');
            CREATE TABLE com_code(code VARCHAR(7) PRIMARY KEY,code_name VARCHAR(100),parent_code VARCHAR(7),
                use_yn CHAR(1) DEFAULT 'Y',sort_order INTEGER DEFAULT 0);
            CREATE TABLE sys_country_code(country_code VARCHAR(2) PRIMARY KEY);
            INSERT INTO hrm_org_dept(dept_cd) VALUES ('D001'),('D002');
            INSERT INTO com_code(code,code_name,parent_code) VALUES
                ('102-010','직급1','102'),('102-020','직급2','102'),('102-050','시험직급','102'),
                ('103-010','직위','103'),('104-010','고용','104'),('106-010','직책','106'),
                ('105-010','임용','105'),('105-060','은퇴','105');
            INSERT INTO sys_country_code VALUES ('KR');
            """);
        jdbc.update("INSERT INTO hrm_person(person_key,employee_no,name_ko,dept_cd,grade_code) VALUES(?,?,?,?,?)",
                PERSON, "EMP001", "테스트", "D001", "102-010");
        jdbc.execute(Files.readString(Path.of("docs", "table", "hrm_assignment.sql")));
        jdbc.update("""
            INSERT INTO hrm_assignment(assignment_key,person_key,employee_no,assignment_date,assignment_type_code,
                dept_cd,concurrent_assignment_yn,reg_user,upd_user) VALUES (?,?,?,?,'105-010','D001','N','seed','seed')
            """, LEGACY_MAIN, PERSON, "EMP001", java.sql.Date.valueOf(TODAY.minusDays(10)));
        jdbc.update("""
            INSERT INTO hrm_assignment(assignment_key,person_key,employee_no,assignment_date,assignment_type_code,
                dept_cd,concurrent_assignment_yn,reg_user,upd_user) VALUES (?,?,?,?,'105-010','D002','Y','seed','seed')
            """, LEGACY_CONCURRENT, PERSON, "EMP001", java.sql.Date.valueOf(TODAY.minusDays(5)));
        String migration = Files.readString(Path.of("docs", "table", "hrm_assignment_migration.sql"));
        jdbc.execute(migration);
        jdbc.execute(migration);

        Configuration configuration = new Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        var factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource);
        factory.setConfiguration(configuration);
        factory.setMapperLocations(new FileSystemResource(Path.of("src", "main", "resources", "mapper",
                "erp", "humen", "personnelmove", "PersonnelMoveMapper.xml")));
        mapper = new SqlSessionTemplate(factory.getObject()).getMapper(PersonnelMoveMapper.class);
        transaction = new TransactionTemplate(new DataSourceTransactionManager(dataSource));
        policy = mock(SchedulerPolicyService.class);
        when(policy.isEnabled(AssignmentApplyService.JOB_CODE)).thenReturn(true);
        apply = new AssignmentApplyService(mapper, policy,
                Clock.fixed(Instant.parse("2026-10-09T03:00:00Z"), ZoneId.of("Asia/Seoul")));
        service = new PersonnelMoveService(mapper, apply);
    }

    @AfterEach
    void tearDown() {
        if (admin != null && schema != null) admin.execute("DROP SCHEMA IF EXISTS " + schema + " CASCADE");
    }

    @Test
    void migrationPreservesLegacyRowsAndSplitsConcurrentIdentityIdempotently() {
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM hrm_assignment", Integer.class)).isEqualTo(2);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM hrm_concurrent_person", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT employee_no FROM hrm_concurrent_person", String.class)).isEqualTo("EMP001_1");
        assertThat(jdbc.queryForObject("SELECT next_concurrent_number FROM hrm_person", Long.class)).isEqualTo(2L);
        assertThat(mapper.selectAssignment(LEGACY_MAIN, TODAY).getGradeCode()).isEqualTo("102-010");
        assertThat(mapper.selectAssignment(LEGACY_CONCURRENT, TODAY).getConcurrentKey()).isEqualTo(LEGACY_CONCURRENT);
        assertThat(tx(() -> apply.synchronizePerson(PERSON))).isEqualTo(2);
        assertThat(jdbc.queryForObject("SELECT dept_cd FROM hrm_person", String.class)).isEqualTo("D001");
        assertThat(jdbc.queryForObject("SELECT dept_cd FROM hrm_concurrent_person", String.class)).isEqualTo("D002");
        assertThat(tx(() -> apply.synchronizePerson(PERSON))).isZero();
        ConcurrentRequest request = new ConcurrentRequest();
        request.setPersonKey(PERSON);
        Person next = tx(() -> service.setCreateConcurrent(request, AUDIT));
        assertThat(next.getEmployeeNo()).isEqualTo("EMP001_2");
        jdbc.update("UPDATE hrm_concurrent_person SET del_yn='Y' WHERE concurrent_key=?", next.getConcurrentKey());
        assertThat(tx(() -> service.setCreateConcurrent(request, AUDIT)).getEmployeeNo()).isEqualTo("EMP001_3");
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM hrm_person", Integer.class)).isEqualTo(1);
    }

    @Test
    void immediateFuturePauseVersionAndHistoryPoliciesUseActualMapper() {
        tx(() -> apply.synchronizePerson(PERSON));
        Assignment today = tx(() -> service.setCreate(row(TODAY, 1, "D002", "105-060"), AUDIT));
        assertThat(today.isCurrentEffective()).isTrue();
        assertThat(today.isApplied()).isTrue();
        assertThat(jdbc.queryForObject("SELECT service_status_code FROM hrm_person", String.class)).isEqualTo("101-020");
        assertThat(jdbc.queryForObject("SELECT retire_date FROM hrm_person", LocalDate.class)).isEqualTo(TODAY);
        Assignment future = tx(() -> service.setCreate(row(TODAY.plusDays(1), 1, "D001", "105-010"), AUDIT));
        assertThat(future.isPending()).isTrue();
        assertThat(future.isApplied()).isFalse();
        assertThat(jdbc.queryForObject("SELECT dept_cd FROM hrm_person", String.class)).isEqualTo("D002");
        assertThatThrownBy(() -> tx(() -> service.setCreate(row(TODAY, 1, "D001", "105-010"), AUDIT)))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("중복");
        Assignment legacy = service.getInfo(LEGACY_MAIN);
        legacy.setDeptCd("D002");
        assertThatThrownBy(() -> tx(() -> service.setUpdate(LEGACY_MAIN, legacy, AUDIT)))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("사유");
        legacy.setHistoricalEdit(true);
        legacy.setHistoricalReason("과거 오기 정정");
        tx(() -> service.setUpdate(LEGACY_MAIN, legacy, AUDIT));
        assertThat(jdbc.queryForObject("SELECT applied_assignment_key FROM hrm_person", String.class)).isEqualTo(today.getAssignmentKey());
        assertThat(tx(() -> apply.synchronizePerson(PERSON))).isZero();
        legacy.setVersion(1L);
        legacy.setAssignmentDate(TODAY);
        legacy.setAssignmentOrder(2);
        assertThatThrownBy(() -> tx(() -> service.setUpdate(LEGACY_MAIN, legacy, AUDIT)))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("새 발령");
        when(policy.isEnabled(AssignmentApplyService.JOB_CODE)).thenReturn(false);
        when(policy.isBusinessPaused(SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT)).thenReturn(true);
        Assignment replacement = row(TODAY, 2, "D001", "105-010");
        replacement.setPositionCode(null);
        replacement.setEmploymentTypeCode(null);
        replacement.setJobTitleCode(null);
        Assignment pending = tx(() -> service.setCreate(replacement, AUDIT));
        assertThat(pending.isSyncPaused()).isTrue();
        assertThat(pending.isPending()).isTrue();
        assertThat(jdbc.queryForObject("SELECT service_status_code FROM hrm_person", String.class)).isEqualTo("101-020");
        assertThat(tx(() -> apply.synchronizePerson(PERSON))).isZero();
        when(policy.isEnabled(AssignmentApplyService.JOB_CODE)).thenReturn(true);
        when(policy.isBusinessPaused(SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT)).thenReturn(false);
        assertThat(tx(() -> apply.synchronizePerson(PERSON))).isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT retire_date FROM hrm_person", LocalDate.class)).isNull();
        assertThat(jdbc.queryForObject("SELECT position_code FROM hrm_person", String.class)).isNull();
        assertThat(jdbc.queryForObject("SELECT employment_type_code FROM hrm_person", String.class)).isNull();
        assertThat(jdbc.queryForObject("SELECT job_title_code FROM hrm_person", String.class)).isNull();
        assertThat(jdbc.queryForObject("SELECT service_status_code FROM hrm_person", String.class)).isEqualTo("101-010");
        pending.setDeptCd("D002");
        Assignment revised = tx(() -> service.setUpdate(pending.getAssignmentKey(), pending, AUDIT));
        assertThat(revised.getVersion()).isEqualTo(1L);
        assertThatThrownBy(() -> tx(() -> service.setUpdate(pending.getAssignmentKey(), pending, AUDIT)))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("다른 사용자");
        tx(() -> { service.delRemove(revised.getAssignmentKey(), revised.getVersion(), false, null, AUDIT); return null; });
        assertThat(jdbc.queryForObject("SELECT applied_assignment_key FROM hrm_person", String.class)).isEqualTo(today.getAssignmentKey());
        assertThat(jdbc.queryForObject("SELECT del_yn FROM hrm_assignment WHERE assignment_key=?", String.class,
                revised.getAssignmentKey())).isEqualTo("Y");
        tx(() -> { service.delRemove(today.getAssignmentKey(), today.getVersion(), false, null, AUDIT); return null; });
        assertThatThrownBy(() -> tx(() -> {
            service.delRemove(LEGACY_MAIN, 1, true, "삭제", AUDIT); return null;
        })).isInstanceOf(ResponseStatusException.class).hasMessageContaining("유일한 도래");
    }

    @Test
    void concurrentChangesAndSoftDeletionDoNotMutateOriginalMaster() {
        tx(() -> apply.synchronizePerson(PERSON));
        Assignment row = row(TODAY, 1, "D002", "105-060");
        row.setScope("concurrent");
        row.setConcurrentKey(LEGACY_CONCURRENT);
        Assignment saved = tx(() -> service.setCreate(row, AUDIT));
        assertThat(saved.getEmployeeNo()).isEqualTo("EMP001_1");
        assertThat(jdbc.queryForObject("SELECT service_status_code FROM hrm_person", String.class)).isEqualTo("101-010");
        assertThat(jdbc.queryForObject("SELECT service_status_code FROM hrm_concurrent_person", String.class)).isEqualTo("101-020");
        tx(() -> { service.delRemove(saved.getAssignmentKey(), saved.getVersion(), false, null, AUDIT); return null; });
        assertThat(jdbc.queryForObject("SELECT service_status_code FROM hrm_concurrent_person", String.class)).isEqualTo("101-010");
        ListQuery query = new ListQuery();
        query.setScope("concurrent");
        query.setSize(1);
        assertThat(service.getPersonnelMoveList(query).getTotalElements()).isEqualTo(1);
        assertThat(service.getPersonnelMoveList(query).getContent().getFirst().getPersonKey()).isEqualTo(PERSON);
        row.setConcurrentKey("d".repeat(80));
        assertThatThrownBy(() -> tx(() -> service.setCreate(row, AUDIT))).isInstanceOf(ResponseStatusException.class);
        Assignment invalid = row(TODAY, 2, "DOES-NOT-EXIST", "105-010");
        assertThatThrownBy(() -> tx(() -> service.setCreate(invalid, AUDIT)))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("부서코드");
        assertThat(mapper.selectCodeOptions("102")).hasSize(3);
    }

    @Test
    void oldHistoryAndFutureMutationsDoNotCatchUpUnappliedDueAssignment() {
        when(policy.isBusinessPaused(SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT)).thenReturn(true);
        Assignment due = tx(() -> service.setCreate(row(TODAY, 1, "D002", "105-060"), AUDIT));
        assertThat(due.isPending()).isTrue();
        assertThat(jdbc.queryForObject("SELECT applied_assignment_key FROM hrm_person", String.class)).isNull();
        when(policy.isBusinessPaused(SchedulerPolicyService.BUSINESS_HRM_ASSIGNMENT)).thenReturn(false);
        Assignment old = service.getInfo(LEGACY_MAIN);
        old.setHistoricalEdit(true);
        old.setHistoricalReason("기록 내용 수정");
        old.setAssignmentContent("이력 수정만");
        tx(() -> service.setUpdate(LEGACY_MAIN, old, AUDIT));
        Assignment future = tx(() -> service.setCreate(row(TODAY.plusDays(3), 1, "D001", "105-010"), AUDIT));
        future.setDeptCd("D002");
        Assignment futureRevised = tx(() -> service.setUpdate(future.getAssignmentKey(), future, AUDIT));
        tx(() -> { service.delRemove(futureRevised.getAssignmentKey(), futureRevised.getVersion(), false, null, AUDIT); return null; });
        assertThat(jdbc.queryForObject("SELECT applied_assignment_key FROM hrm_person", String.class)).isNull();
        assertThat(jdbc.queryForObject("SELECT dept_cd FROM hrm_person", String.class)).isEqualTo("D001");
        assertThat(tx(() -> apply.synchronizePerson(PERSON))).isEqualTo(2);
        assertThat(jdbc.queryForObject("SELECT applied_assignment_key FROM hrm_person", String.class)).isEqualTo(due.getAssignmentKey());
        assertThat(jdbc.queryForObject("SELECT dept_cd FROM hrm_person", String.class)).isEqualTo("D002");
    }

    @Test
    void dateRangeFiltersAreInclusiveAndInvalidRangesRejected() {
        tx(() -> service.setCreate(row(TODAY, 1, "D002", "105-010"), AUDIT));
        ListQuery query = new ListQuery();
        query.setAssignmentDateFrom(TODAY);
        query.setAssignmentDateTo(TODAY);
        assertThat(service.getPersonnelMoveList(query).getTotalElements()).isEqualTo(1);
        assertThat(service.getPersonnelMoveList(query).getContent()).allSatisfy(row -> assertThat(row.getAssignmentDate()).isEqualTo(TODAY));
        query.setAssignmentDateFrom(TODAY.plusDays(1));
        assertThatThrownBy(() -> service.getPersonnelMoveList(query)).isInstanceOf(ResponseStatusException.class);
        query.setAssignmentDateFrom(LocalDate.of(0, 1, 1));
        assertThatThrownBy(() -> service.getPersonnelMoveList(query)).isInstanceOf(ResponseStatusException.class);
        query.setAssignmentDateFrom(null);
        query.setSort("untrusted SQL");
        assertThatThrownBy(() -> service.getPersonnelMoveList(query)).isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void leaseLostBeforeCommitRollsBackOnePersonTransaction() {
        java.util.concurrent.atomic.AtomicBoolean lost = new java.util.concurrent.atomic.AtomicBoolean();
        assertThatThrownBy(() -> tx(() -> {
            int count = apply.synchronizePerson(PERSON, () -> {
                if (lost.get()) throw new IllegalStateException("lease lost");
            });
            lost.set(true);
            return count;
        })).isInstanceOf(IllegalStateException.class).hasMessageContaining("lease lost");
        assertThat(jdbc.queryForObject("SELECT applied_assignment_key FROM hrm_person", String.class)).isNull();
        assertThat(jdbc.queryForObject("SELECT applied_assignment_key FROM hrm_concurrent_person", String.class)).isNull();
    }

    private Assignment row(LocalDate date, int order, String dept, String type) {
        Assignment row = new Assignment();
        row.setPersonKey(PERSON);
        row.setAssignmentDate(date);
        row.setAssignmentOrder(order);
        row.setAssignmentTypeCode(type);
        row.setDeptCd(dept);
        row.setGradeCode("102-020");
        row.setPositionCode("103-010");
        row.setEmploymentTypeCode("104-010");
        row.setJobTitleCode("106-010");
        return row;
    }
    private <T> T tx(Supplier<T> operation) { return transaction.execute(status -> operation.get()); }
    private static String resolve(String value) {
        if (value != null && value.startsWith("${") && value.endsWith("}")) {
            String[] parts = value.substring(2, value.length() - 1).split(":", 2);
            String environment = System.getenv(parts[0]);
            return environment == null ? (parts.length == 2 ? parts[1] : "") : environment;
        }
        return value;
    }
}
