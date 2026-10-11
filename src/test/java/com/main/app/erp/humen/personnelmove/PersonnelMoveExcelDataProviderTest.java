package com.main.app.erp.humen.personnelmove;

import com.main.app.common.excel.ExcelSnapshotStore;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PersonnelMoveExcelDataProviderTest {
    @Test
    void exportsServerLabelsAndOrderAndRejectsChangedAssignmentVersions() {
        var service = mock(PersonnelMoveService.class);
        var code = new PersonnelMoveDto.CodeOption("102-020", "담임목사");
        when(service.getOptions()).thenReturn(new PersonnelMoveDto.Options(
                List.of(), List.of(code), List.of(), List.of(), List.of()));
        var store = new ExcelSnapshotStore(1800, 10);
        var provider = new PersonnelMoveExcelDataProvider(service, store);
        var row = new PersonnelMoveDto.Assignment();
        row.setAssignmentKey("assignment");
        row.setNameKo("홍길동");
        row.setEmployeeNo("000001");
        row.setAssignmentDate(LocalDate.of(2026, 10, 9));
        row.setAssignmentOrder(2);
        row.setGradeCode("102-020");
        row.setVersion(0L);
        row.setCurrentEffective(true);
        row.setApplied(true);
        var page = new PageImpl<>(List.of(row), PageRequest.of(1, 50), 51);
        when(service.getPersonnelMoveList(any())).thenReturn(page);
        var session = new MockHttpSession();
        session.setAttribute("userId", "test");
        var token = provider.issue(session, new PersonnelMoveDto.ListQuery(), page);
        var cells = store.verify(session, token).rows().getFirst().cells();
        assertEquals(51.0, cells.get("rowNumber").number().doubleValue());
        assertEquals(2.0, cells.get("assignmentOrder").number().doubleValue());
        assertEquals("담임목사", cells.get("gradeCode").text());
        assertEquals("-", cells.get("positionCode").text());
        assertEquals("반영", cells.get("applied").text());
        row.setVersion(1L);
        assertThrows(ResponseStatusException.class, () -> store.verify(session, token));
    }
}
