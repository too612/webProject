import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import type { GridApi } from "ag-grid-community";
import { usePersonnelMovePage } from "./personnelmoveHook";
import {
  assignmentKey, MOBILE_HIDDEN_COLUMNS, PERSONNELMOVE_COLUMNS,
  type AssignmentCodeOption, type AssignmentScope, type EmployeeOption, type PersonnelMoveForm, type PersonnelMoveRow,
} from "./personnelmoveModel";
import { isHistorical } from "./personnelmoveValidation";
import { ErpDataGrid, useGridDetail, type GridColumnDef } from "../../../common/grid";
import {
  ActionButton, AsyncFeedback, Button, CodeSelect, ConfirmModal, DetailPanelLayout,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  FormField, Input, ListPageActions, ListPageShell, ResultPanel, SearchField, SearchPanel,
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "../../../common/ui";
import { useWorkspaceDirty, useWorkspaceTab, WorkspaceTabContext } from "../../../common/workspace/workspaceHook";
import { useExcelExport, type ExcelGridSource } from "../../../common/excel";
import { DepartmentField, EmployeeField } from "../../../common/popup";

const codeOptions = (items: AssignmentCodeOption[]) => items.map(({ code, codeName }) => ({ code, name: codeName }));
const labelFor = (items: AssignmentCodeOption[], code: string | null) =>
  items.find((item) => item.code === code)?.codeName ?? code ?? "-";
type TextFormKey = Exclude<keyof PersonnelMoveForm, "historicalEdit">;

function AssignmentTab({ scope, active, onDirty }: Readonly<{
  scope: AssignmentScope; active: boolean; onDirty: (dirty: boolean) => void;
}>) {
  const workspace = useWorkspaceTab();
  const visible = active && (workspace?.active ?? true);
  const id = useId();
  const searchFormId = `${id}-search`;
  const editFormId = `${id}-edit`;
  const excelGridId = `${id}-assignment-grid`;
  const excel = useExcelExport();
  const grid = useRef<GridApi<PersonnelMoveRow> | null>(null);
  const state = usePersonnelMovePage(scope);
  const [searchEmployee, setSearchEmployee] = useState<EmployeeOption | null>(null);
  useEffect(() => { onDirty(state.dirty); }, [onDirty, state.dirty]);
  const name = scope === "main" ? "인사발령" : "겸임발령";
  const {
    search, loadRows, selectedRow, detail, detailOpen, detailLoading, selectRow, closeDetail,
    options, optionsLoading, optionsError, form, editing, errors, saving,
  } = state;
  const disabledOptions = optionsLoading || Boolean(optionsError);
  const detailGrid = useGridDetail({
    selected: selectedRow, open: detailOpen, getKey: assignmentKey,
    onSelect: selectRow, onClose: closeDetail, queryKey: loadRows,
  });
  const columns = useMemo<GridColumnDef<PersonnelMoveRow>[]>(() => [
    ...PERSONNELMOVE_COLUMNS.map((column): GridColumnDef<PersonnelMoveRow> => {
      const items = column.field === "gradeCode" ? options.grades
        : column.field === "positionCode" ? options.positions
        : column.field === "employmentTypeCode" ? options.employmentTypes
        : column.field === "jobTitleCode" ? options.jobTitles
        : column.field === "assignmentTypeCode" ? options.assignmentTypes : null;
      return items ? { ...column, valueFormatter: ({ value }) => labelFor(items, typeof value === "string" ? value : null) } : column;
    }),
    {
      colId: "detail", headerName: "상세", width: 90, sortable: false, filter: false,
      cellRenderer: ({ data, column }: { data?: PersonnelMoveRow; column?: { getColId(): string } }) =>
        <button type="button" className="text-sm text-primary hover:underline"
          onClick={(event) => { event.stopPropagation(); if (data) detailGrid.openRow(data, column?.getColId()); }}>
          상세보기
        </button>,
    },
  ], [options, detailGrid.openRow]);
  const applySearch = useCallback((event: FormEvent) => {
    grid.current?.applyColumnState({ defaultState: { sort: null } });
    state.applySearch(event);
  }, [state.applySearch]);
  const excelSource = useMemo<ExcelGridSource<PersonnelMoveRow>>(() => ({
    scope: excel.scope, id: excelGridId, sheetName: name,
    getRowRef: (row) => row.excelRef, getEmptyToken: () => state.excelState.current.token,
  }), [excel.scope, excelGridId, name, state.excelState]);
  const masterOptions = (state.masters.data ?? []).map((master) => ({
    code: master.concurrentKey, name: `${master.nameKo} · ${master.employeeNo}`,
  }));
  const inputField = (key: TextFormKey, label: string, type = "text", required = false) => (
    <FormField key={key} label={label} required={required} error={errors[key]}>
      {(props) => <Input {...props} type={type}
        disabled={saving || (isHistorical(editing) && !editing?.currentEffective &&
          (key === "assignmentDate" || key === "assignmentOrder"))}
        value={form[key]}
        onChange={(event) => state.updateForm(key, event.target.value)} />}
    </FormField>
  );
  const selectField = (key: "gradeCode" | "positionCode" | "employmentTypeCode" | "jobTitleCode" | "assignmentTypeCode",
    label: string, items: AssignmentCodeOption[], required = false) => (
    <FormField key={key} label={label} required={required} error={errors[key]}>
      {(props) => <CodeSelect {...props} value={form[key]} disabled={saving || disabledOptions}
        options={codeOptions(items)} placeholder={label} allLabel="선택"
        onChange={(value) => state.updateForm(key, value)} />}
    </FormField>
  );
  return (
    <div data-assignment-scope={scope}>
      <ListPageShell actions={
        <ListPageActions searchFormId={searchFormId} searching={state.gridState.phase === "initialLoading"}
          onCreate={state.openCreate} createDisabled={saving || state.masterSaving}>
          {scope === "concurrent" && <Button type="button" variant="outline" disabled={!state.employee || state.masterSaving || saving}
            onClick={() => void state.createMaster()}>{state.masterSaving ? "생성 중..." : "겸임 인사 생성"}</Button>}
          <ActionButton action="excel" type="button" loading={excel.exporting}
            disabled={state.gridState.phase === "initialLoading"}
            title="현재 캐시에 남아 있는 행과 표시 열만 다운로드합니다."
            onClick={() => void excel.exportExcel(`#${excelGridId}`, name)} />
        </ListPageActions>
      }>
        <DetailPanelLayout open={detailOpen && visible} onOpenChange={(open) => { if (!open) closeDetail(); }}
          onRestoreFocus={detailGrid.restoreFocus}
          navigation={{ ...detailGrid.navigation, disabled: detailLoading || saving }}
          title={selectedRow ? `${selectedRow.nameKo} ${name}` : name}
          description={selectedRow ? `${selectedRow.employeeNo} · ${selectedRow.assignmentDate}` : "발령 상세"}
          detail={
            <div className="space-y-4">
              <AsyncFeedback loading={detailLoading} error={state.detailError}
                onRetry={() => { if (selectedRow) void selectRow(selectedRow); }} />
              {detail && !detailLoading && <>
                <FormField label="성명">
                  {(props) => <EmployeeField {...props} value={detail.personKey} employee={detail}
                    active={visible}
                    onChange={(employee) => {
                      if (!employee) return;
                      grid.current?.applyColumnState({ defaultState: { sort: null } });
                      return state.requestTarget(employee, null);
                    }} />}
                </FormField>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["발령일", detail.assignmentDate], ["발령 순서", String(detail.assignmentOrder)],
                    ["부서 코드", detail.deptCd], ["직급", labelFor(options.grades, detail.gradeCode)],
                    ["직위", labelFor(options.positions, detail.positionCode)],
                    ["고용형태", labelFor(options.employmentTypes, detail.employmentTypeCode)],
                    ["직책", labelFor(options.jobTitles, detail.jobTitleCode)],
                    ["발령 종류", labelFor(options.assignmentTypes, detail.assignmentTypeCode)],
                    ["종료일", detail.assignmentEndDate], ["발령 내용", detail.assignmentContent],
                    ["비고", detail.remark],
                  ].map(([label, value]) => <div key={label} className="border-b py-2">
                    <dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words">{value || "-"}</dd>
                  </div>)}
                </dl>
                <p role="status" className="rounded-md bg-muted p-3 text-sm">
                  {detail.syncPaused ? "동기화가 중지되어 저장된 발령은 재개 후 반영됩니다." :
                    detail.currentEffective ? "현재 유효 발령입니다. 수정·삭제하면 인사 마스터가 즉시 재계산됩니다." :
                    "과거 이력은 현재 유효 발령이 아니면 마스터를 덮어쓰지 않습니다. 미래 발령은 적용일에 반영됩니다."}
                </p>
                {isHistorical(detail) && <div className="space-y-3">
                  <FormField label="과거 이력 삭제 허용" required>
                    {(props) => <input {...props} type="checkbox" checked={state.historicalDelete} disabled={saving}
                      onChange={(event) => state.setHistoricalDelete(event.target.checked)} />}
                  </FormField>
                  <FormField label="과거 이력 편집 사유" required>
                    {(props) => <Input {...props} value={state.deleteReason} disabled={saving}
                      maxLength={4000} onChange={(event) => state.setDeleteReason(event.target.value)} />}
                  </FormField>
                </div>}
                {state.saveError && <p role="alert" className="text-sm text-red-600">{state.saveError}</p>}
                <div className="flex gap-2">
                  <Button disabled={saving} onClick={state.openEdit}>수정</Button>
                  <Button variant="destructive" disabled={saving} onClick={state.requestDelete}>삭제</Button>
                </div>
              </>}
            </div>
          }>
          <div className="min-w-0 space-y-4">
            <SearchPanel formId={searchFormId} onSearch={applySearch} pending={search.pending}>
              <SearchField label="성명" width="range">
                {(fieldId) => <EmployeeField id={fieldId}
                  value={search.draft.personKey} employee={searchEmployee}
                  nameValue={search.draft.keyword} active={visible}
                  onNameChange={(value) => state.updateSearch("keyword", value)}
                  onChange={(employee) => {
                    setSearchEmployee(employee);
                    state.updateSearch("personKey", employee?.personKey ?? "");
                  }} />}
              </SearchField>
              <SearchField label="부서명" width="range">
                {(fieldId) => <DepartmentField id={fieldId} value={search.draft.deptCd} active={visible}
                  onChange={(code) => state.updateSearch("deptCd", code)} />}
              </SearchField>
              <SearchField label="직급" width="compact">
                {(fieldId) => <CodeSelect id={fieldId} value={search.draft.gradeCode} disabled={disabledOptions}
                  options={codeOptions(options.grades)} placeholder="직급"
                  onChange={(value) => state.updateSearch("gradeCode", value)} />}
              </SearchField>
              <SearchField label="발령 종류" width="compact">
                {(fieldId) => <CodeSelect id={fieldId} value={search.draft.assignmentTypeCode} disabled={disabledOptions}
                  options={codeOptions(options.assignmentTypes)} placeholder="발령 종류"
                  onChange={(value) => state.updateSearch("assignmentTypeCode", value)} />}
              </SearchField>
              <SearchField label="발령일 시작" width="compact">
                {(fieldId) => <div><Input id={fieldId} type="date" value={search.draft.assignmentDateFrom}
                  aria-invalid={Boolean(state.searchErrors.assignmentDateFrom)}
                  aria-describedby={state.searchErrors.assignmentDateFrom ? `${fieldId}-error` : undefined}
                  onChange={(event) => state.updateSearch("assignmentDateFrom", event.target.value)} />
                  {state.searchErrors.assignmentDateFrom && <p id={`${fieldId}-error`} role="alert" className="text-xs text-red-600">
                    {state.searchErrors.assignmentDateFrom}</p>}
                </div>}
              </SearchField>
              <SearchField label="발령일 종료" width="compact">
                {(fieldId) => <div><Input id={fieldId} type="date" value={search.draft.assignmentDateTo}
                  aria-invalid={Boolean(state.searchErrors.assignmentDateTo)}
                  aria-describedby={state.searchErrors.assignmentDateTo ? `${fieldId}-error` : undefined}
                  onChange={(event) => state.updateSearch("assignmentDateTo", event.target.value)} />
                  {state.searchErrors.assignmentDateTo && <p id={`${fieldId}-error`} role="alert" className="text-xs text-red-600">
                    {state.searchErrors.assignmentDateTo}</p>}
                </div>}
              </SearchField>
            </SearchPanel>
            <AsyncFeedback loading={optionsLoading} error={optionsError} onRetry={state.retryOptions} />
            {scope === "concurrent" && <section aria-label="겸임 인사 대상" className="rounded-md border p-3 space-y-3">
                {!detailOpen && <FormField label="성명">
                  {(props) => <EmployeeField {...props}
                    value={state.employee?.personKey ?? search.applied.personKey}
                    employee={state.employee} active={visible} disabled={saving || state.masterSaving}
                    onChange={(employee) => {
                      grid.current?.applyColumnState({ defaultState: { sort: null } });
                      return state.requestTarget(employee, null);
                    }} />}
                </FormField>}
                <AsyncFeedback loading={state.masters.loading} error={state.masters.error} onRetry={state.masters.retry} />
                <FormField label="겸임 인사">
                  {(props) => <CodeSelect {...props} value={state.master?.concurrentKey ?? search.applied.concurrentKey}
                    options={masterOptions} placeholder="겸임 인사" allLabel="전체" disabled={!state.employee || state.masters.loading || Boolean(state.masters.error) || saving || state.masterSaving}
                    onChange={(value) => {
                      grid.current?.applyColumnState({ defaultState: { sort: null } });
                      state.requestTarget(state.employee, state.masters.data?.find((item) => item.concurrentKey === value) ?? null);
                    }} />}
                </FormField>
                <p className="text-xs text-muted-foreground">겸임 인사 생성은 발령 등록과 별개입니다. 사번은 기준 사번_1, _2 순으로 서버에서 생성됩니다.</p>
                {state.masterError && <p role="alert" className="text-sm text-red-600">{state.masterError}</p>}
            </section>}
            {state.message && <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-800">{state.message}</p>}
            <ResultPanel totalCount={state.gridState.totalCount}>
              <ErpDataGrid<PersonnelMoveRow> columns={columns} excel={excelSource}
                onLoadData={loadRows} onGridReady={({ api }) => { grid.current = api; }}
                onDataStateChanged={state.setGridState} getRowId={assignmentKey}
                mobileHiddenColumns={MOBILE_HIDDEN_COLUMNS} gridOptions={detailGrid.gridOptions}
                emptyMessage="조회된 발령이 없습니다." />
            </ResultPanel>
          </div>
        </DetailPanelLayout>
        <Dialog open={state.formOpen && visible} onOpenChange={(open) => { if (!open) state.closeForm(); }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
            onEscapeKeyDown={(event) => { if (saving) event.preventDefault(); }}
            onPointerDownOutside={(event) => { if (saving) event.preventDefault(); }}>
            <DialogHeader>
              <DialogTitle>{name} {editing ? "수정" : "등록"}</DialogTitle>
              <DialogDescription>같은 발령일에도 순서를 달리하여 여러 발령을 등록할 수 있습니다. 부서명 검색 또는 부서 조회로 부서를 선택하세요.</DialogDescription>
            </DialogHeader>
            <form id={editFormId} onSubmit={(event) => void state.save(event)} noValidate className="space-y-4">
              <AsyncFeedback loading={optionsLoading} error={optionsError} onRetry={state.retryOptions} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="성명" required error={errors.personKey}>
                  {(props) => <EmployeeField {...props} value={form.personKey} employee={state.formEmployee}
                    active={visible && state.formOpen} disabled={saving || Boolean(editing) || scope === "concurrent"}
                    onChange={state.selectFormEmployee} />}
                </FormField>
                {scope === "concurrent" && <FormField label="겸임 인사" required error={errors.concurrentKey}>
                  {(props) => <CodeSelect {...props} value={form.concurrentKey} options={masterOptions}
                    placeholder="겸임 인사" allLabel="선택" disabled={saving || Boolean(editing) || !state.employee || state.masters.loading || Boolean(state.masters.error)}
                    onChange={(value) => state.updateForm("concurrentKey", value)} />}
                </FormField>}
                {inputField("assignmentDate", "발령일", "date", true)}
                {inputField("assignmentOrder", "발령 순서", "number", true)}
                <FormField label="부서명" required error={errors.deptCd}>
                  {(props) => <DepartmentField {...props} value={form.deptCd} disabled={saving}
                    active={visible && state.formOpen} onChange={(code) => state.updateForm("deptCd", code)} />}
                </FormField>
                {selectField("gradeCode", "직급", options.grades, true)}
                {selectField("positionCode", "직위", options.positions)}
                {selectField("employmentTypeCode", "고용형태", options.employmentTypes)}
                {selectField("jobTitleCode", "직책", options.jobTitles)}
                {selectField("assignmentTypeCode", "발령 종류", options.assignmentTypes, true)}
                {inputField("assignmentEndDate", "종료일", "date")}
                {inputField("dispatchCountryCode", "파견 국가 코드")}
                {inputField("assignmentContent", "발령 내용")}
                {inputField("remark", "비고")}
              </div>
              {isHistorical(editing) && <>
                {!editing?.currentEffective && <p className="text-sm text-muted-foreground">
                  과거 비유효 이력의 대상·발령일·순서는 변경할 수 없습니다. 날짜나 순서 변경이 필요하면 새 발령을 등록하세요.
                </p>}
                <FormField label="과거 이력 편집 허용" required error={errors.historicalEdit}>
                  {(props) => <input {...props} type="checkbox" checked={form.historicalEdit} disabled={saving}
                    onChange={(event) => state.updateForm("historicalEdit", event.target.checked)} />}
                </FormField>
                {inputField("historicalReason", "과거 이력 편집 사유", "text", true)}
              </>}
              <p role="status" className="rounded-md bg-muted p-3 text-sm">
                {editing?.syncPaused ? "동기화 중지 중입니다. 저장은 가능하며 인사 마스터 반영은 재개 후 처리됩니다." :
                  "현재 유효 발령은 즉시 반영됩니다. 미래 발령은 적용일에 반영되며, 과거 이력 편집은 별도 허용과 사유가 필요합니다."}
              </p>
              {state.saveError && <p role="alert" className="text-sm text-red-600">{state.saveError}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" disabled={saving} onClick={state.closeForm}>취소</Button>
                <Button type="submit" disabled={saving || disabledOptions}>{saving ? "저장 중..." : "저장"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <ConfirmModal isOpen={state.discardConfirm && visible} title="입력 취소"
          message="저장하지 않은 입력을 버리시겠습니까?" onConfirm={state.discardForm}
          onCancel={() => state.setDiscardConfirm(false)} />
        <ConfirmModal isOpen={state.switchConfirm && visible} title="대상 인사 변경"
          message="저장하지 않은 발령 입력을 버리고 대상 인사를 변경하시겠습니까?"
          onConfirm={state.confirmSwitch} onCancel={() => state.setSwitchConfirm(false)} />
        <ConfirmModal isOpen={state.deleteConfirm && visible} title="발령 삭제"
          message="이 발령을 소프트 삭제하고 현재 유효 발령을 다시 계산하시겠습니까?"
          onConfirm={() => void state.remove()} onCancel={() => state.setDeleteConfirm(false)} />
      </ListPageShell>
    </div>
  );
}

export default function PersonnelMovePage() {
  const workspace = useWorkspaceTab();
  const [tab, setTab] = useState<AssignmentScope>("main");
  const [mainDirty, setMainDirty] = useState(false);
  const [concurrentDirty, setConcurrentDirty] = useState(false);
  useWorkspaceDirty(mainDirty || concurrentDirty);
  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(value) => { if (value === "main" || value === "concurrent") setTab(value); }}>
        <TabsList><TabsTrigger value="main">인사발령</TabsTrigger><TabsTrigger value="concurrent">겸임발령</TabsTrigger></TabsList>
        <TabsContent value="main" forceMount className={tab !== "main" ? "hidden" : ""}>
          <WorkspaceTabContext.Provider value={workspace ? { ...workspace, active: workspace.active && tab === "main" } : null}>
            <AssignmentTab scope="main" active={tab === "main"} onDirty={setMainDirty} />
          </WorkspaceTabContext.Provider>
        </TabsContent>
        <TabsContent value="concurrent" forceMount className={tab !== "concurrent" ? "hidden" : ""}>
          <WorkspaceTabContext.Provider value={workspace ? { ...workspace, active: workspace.active && tab === "concurrent" } : null}>
            <AssignmentTab scope="concurrent" active={tab === "concurrent"} onDirty={setConcurrentDirty} />
          </WorkspaceTabContext.Provider>
        </TabsContent>
      </Tabs>
    </div>
  );
}
