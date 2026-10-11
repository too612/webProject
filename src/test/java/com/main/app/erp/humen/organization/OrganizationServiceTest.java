package com.main.app.erp.humen.organization;

import com.main.app.erp.humen.organization.dto.OrganizationDto;
import com.main.app.erp.humen.organization.dto.OrganizationRequest;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OrganizationServiceTest {

    private OrganizationMapper mapper;
    private OrganizationService service;

    @BeforeEach
    void setUp() {
        mapper = mock(OrganizationMapper.class);
        service = new OrganizationService(mapper);
    }

    @Test
    void createReorgClonesLatestConfirmedSnapshotAtReorgDate() {
        OrganizationRequest.ReorgCreate request = new OrganizationRequest.ReorgCreate();
        request.setReorgDt("2027-01-01");
        request.setReorgTitle("2027 조직개편");
        when(mapper.selectActiveReorgKey("2027-01-01")).thenReturn("source");
        when(mapper.insertReorg(request, "editor")).thenReturn("target");
        when(mapper.selectReorg("target")).thenReturn(reorg("target", "N", "Y"));
        when(mapper.selectDepartmentList("target")).thenReturn(List.of());
        when(mapper.selectDepartmentHistory("target")).thenReturn(List.of());

        service.createReorg(request, "editor");

        verify(mapper).cloneDepartments("source", "target", "editor");
    }

    @Test
    void activeReorgUsesRequestedBaseDate() {
        when(mapper.selectActiveReorgKey("2026-10-10")).thenReturn(null);

        service.getActiveReorg("2026-10-10");

        verify(mapper).selectActiveReorgKey("2026-10-10");
    }

    @Test
    void confirmOnlyConfirmsTargetSnapshot() {
        OrganizationDto.ReorgDetail detail = reorg("draft", "N", "Y");
        detail.setDepartments(List.of(department("root", null, 1)));
        when(mapper.selectReorg("draft")).thenReturn(detail);
        when(mapper.selectDepartmentList("draft")).thenReturn(detail.getDepartments());
        when(mapper.selectDepartmentHistory("draft")).thenReturn(List.of());
        when(mapper.confirmReorg("draft", "editor")).thenReturn(1);

        service.confirmReorg("draft", "editor");

        verify(mapper).confirmReorg("draft", "editor");
    }

    @Test
    void movingDepartmentUpdatesAllDescendantLevels() {
        OrganizationDto.Department root = department("root", null, 1);
        OrganizationDto.Department target = department("target", "root", 2);
        OrganizationDto.Department moving = department("moving", "root", 2);
        OrganizationDto.Department child = department("child", "moving", 3);
        root.setSortOrder(1);
        target.setSortOrder(1);
        moving.setSortOrder(2);
        child.setSortOrder(1);
        stubDraft(List.of(root, target, moving, child));
        when(mapper.updateDepartmentPlacement("draft", "moving", "target", 3, 1, "editor"))
                .thenReturn(1);

        service.changeParent("draft", "moving", "target", "editor");

        verify(mapper).updateDescendantLevels("draft", "moving", 1, "editor");
        verify(mapper).insertDepartmentHistory(
                "draft", "moving", "moving", "D-moving", 2, "D-moving", 3,
                "MOVE", "상위 부서와 표시 순서를 변경했습니다.", "editor");
    }

    @Test
    void movingDepartmentWithinSameParentReordersSiblings() {
        OrganizationDto.Department root = department("root", null, 1);
        OrganizationDto.Department first = department("first", "root", 2);
        OrganizationDto.Department moving = department("moving", "root", 2);
        OrganizationDto.Department last = department("last", "root", 2);
        root.setSortOrder(1);
        first.setSortOrder(1);
        moving.setSortOrder(2);
        last.setSortOrder(3);
        stubDraft(List.of(root, first, moving, last));
        when(mapper.updateDepartmentPlacement("draft", "moving", "root", 2, 1, "editor"))
                .thenReturn(1);
        when(mapper.updateDepartmentSortOrder("draft", "first", 2, "editor")).thenReturn(1);

        OrganizationRequest.DepartmentPlacement request = new OrganizationRequest.DepartmentPlacement();
        request.setParentDeptKey("root");
        request.setTargetIndex(0);
        service.moveDepartment("draft", "moving", request, "editor");

        verify(mapper).updateDepartmentPlacement("draft", "moving", "root", 2, 1, "editor");
        verify(mapper).updateDepartmentSortOrder("draft", "first", 2, "editor");
        verify(mapper).insertDepartmentHistory(
                "draft", "moving", "moving", "D-moving", 2, "D-moving", 2,
                "MOVE", "동일 레벨 내 순서를 변경했습니다. (2 → 1)", "editor");
    }

    @Test
    void movingDepartmentToRootUsesRequestedSiblingIndex() {
        OrganizationDto.Department root = department("root", null, 1);
        OrganizationDto.Department moving = department("moving", "root", 2);
        root.setSortOrder(1);
        moving.setSortOrder(1);
        stubDraft(List.of(root, moving));
        when(mapper.updateDepartmentPlacement("draft", "moving", null, 1, 1, "editor"))
                .thenReturn(1);
        when(mapper.updateDepartmentSortOrder("draft", "root", 2, "editor")).thenReturn(1);

        OrganizationRequest.DepartmentPlacement request = new OrganizationRequest.DepartmentPlacement();
        request.setParentDeptKey(null);
        request.setTargetIndex(0);
        service.moveDepartment("draft", "moving", request, "editor");

        verify(mapper).updateDepartmentPlacement("draft", "moving", null, 1, 1, "editor");
        verify(mapper).updateDepartmentSortOrder("draft", "root", 2, "editor");
        verify(mapper).updateDescendantLevels("draft", "moving", -1, "editor");
    }

    @Test
    void movingDepartmentBelowItsDescendantIsRejected() {
        OrganizationDto.Department root = department("root", null, 1);
        OrganizationDto.Department moving = department("moving", "root", 2);
        OrganizationDto.Department child = department("child", "moving", 3);
        stubDraft(List.of(root, moving, child));

        assertThatThrownBy(() -> service.changeParent("draft", "moving", "child", "editor"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("하위 부서");

        verify(mapper, never()).updateDepartmentPlacement(
                anyString(), anyString(), any(), anyInt(), anyInt(), anyString());
    }

    private void stubDraft(List<OrganizationDto.Department> departments) {
        OrganizationDto.ReorgDetail detail = reorg("draft", "N", "Y");
        detail.setDepartments(new ArrayList<>(departments));
        when(mapper.selectReorg("draft")).thenReturn(detail);
        when(mapper.selectDepartmentList("draft")).thenReturn(detail.getDepartments());
        when(mapper.selectDepartmentHistory("draft")).thenReturn(List.of());
    }

    private OrganizationDto.ReorgDetail reorg(String key, String confYn, String useYn) {
        OrganizationDto.ReorgDetail detail = new OrganizationDto.ReorgDetail();
        detail.setReorgKey(key);
        detail.setConfYn(confYn);
        detail.setUseYn(useYn);
        detail.setDepartments(new ArrayList<>());
        detail.setHistories(new ArrayList<>());
        return detail;
    }

    private OrganizationDto.Department department(String key, String parentKey, int level) {
        OrganizationDto.Department department = new OrganizationDto.Department();
        department.setDeptKey(key);
        department.setDeptCd("D-" + key);
        department.setParentDeptKey(parentKey);
        department.setDeptLevel(level);
        return department;
    }
}
