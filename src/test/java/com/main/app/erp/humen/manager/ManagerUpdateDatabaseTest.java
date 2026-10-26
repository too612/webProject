package com.main.app.erp.humen.manager;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.main.app.erp.humen.manager.dto.ManagerDto;

/** 실제 스키마에서 수정 SQL을 검증한다. 모든 변경은 테스트 종료 시 롤백된다. */
@SpringBootTest
@Transactional
class ManagerUpdateDatabaseTest {

    private static final String PROTECTED_COLUMNS = """
            SELECT person_key, employee_no, dept_cd, grade_code, position_code, employment_type_code,
                   service_status_code, hire_date, retire_date, promotion_date, photo_url, profile_photo_url
            FROM hrm_person WHERE person_key = ?
            """;

    @Autowired private ManagerMapper mapper;
    @Autowired private JdbcTemplate jdbcTemplate;

    @Test
    void basicInfoUpdateChangesOnlyAllowedColumns() {
        String personKey = jdbcTemplate.queryForObject(
                "SELECT person_key FROM hrm_person ORDER BY employee_no LIMIT 1", String.class);
        Map<String, Object> before = jdbcTemplate.queryForMap(PROTECTED_COLUMNS, personKey);
        ManagerDto.BasicInfoUpdate request = new ManagerDto.BasicInfoUpdate();
        request.setNameKo("수정테스트");
        request.setNameEn("Update Test");
        request.setBirthDate("1990-01-02");
        request.setGenderCode("F");
        request.setPostalCode("12345");
        request.setAddressLine1("주소");

        assertThat(mapper.selectEmployeeNoForUpdate(personKey)).isEqualTo(before.get("employee_no"));
        assertThat(mapper.updateBasicInfo(personKey, request, new ManagerDto.Audit("db-test", "127.0.0.1")))
                .isEqualTo(1);

        assertThat(jdbcTemplate.queryForMap(PROTECTED_COLUMNS, personKey)).isEqualTo(before);
        Map<String, Object> after = jdbcTemplate.queryForMap(
                "SELECT name_ko, name_en, birth_date::text AS birth_date, gender_code, postal_code, "
                        + "address_line1, address_line2, upd_user, host(upd_ip) AS upd_ip "
                        + "FROM hrm_person WHERE person_key = ?", personKey);
        assertThat(after.get("name_ko")).isEqualTo("수정테스트");
        assertThat(after.get("birth_date")).isEqualTo("1990-01-02");
        assertThat(after.get("gender_code")).isEqualTo("F");
        assertThat(after.get("address_line2")).isNull();
        assertThat(after.get("upd_user")).isEqualTo("db-test");
        assertThat(after.get("upd_ip")).isEqualTo("127.0.0.1");
    }

    @Test
    void profilePhotoUpdateChangesOnlyProfileUrl() {
        String personKey = jdbcTemplate.queryForObject(
                "SELECT person_key FROM hrm_person ORDER BY employee_no LIMIT 1", String.class);
        String nameBefore = jdbcTemplate.queryForObject(
                "SELECT name_ko FROM hrm_person WHERE person_key = ?", String.class, personKey);
        var audit = new ManagerDto.Audit("db-test", "127.0.0.1");

        assertThat(mapper.updateProfilePhoto(personKey, "/data/profile/test.png", audit)).isEqualTo(1);
        assertThat(jdbcTemplate.queryForObject("SELECT profile_photo_url FROM hrm_person WHERE person_key = ?",
                String.class, personKey)).isEqualTo("/data/profile/test.png");
        assertThat(mapper.updateProfilePhoto(personKey, null, audit)).isEqualTo(1);
        assertThat(jdbcTemplate.queryForObject("SELECT profile_photo_url FROM hrm_person WHERE person_key = ?",
                String.class, personKey)).isNull();
        assertThat(jdbcTemplate.queryForObject("SELECT name_ko FROM hrm_person WHERE person_key = ?",
                String.class, personKey)).isEqualTo(nameBefore);
        assertThat(mapper.selectEmployeeNoForUpdate("missing")).isNull();
    }
}
