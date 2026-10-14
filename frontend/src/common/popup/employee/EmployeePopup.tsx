import { useCallback, useId, useRef, useState, type FormEvent } from "react";
import type { GridApi } from "ag-grid-community";
import { blockToPage, ErpDataGrid, type GridDataState, type GridLoadParams } from "../../grid";
import { INITIAL_GRID_STATE } from "../../grid/infiniteDatasource";
import {
  ActionButton, AsyncFeedback, Button, CodeSelect, Dialog, DialogContent,
  DialogDescription, DialogHeader, DialogTitle, Input, ResultPanel, SearchField,
  SearchPanel, useAsyncResource, useSearchQuery,
} from "../../ui";
import TreeTable from "../../ui/tree/TreeTable";
import type { TreeColumn } from "../../ui/tree/tree.types";
import { useWorkspaceTab } from "../../workspace/workspaceHook";
import { employeePopupApi } from "./employeePopupApi";
import {
  EMPLOYEE_COLUMNS, EMPLOYEE_MOBILE_HIDDEN_COLUMNS, EMPTY_EMPLOYEE_SEARCH,
  employeeKey, equalEmployeeSearch, normalizeEmployeeSearch,
  type EmployeeDepartment, type EmployeePopupSearch, type EmployeeSelection, type PopupEmployee,
} from "./employeePopupModel";

const treeColumns: TreeColumn<EmployeeDepartment>[] = [
  { type: "tree", key: "department", header: "조직도", cellClassName: "text-left" },
];
export type EmployeePopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (employee: EmployeeSelection) => void;
  initialNameKo?: string;
  initialServiceStatusCode?: string;
};

export default function EmployeePopup(props: EmployeePopupProps) {
  return props.open ? <EmployeePopupContent {...props} /> : null;
}

