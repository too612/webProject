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

        new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class)).getPersonList(query);

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
        ManagerService service = new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class));
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
        new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class)).getPersonList(query);

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
        ManagerService service = new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class));
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
        ManagerService service = new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class));
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
        ManagerService service = new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class));
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
        assertThatThrownBy(() -> new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class)).createPerson(validCreate()))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value())
                        .isEqualTo(409));
        verify(mapper, org.mockito.Mockito.never()).insertPerson(any(), any());
    }

    @Test
    void basicInfoUpdateNormalizesAllowedFieldsAndRecordsAudit() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        when(mapper.selectEmployeeNoForUpdate("pk")).thenReturn("000001");
        when(mapper.updateBasicInfo(any(), any(), any())).thenReturn(1);
        ManagerDto.PersonDetail detail = new ManagerDto.PersonDetail();
        detail.setPersonKey("pk");
        when(mapper.selectPersonDetail("000001")).thenReturn(detail);
        ManagerDto.BasicInfoUpdate request = new ManagerDto.BasicInfoUpdate();
        request.setNameKo("  홍길동 ");
        request.setNameEn(" ");
        request.setBirthDate("1990-01-01");
        request.setGenderCode("M");
        request.setAddressLine1(" 서울 ");
        ManagerDto.Audit audit = new ManagerDto.Audit("admin", "127.0.0.1");

        var result = new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class))
                .setUpdate("pk", request, audit);

        assertThat(result).isSameAs(detail);
        assertThat(request.getNameKo()).isEqualTo("홍길동");
        assertThat(request.getNameEn()).isNull();
        assertThat(request.getAddressLine1()).isEqualTo("서울");
        verify(mapper).updateBasicInfo("pk", request, audit);
    }

    @Test
    void basicInfoUpdateRejectsInvalidValuesBeforeWriting() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        ManagerService service = new ManagerService(mapper, mock(ManagerProfilePhotoStorage.class));
        ManagerDto.Audit audit = new ManagerDto.Audit("admin", "127.0.0.1");
        for (var mutate : List.<java.util.function.Consumer<ManagerDto.BasicInfoUpdate>>of(
                r -> r.setNameKo(" "),
                r -> r.setNameKo("x".repeat(101)),
                r -> r.setBirthDate("2024-02-30"),
                r -> r.setBirthDate(java.time.LocalDate.now().plusDays(1).toString()),
                r -> r.setGenderCode("X"),
                r -> r.setPostalCode("12345678901"))) {
            ManagerDto.BasicInfoUpdate request = new ManagerDto.BasicInfoUpdate();
            request.setNameKo("홍길동");
            mutate.accept(request);
            assertThatThrownBy(() -> service.setUpdate("pk", request, audit))
                    .isInstanceOf(ResponseStatusException.class)
                    .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value())
                            .isEqualTo(400));
        }
        verifyNoInteractions(mapper);
    }

    @Test
    void missingPersonIsNotFoundAndNoPhotoIsStored() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        ManagerProfilePhotoStorage storage = mock(ManagerProfilePhotoStorage.class);
        ManagerService service = new ManagerService(mapper, storage);
        ManagerDto.Audit audit = new ManagerDto.Audit("admin", "127.0.0.1");
        ManagerDto.BasicInfoUpdate request = new ManagerDto.BasicInfoUpdate();
        request.setNameKo("홍길동");
        for (Runnable call : List.<Runnable>of(
                () -> service.setUpdate("missing", request, audit),
                () -> service.setUpdateProfilePhoto("missing", null, audit),
                () -> service.delRemoveProfilePhoto("missing", audit))) {
            assertThatThrownBy(call::run)
                    .isInstanceOf(ResponseStatusException.class)
                    .satisfies(error -> assertThat(((ResponseStatusException) error).getStatusCode().value())
                            .isEqualTo(404));
        }
        verifyNoInteractions(storage);
        verify(mapper, org.mockito.Mockito.never()).updateBasicInfo(any(), any(), any());
        verify(mapper, org.mockito.Mockito.never()).updateProfilePhoto(any(), any(), any());
    }

    @Test
    void profilePhotoApplyStoresFileThenUpdatesUrl() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        ManagerProfilePhotoStorage storage = mock(ManagerProfilePhotoStorage.class);
        when(mapper.selectEmployeeNoForUpdate("pk")).thenReturn("000001");
        when(storage.store(any())).thenReturn("/data/profile/new.png");
        when(mapper.updateProfilePhoto(any(), any(), any())).thenReturn(1);
        ManagerDto.Audit audit = new ManagerDto.Audit("admin", "127.0.0.1");

        var result = new ManagerService(mapper, storage).setUpdateProfilePhoto("pk", null, audit);

        assertThat(result.getProfilePhotoUrl()).isEqualTo("/data/profile/new.png");
        verify(mapper).updateProfilePhoto("pk", "/data/profile/new.png", audit);
        verify(storage, org.mockito.Mockito.never()).deleteQuietly(any());
    }

    @Test
    void profilePhotoDatabaseFailureRemovesOnlyNewFile() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        ManagerProfilePhotoStorage storage = mock(ManagerProfilePhotoStorage.class);
        when(mapper.selectEmployeeNoForUpdate("pk")).thenReturn("000001");
        when(storage.store(any())).thenReturn("/data/profile/new.png");
        when(mapper.updateProfilePhoto(any(), any(), any())).thenThrow(new IllegalStateException("db"));

        assertThatThrownBy(() -> new ManagerService(mapper, storage)
                .setUpdateProfilePhoto("pk", null, new ManagerDto.Audit("admin", "127.0.0.1")))
                .isInstanceOf(IllegalStateException.class);
        verify(storage).deleteQuietly("/data/profile/new.png");
    }

    @Test
    void profilePhotoRemoveOnlyClearsReference() {
        ManagerMapper mapper = mock(ManagerMapper.class);
        ManagerProfilePhotoStorage storage = mock(ManagerProfilePhotoStorage.class);
        when(mapper.selectEmployeeNoForUpdate("pk")).thenReturn("000001");
        when(mapper.updateProfilePhoto(any(), any(), any())).thenReturn(1);
        ManagerDto.Audit audit = new ManagerDto.Audit("admin", "127.0.0.1");

        var result = new ManagerService(mapper, storage).delRemoveProfilePhoto("pk", audit);

        assertThat(result.getProfilePhotoUrl()).isNull();
        verify(mapper).updateProfilePhoto("pk", null, audit);
        verifyNoInteractions(storage);
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
