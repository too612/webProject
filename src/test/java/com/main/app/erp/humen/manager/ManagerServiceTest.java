package com.main.app.erp.humen.manager;

import com.main.app.erp.humen.manager.dto.ManagerDto;
import com.main.app.erp.humen.manager.dto.ManagerRequest;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class ManagerServiceTest {

    @Test
    void blockQueryPreservesFiltersAndServerSort() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        when(mapper.selectPersonList(any())).thenReturn(List.of());
        ManagerDto.ListQuery query = new ManagerDto.ListQuery();
        query.setPage(2);
        query.setSize(50);
        query.setKeyword("keyword");
        query.setDeptCd("department");
        query.setGradeCode("grade");
        query.setPositionCode("position");
        query.setEmploymentTypeCode("employment");
        query.setServiceStatusCode("status");
        query.setSortField("nameKo");
        query.setSortDirection("desc");

        new ManagerService(mapper).getPersonList(query);

        ArgumentCaptor<ManagerDto.SearchCondition> captor =
                ArgumentCaptor.forClass(ManagerDto.SearchCondition.class);
        verify(mapper).selectPersonList(captor.capture());
        var condition = captor.getValue();
        assertThat(condition.getOffset()).isEqualTo(100);
        assertThat(condition.getLimit()).isEqualTo(50);
        assertThat(condition.getKeyword()).isEqualTo("keyword");
        assertThat(condition.getDeptCd()).isEqualTo("department");
        assertThat(condition.getGradeCode()).isEqualTo("grade");
        assertThat(condition.getPositionCode()).isEqualTo("position");
        assertThat(condition.getEmploymentTypeCode()).isEqualTo("employment");
        assertThat(condition.getServiceStatusCode()).isEqualTo("status");
        assertThat(condition.getSortField()).isEqualTo("nameKo");
        assertThat(condition.getSortDirection()).isEqualTo("desc");
        verify(mapper).countPersonList(condition);
    }

    @Test
    void unsupportedSortIsRejectedBeforeDatabaseAccess() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        ManagerService service = new ManagerService(mapper);
        ManagerDto.ListQuery query = new ManagerDto.ListQuery();
        query.setSortField("nameKo; DROP TABLE hrm_person");
        assertBadSort(service, query);
        query.setSortField("employeeNo");
        query.setSortDirection("invalid");
        assertBadSort(service, query);
        query.setSortDirection(null);
        assertBadSort(service, query);
        query.setSortField(null);
        assertBadSort(service, query);
        verifyNoInteractions(mapper);
    }

    @Test
    void largePageOffsetDoesNotOverflowAndSizeRemainsBounded() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        when(mapper.selectPersonList(any())).thenReturn(List.of());
        ManagerDto.ListQuery query = new ManagerDto.ListQuery();
        query.setPage(Integer.MAX_VALUE);
        query.setSize(500);
        new ManagerService(mapper).getPersonList(query);

        ArgumentCaptor<ManagerDto.SearchCondition> captor =
                ArgumentCaptor.forClass(ManagerDto.SearchCondition.class);
        verify(mapper).selectPersonList(captor.capture());
        assertThat(captor.getValue().getOffset()).isEqualTo(214748364700L);
        assertThat(captor.getValue().getLimit()).isEqualTo(100);
        assertThat(captor.getValue().getSortField()).isEqualTo("employeeNo");
        assertThat(captor.getValue().getSortDirection()).isEqualTo("asc");
    }

    private void assertBadSort(ManagerService service, ManagerDto.ListQuery query) {
        assertThatThrownBy(() -> service.getPersonList(query))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value())
                        .isEqualTo(400));
    }

    @Test
    void gradeAndPositionAreIndependentAllowedSorts() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        when(mapper.selectPersonList(any())).thenReturn(List.of());
        ManagerService service = new ManagerService(mapper);
        for (String field : List.of("gradeName", "positionName")) {
            ManagerDto.ListQuery query = new ManagerDto.ListQuery();
            query.setSortField(field);
            service.getPersonList(query);
            verify(mapper).selectPersonList(org.mockito.ArgumentMatchers.argThat(
                    condition -> condition.getSortField().equals(field)));
        }
    }

    @Test
    void invalidCreateIsRejectedBeforeDatabaseAccess() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        ManagerService service = new ManagerService(mapper);
        assertBadCreate(service, null);
        ManagerRequest request = validCreate();
        request.setEmployeeNo(" ");
        assertBadCreate(service, request);
        request = validCreate();
        request.setNameKo("\t ");
        assertBadCreate(service, request);
        request = validCreate();
        request.setEmployeeNo("x".repeat(31));
        assertBadCreate(service, request);
        request = validCreate();
        request.setNameKo("x".repeat(101));
        assertBadCreate(service, request);
        request = validCreate();
        request.setNameEn("x".repeat(101));
        assertBadCreate(service, request);
        for (String date : List.of("2025-02-29", "2024-02-30", "0000-01-01", "2025-1-01", "")) {
            request = validCreate();
            request.setHireDate(date);
            assertBadCreate(service, request);
            request = validCreate();
            request.setBirthDate(date);
            assertBadCreate(service, request);
        }
        request = validCreate();
        request.setGenderCode("invalid");
        assertBadCreate(service, request);
        verifyNoInteractions(mapper);
    }

    @Test
    void validCreateTrimsRequiredFieldsAndKeepsBoundaryValues() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        ManagerService service = new ManagerService(mapper);
        ManagerRequest request = validCreate();
        request.setEmployeeNo(" " + "x".repeat(30) + " ");
        request.setNameKo(" " + "x".repeat(100) + " ");
        request.setNameEn(" " + "x".repeat(100) + " ");
        request.setBirthDate("2024-02-29");
        request.setHireDate("2025-01-01");
        service.createPerson(request);
        assertThat(request.getEmployeeNo()).hasSize(30);
        assertThat(request.getNameKo()).hasSize(100);
        assertThat(request.getNameEn()).hasSize(100);
        assertThat(request.getServiceStatusCode()).isEqualTo("101-010");
        verify(mapper).insertPerson(eq(request), eq("SYSTEM"));
    }

    @Test
    void duplicateEmployeeNumberIsConflict() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        when(mapper.countByEmployeeNo("TEST")).thenReturn(1);
        assertThatThrownBy(() -> new ManagerService(mapper).createPerson(validCreate()))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value())
                        .isEqualTo(409));
        verify(mapper, org.mockito.Mockito.never()).insertPerson(any(), any());
    }

    private ManagerRequest validCreate() {
        ManagerRequest request = new ManagerRequest();
        request.setEmployeeNo("TEST");
        request.setNameKo("Test");
        return request;
    }

    private void assertBadCreate(ManagerService service, ManagerRequest request) {
        assertThatThrownBy(() -> service.createPerson(request))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value())
                        .isEqualTo(400));
    }
}
