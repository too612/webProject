package com.main.app.common.popup.department;

import com.main.app.common.popup.department.dto.DepartmentPopupDto;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class DepartmentPopupServiceTest {
    private DepartmentPopupMapper mapper;
    private DepartmentPopupService service;

    @BeforeEach
    void setUp() {
        mapper = mock(DepartmentPopupMapper.class);
        service = new DepartmentPopupService(mapper);
    }

    @Test
    void defaultsToLatestIncludingFutureDraftAndCountsOnlyMatches() {
        var latest = reorganization("latest", "2027-01-01", "N");
        when(mapper.selectReorganizations()).thenReturn(List.of(latest, reorganization("old", "2026-01-01", "Y")));
        var parent = department("parent", false);
        var child = department("child", true);
        when(mapper.selectDepartments("latest", "", "팀", false)).thenReturn(List.of(parent, child));

        var result = service.getInfo(null, " ", " 팀 ", false);

        assertThat(result.reorganization()).isSameAs(latest);
        assertThat(result.departments()).containsExactly(parent, child);
        assertThat(result.matchCount()).isEqualTo(1);
        verify(mapper).selectDepartments("latest", "", "팀", false);
    }

    @Test
    void explicitSnapshotAndExactCodeAreForwarded() {
        var old = reorganization("old", "2026-01-01", "Y");
        when(mapper.selectReorganization("old")).thenReturn(old);
        when(mapper.selectDepartments("old", "D1", "", true)).thenReturn(List.of());
        assertThat(service.getInfo(" old ", " D1 ", null, true).reorganization()).isSameAs(old);
        verify(mapper, never()).selectReorganizations();
        verify(mapper).selectDepartments("old", "D1", "", true);
    }

    @Test
    void emptyReorganizationsHaveExplicitEmptyResult() {
        when(mapper.selectReorganizations()).thenReturn(List.of());
        var result = service.getInfo(null, null, null, false);
        assertThat(result.reorganization()).isNull();
        assertThat(result.departments()).isEmpty();
        assertThat(result.matchCount()).isZero();
    }

    @Test
    void unknownSnapshotAndOverlongConditionsAreErrors() {
        assertThatThrownBy(() -> service.getInfo("missing", "", "", false))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("404");
        assertThatThrownBy(() -> service.getInfo(null, "D".repeat(31), "", false))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400");
        assertThatThrownBy(() -> service.getInfo(null, "", "x".repeat(201), false))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400");
    }

    private DepartmentPopupDto.Reorganization reorganization(String key, String date, String confirmed) {
        var item = new DepartmentPopupDto.Reorganization();
        item.setReorgKey(key); item.setReorgDt(LocalDate.parse(date)); item.setConfYn(confirmed);
        return item;
    }

    private DepartmentPopupDto.Department department(String key, boolean matched) {
        var item = new DepartmentPopupDto.Department();
        item.setDeptKey(key); item.setMatched(matched);
        return item;
    }
}
