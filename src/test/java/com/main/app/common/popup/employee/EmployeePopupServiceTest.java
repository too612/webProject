package com.main.app.common.popup.employee;

import com.main.app.common.popup.employee.dto.EmployeePopupDto;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeePopupServiceTest {
    private EmployeePopupMapper mapper;
    private EmployeePopupService service;

    @BeforeEach
    void setUp() {
        mapper = mock(EmployeePopupMapper.class);
        service = new EmployeePopupService(mapper);
    }

    @Test
    void contextUsesCurrentConfirmedSnapshotAndSeparateCommonCodeGroups() {
        var reorganization = snapshot();
        when(mapper.selectReorganization("")).thenReturn(reorganization);
        when(mapper.selectDepartments("current")).thenReturn(List.of());
        when(mapper.selectCodes(anyString())).thenReturn(List.of());
        var result = service.getContext();
        assertThat(result.reorganization()).isSameAs(reorganization);
        verify(mapper).selectDepartments("current");
        verify(mapper).selectCodes("102");
        verify(mapper).selectCodes("103");
        verify(mapper).selectCodes("101");
    }

    @Test
    void nameResolutionKeepsFullCountEvenWhenOnlyTwoRowsAreRequested() {
        var query = new EmployeePopupDto.Query();
        query.setNameKo(" 김 "); query.setServiceStatusCode("101-010"); query.setSize(2);
        when(mapper.selectReorganization("")).thenReturn(snapshot());
        when(mapper.countEmployees(query)).thenReturn(70L);
        when(mapper.selectEmployees(query)).thenReturn(List.of(new EmployeePopupDto.Employee(), new EmployeePopupDto.Employee()));
        var result = service.getInfo(query);
        assertThat(result.totalElements()).isEqualTo(70);
        assertThat(result.content()).hasSize(2);
        assertThat(query.getReorgKey()).isEqualTo("current");
        assertThat(query.getNameKo()).isEqualTo("김");
        assertThat(query.getServiceStatusCode()).isEqualTo("101-010");
    }

    @Test
    void selectedSnapshotDepartmentAndSortingAreForwardedWithLongOffset() {
        var query = new EmployeePopupDto.Query();
        query.setReorgKey(" current "); query.setDeptCd(" D1 "); query.setDeptName(" 팀 ");
        query.setEmployeeNo(" E "); query.setGradeCode("102-010"); query.setPositionCode("103-010");
        query.setSortField("gradeName"); query.setSortDirection("desc"); query.setPage(Integer.MAX_VALUE);
        when(mapper.selectReorganization("current")).thenReturn(snapshot());
        when(mapper.selectEmployees(query)).thenReturn(List.of());
        service.getInfo(query);
        assertThat(query.getDeptCd()).isEqualTo("D1");
        assertThat(query.getDeptName()).isEqualTo("팀");
        assertThat(query.getEmployeeNo()).isEqualTo("E");
        assertThat(query.getOffset()).isEqualTo(107374182350L);
        verify(mapper).countEmployees(query);
        verify(mapper).selectEmployees(query);
    }

    @Test
    void missingOrUnavailableSnapshotIsAnExplicitError() {
        assertThatThrownBy(service::getContext).isInstanceOf(ResponseStatusException.class).hasMessageContaining("409");
        var query = new EmployeePopupDto.Query();
        query.setReorgKey("draft");
        assertThatThrownBy(() -> service.getInfo(query)).isInstanceOf(ResponseStatusException.class).hasMessageContaining("409");
        verify(mapper, never()).selectEmployees(any());
    }

    @Test
    void invalidSearchLengthsPagingAndSortAreRejectedBeforeQuerying() {
        var query = new EmployeePopupDto.Query();
        query.setNameKo("x".repeat(101));
        assertInvalid(query);
        query = new EmployeePopupDto.Query(); query.setEmployeeNo("x".repeat(31)); assertInvalid(query);
        query = new EmployeePopupDto.Query(); query.setDeptName("x".repeat(201)); assertInvalid(query);
        query = new EmployeePopupDto.Query(); query.setSize(101); assertInvalid(query);
        query = new EmployeePopupDto.Query(); query.setSize(0); assertInvalid(query);
        query = new EmployeePopupDto.Query(); query.setPage(-1); assertInvalid(query);
        query = new EmployeePopupDto.Query(); query.setSortField("unknown"); assertInvalid(query);
        query = new EmployeePopupDto.Query(); query.setSortDirection("DESC"); assertInvalid(query);
        verifyNoInteractions(mapper);
    }

    private void assertInvalid(EmployeePopupDto.Query query) {
        assertThatThrownBy(() -> service.getInfo(query)).isInstanceOf(ResponseStatusException.class).hasMessageContaining("400");
    }

    private EmployeePopupDto.Reorganization snapshot() {
        var result = new EmployeePopupDto.Reorganization();
        result.setReorgKey("current"); result.setReorgDt(LocalDate.parse("2026-01-01"));
        return result;
    }
}