function EmployeePopupContent({
  onOpenChange, onSelect, initialNameKo = "", initialServiceStatusCode = "",
}: EmployeePopupProps) {
  const workspace = useWorkspaceTab();
  const visible = workspace?.active ?? true;
  const formId = useId();
  const context = useAsyncResource(employeePopupApi.getContext, "직원 조회 기준정보를 불러오지 못했습니다.");
  const search = useSearchQuery({
    ...EMPTY_EMPLOYEE_SEARCH, nameKo: initialNameKo, serviceStatusCode: initialServiceStatusCode,
  }, equalEmployeeSearch);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [gridState, setGridState] = useState<GridDataState>(INITIAL_GRID_STATE);
  const grid = useRef<GridApi<PopupEmployee> | null>(null);
  const selecting = useRef(false);
  const apply = (query: EmployeePopupSearch) => {
    grid.current?.applyColumnState({ defaultState: { sort: null } });
    search.apply(normalizeEmployeeSearch(query));
  };
  const submit = (event: FormEvent) => { event.preventDefault(); apply(search.draft); };
  const loadRows = useCallback(async ({ startRow, endRow, sortModel, signal }: GridLoadParams) => {
    if (!context.data) throw new Error("직원 조회 기준정보가 없습니다.");
    const sort = sortModel?.[0];
    const data = await employeePopupApi.getInfo({
      ...search.applied, ...blockToPage(startRow, endRow),
      reorgKey: context.data.reorganization.reorgKey,
      ...(sort?.sort ? { sortField: sort.colId, sortDirection: sort.sort } : {}),
    }, signal);
    return { rows: data.content, totalCount: data.totalElements };
  }, [context.data, search.applied, search.revision]);
  const choose = (employee?: PopupEmployee) => {
    if (!employee || !visible || selecting.current || gridState.phase === "initialLoading" || gridState.phase === "error") return;
    selecting.current = true;
    onSelect(employee);
    onOpenChange(false);
  };
  const textField = (key: "nameKo" | "employeeNo" | "deptName", label: string, maxLength: number) => (
    <SearchField label={label} width="keyword">
      {(id) => <Input id={id} value={search.draft[key]} maxLength={maxLength}
        onChange={(event) => search.setDraft((current) => ({ ...current, [key]: event.target.value }))} />}
    </SearchField>
  );
  const selectField = (key: "gradeCode" | "positionCode" | "serviceStatusCode", label: string,
    options: { code: string; name: string }[]) => (
    <SearchField label={label} width="compact">
      {(id) => <CodeSelect id={id} value={search.draft[key]} options={options}
        placeholder={label} allLabel="선택" disabled={context.loading || Boolean(context.error)}
        onChange={(value) => {
          const next = { ...search.draft, [key]: value };
          search.setDraft(next); apply(next);
        }} />}
    </SearchField>
  );
  return (
    <Dialog open={visible} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[90vw] xl:max-w-7xl">
        <DialogHeader>
          <DialogTitle>직원 조회</DialogTitle>
          <DialogDescription>직원을 더블클릭하거나 행에서 Enter를 누르면 성명과 사번이 전달됩니다.</DialogDescription>
        </DialogHeader>
        <div data-ui="popup-actions" className="flex flex-wrap items-center justify-end gap-2">
          <ActionButton action="search" label="검색" type="submit" form={formId}
            loading={gridState.phase === "initialLoading" && Boolean(context.data)}
            disabled={context.loading || Boolean(context.error)} />
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>닫기</Button>
        </div>
        <SearchPanel formId={formId} onSearch={submit} pending={search.pending}>
          {textField("nameKo", "성명", 100)}
          {textField("employeeNo", "사번", 30)}
          {textField("deptName", "부서명", 200)}
          {selectField("gradeCode", "직급", context.data?.grades ?? [])}
          {selectField("positionCode", "직위", context.data?.positions ?? [])}
          {selectField("serviceStatusCode", "재직구분", context.data?.serviceStatuses ?? [])}
        </SearchPanel>
        <AsyncFeedback loading={context.loading} error={context.error} onRetry={context.retry} />
        {context.data && !context.loading && !context.error && (
          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(240px,1fr)_minmax(0,3fr)]">
            <section aria-label="현재 조직도" className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">조직개편일 {context.data.reorganization.reorgDt}</h3>
                <Button type="button" variant="outline" size="sm" disabled={!search.draft.deptCd}
                  onClick={() => {
                    const next = { ...search.draft, deptCd: "" };
                    search.setDraft(next); apply(next);
                  }}>전체 부서</Button>
              </div>
              <TreeTable items={context.data.departments.map((item) => ({
                id: item.deptKey, parentId: item.parentDeptKey, label: item.deptNm, data: item,
              }))} columns={treeColumns} collapsed={collapsed} showSummary={false} minWidthClassName="min-w-full"
                selectedId={context.data.departments.find((item) => item.deptCd === search.applied.deptCd)?.deptKey}
                onToggle={(key) => setCollapsed((current) => {
                  const next = new Set(current);
                  if (next.has(key)) next.delete(key); else next.add(key);
                  return next;
                })}
                onSelect={(key) => {
                  const department = context.data?.departments.find((item) => item.deptKey === key);
                  if (!department) return;
                  const next = { ...search.draft, deptCd: department.deptCd };
                  search.setDraft(next); apply(next);
                }} emptyMessage="사용 중인 부서가 없습니다." />
            </section>
            <ResultPanel totalCount={gridState.totalCount}>
              <ErpDataGrid<PopupEmployee> columns={EMPLOYEE_COLUMNS} getRowId={employeeKey}
                onLoadData={loadRows} onDataStateChanged={setGridState}
                mobileHiddenColumns={EMPLOYEE_MOBILE_HIDDEN_COLUMNS} height="min(48dvh, 520px)"
                onGridReady={({ api }) => { grid.current = api; }}
                gridOptions={{
                  onRowDoubleClicked: ({ data }) => choose(data),
                  onCellKeyDown: ({ data, event }) => {
                    if (event instanceof KeyboardEvent && event.key === "Enter" && !event.isComposing) {
                      event.preventDefault(); event.stopPropagation(); choose(data);
                    }
                  },
                }} emptyMessage="조회된 직원이 없습니다." />
            </ResultPanel>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
