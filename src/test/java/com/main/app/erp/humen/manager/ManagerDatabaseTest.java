package com.main.app.erp.humen.manager;

import com.main.app.erp.humen.manager.dto.ManagerDto;
import com.main.app.common.excel.ExcelController;
import com.main.app.common.excel.ExcelModel;
import com.main.app.common.excel.ExcelSnapshotStore;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional(readOnly = true)
class ManagerDatabaseTest {

    @Autowired
    private ManagerController controller;

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired private ExcelController excelController;
    @Autowired private ExcelSnapshotStore excelSnapshots;

    @Test
    void databaseListSnapshotProducesDownloadOfSameVisibleValues() throws Exception {
        var session = new MockHttpSession();
        session.setAttribute("userId", "excel-db-test");
        var request = new MockHttpServletRequest();
        request.setSession(session);
        var listResponse = new MockHttpServletResponse();
        var query = new ManagerDto.ListQuery();
        query.setSize(50);
        var page = controller.listWithSnapshot(query, true, request, listResponse).getData();
        String token = listResponse.getHeader("X-Excel-Snapshot");
        assertThat(token).isNotBlank();
        var snapshot = excelSnapshots.verify(session, token);
        var columns = snapshot.columns().stream().filter(column ->
                java.util.Set.of("rowNumber", "nameKo", "employeeNo", "detail").contains(column.id())).toList();
        var body = new ExcelModel.Request("인사관리", java.util.List.of(new ExcelModel.Sheet("인사관리", columns,
                java.util.List.of(new ExcelModel.Block(token,
                        java.util.stream.IntStream.range(0, page.getNumberOfElements()).boxed().toList())))));
        var download = new MockHttpServletResponse();
        excelController.download(body, request, download);
        try (var workbook = new XSSFWorkbook(new java.io.ByteArrayInputStream(download.getContentAsByteArray()))) {
            var sheet = workbook.getSheetAt(0);
            assertThat(sheet.getLastRowNum()).isEqualTo(page.getNumberOfElements());
            for (int index = 0; index < page.getNumberOfElements(); index++) {
                var row = sheet.getRow(index + 1);
                assertThat(row.getCell(0).getNumericCellValue()).isEqualTo(index + 1);
                assertThat(row.getCell(1).getStringCellValue()).isEqualTo(page.getContent().get(index).getNameKo());
                assertThat(row.getCell(2).getStringCellValue()).isEqualTo(page.getContent().get(index).getEmployeeNo());
                assertThat(row.getCell(3).getStringCellValue()).isEqualTo("상세보기");
            }
        }
    }

    @Test
    void consecutiveBlocksMatchStableDefaultOrderAndResponseContract() {
        var expected = jdbcTemplate.queryForList("""
                SELECT person_key FROM hrm_person
                ORDER BY employee_no ASC NULLS LAST, employee_no ASC, person_key ASC
                """, String.class);
        var keys = new ArrayList<String>();
        int pages = Math.max(1, (expected.size() + 49) / 50);
        for (int page = 0; page < pages; page++) {
            ManagerDto.ListQuery query = new ManagerDto.ListQuery();
            query.setPage(page);
            query.setSize(50);
            var response = controller.list(query);
            assertThat(response.isSuccess()).isTrue();
            assertThat(response.getStatusCode()).isEqualTo(200);
            assertThat(response.getData().getTotalElements()).isEqualTo(expected.size());
            response.getData().forEach(person -> keys.add(person.getPersonKey()));
        }
        assertThat(keys).containsExactlyElementsOf(expected);
        assertThat(keys).doesNotHaveDuplicates();
    }

    @Test
    void descendingNameSortAndKeywordFilterAreAppliedBeforePaging() {
        var expected = jdbcTemplate.queryForList("""
                SELECT person_key FROM hrm_person
                ORDER BY name_ko DESC NULLS LAST, employee_no ASC, person_key ASC
                LIMIT 50
                """, String.class);
        ManagerDto.ListQuery query = new ManagerDto.ListQuery();
        query.setSize(50);
        query.setSortField("nameKo");
        query.setSortDirection("desc");
        var people = controller.list(query).getData();
        assertThat(people.getContent()).extracting(person -> Objects.requireNonNull(person).getPersonKey())
                .containsExactlyElementsOf(expected);
        if (!people.isEmpty()) {
            query.setKeyword(people.getContent().getFirst().getEmployeeNo());
            var filtered = controller.list(query).getData();
            assertThat(filtered.getTotalElements()).isEqualTo(jdbcTemplate.queryForObject("""
                    SELECT COUNT(*) FROM hrm_person
                    WHERE name_ko ILIKE '%' || ? || '%'
                       OR employee_no ILIKE '%' || ? || '%'
                       OR name_en ILIKE '%' || ? || '%'
                    """, Long.class, query.getKeyword(), query.getKeyword(), query.getKeyword()));
        }

    }

    @Test
    void gradeAndPositionSortingMatchTheirOwnCodeNames() {
        for (String field : java.util.List.of("gradeName", "positionName")) {
            boolean grade = field.equals("gradeName");
            String column = grade ? "grade_code" : "position_code";
            String parent = grade ? "102" : "103";
            for (String direction : java.util.List.of("asc", "desc")) {
                var expected = jdbcTemplate.queryForList("""
                        SELECT hp.person_key FROM hrm_person hp
                        LEFT JOIN com_code code ON hp.%s = code.code
                          AND code.parent_code = ? AND code.use_yn = 'Y'
                        ORDER BY code.code_name %s NULLS LAST, hp.employee_no ASC, hp.person_key ASC
                        LIMIT 50
                        """.formatted(column, direction), String.class, parent);
                ManagerDto.ListQuery query = new ManagerDto.ListQuery();
                query.setSize(50);
                query.setSortField(field);
                query.setSortDirection(direction);
                assertThat(controller.list(query).getData().getContent())
                        .extracting(person -> Objects.requireNonNull(person).getPersonKey())
                        .containsExactlyElementsOf(expected);
            }
        }
    }
}
