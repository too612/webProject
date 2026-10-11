package com.main.app.erp.humen.personnelmove;

import com.main.app.common.exception.ApiExceptionHandler;
import com.main.app.erp.humen.personnelmove.dto.PersonnelMoveDto.*;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PersonnelMoveControllerTest {
    private final PersonnelMoveService service = mock(PersonnelMoveService.class);
    private final PersonnelMoveController controller = new PersonnelMoveController(service,
            mock(PersonnelMoveExcelDataProvider.class));

    @Test
    void isoCalendarQueryAcceptsDatesAndRejectsInvalidCalendar() throws Exception {
        when(service.getPersonnelMoveList(any())).thenReturn(
                Page.empty(org.springframework.data.domain.PageRequest.of(0, 50)));
        var mvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ApiExceptionHandler()).build();
        mvc.perform(get("/api/erp/humen/personnelmove")
                .param("assignmentDateFrom", "2026-10-01").param("assignmentDateTo", "2026-10-09"))
                .andExpect(status().isOk());
        verify(service).getPersonnelMoveList(argThat(query ->
                LocalDate.of(2026, 10, 1).equals(query.getAssignmentDateFrom())
                && LocalDate.of(2026, 10, 9).equals(query.getAssignmentDateTo())));
        mvc.perform(get("/api/erp/humen/personnelmove").param("assignmentDateFrom", "2026-02-30"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/erp/humen/personnelmove").param("assignmentDateTo", "not-a-date"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void mutationAuditComesFromAuthenticatedSessionAndRemoteAddress() {
        var request = new MockHttpServletRequest();
        Assignment row = new Assignment();
        assertThatThrownBy(() -> controller.setCreate(row, request)).isInstanceOf(ResponseStatusException.class);
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("userId", "authenticated-editor");
        request.setSession(session);
        request.setRemoteAddr("127.0.0.9");
        when(service.setCreate(eq(row), any())).thenReturn(row);
        controller.setCreate(row, request);
        verify(service).setCreate(row, new Audit("authenticated-editor", "127.0.0.9"));
    }
}
