import { useEffect, useId, useMemo, useState } from "react";
import { useManagerPage } from "./managerHook";
import {
  ASSIGNMENT_COLUMNS,
  CAREER_COLUMNS,
  type ManagerRow,
} from "./managerModel";
import {
  DataGrid,
  ErpDataGrid,
  erpColumn,
  useGridDetail,
  type GridCellRendererParams,
  type GridColumnDef,
} from "../../../common/grid";
import {
  Avatar,
  AsyncFeedback,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  ConfirmModal,
  DetailPanelLayout,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  FormField,
  ListPageActions,
  ListPageShell,
  SearchPanel,
  SearchField,
  ResultPanel,
  CodeSelect,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../common/ui";
import { useWorkspaceTab } from "../../../common/workspace/workspaceHook";
import { useExcelExport, type ExcelGridSource } from "../../../common/excel";
import { ActionButton } from "../../../common/ui/action-button";

const MOBILE_HIDDEN_COLUMNS = ["profilePhotoUrl", "gradeName", "positionName", "deptName", "employmentTypeName", "hireDate", "serviceStatusName", "detail"];
const personKey = (row: ManagerRow) => row.personKey;

function formatDate(value?: string | null) {
  return value ? value.slice(0, 10) : "-";
}

function InfoItem({
  label,
  value,
}: Readonly<{ label: string; value?: string | null }>) {
  return (
    <div className="border-b border-slate-100 py-3">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-slate-800">
        {value || "-"}
      </dd>
    </div>
  );
}

export default function ManagerPage() {
  const workspace = useWorkspaceTab();
  const formId = useId();
  const searchFormId = `${formId}-search`;
  const excel = useExcelExport();
  const excelGridId = `${formId}-manager-grid`;
  const [detailTab, setDetailTab] = useState("basic");
  const {
    loadRows,
    excelState,
    totalElements,
    setGridState,
    searchPending,
    inputKeyword,
    filters,
    filterOptions,
    loading,
    optionsLoading,
    optionsError,
    retryOptions,
    detailError,
    createError,
    createFieldErrors,
    createMessage,
    selectedRow,
    selectedPerson,
    detailLoading,
    isSheetOpen,
    isCreateOpen,
    createForm,
    createLoading,
    handleSearch,
    handleInputKeywordChange,
    handleFilterChange,
    selectPerson,
    handleDetailOpenChange,
    handleCreateOpenChange,
    confirmDiscard,
    setConfirmDiscard,
    discardCreate,
    updateCreateForm,
    submitCreate,
  } = useManagerPage();

  const detailGrid = useGridDetail({
    selected: selectedRow, open: isSheetOpen, getKey: personKey,
    onSelect: selectPerson, onClose: () => handleDetailOpenChange(false), queryKey: loadRows,
  });
  const { openRow } = detailGrid;
  const optionsDisabled = optionsLoading || Boolean(optionsError);
  const excelSource = useMemo<ExcelGridSource<ManagerRow>>(() => ({
    scope: excel.scope, id: excelGridId, sheetName: "인사관리",
    getRowRef: row => row.excelRef, getEmptyToken: () => excelState.current.token,
  }), [excel.scope, excelGridId, excelState]);

  useEffect(() => {
    setDetailTab("basic");
  }, [selectedRow?.personKey]);

  const columns = useMemo<GridColumnDef<ManagerRow>[]>(() => [
    erpColumn<ManagerRow>("name", { headerName: "성명", field: "nameKo", minWidth: 120, flex: 1 }),
    erpColumn<ManagerRow>("code", { headerName: "사번", field: "employeeNo", minWidth: 130, sort: "asc" }),
    {
      headerName: "프로필",
      field: "profilePhotoUrl",
      width: 88,
      sortable: false,
      filter: false,
      cellRenderer: (params: GridCellRendererParams<ManagerRow>) => (
        <Avatar className="mx-auto mt-1 h-8 w-8">
          <AvatarImage
            src={params.value || undefined}
            alt={params.data?.nameKo || ""}
          />
          <AvatarFallback>
            {params.data?.nameKo?.slice(0, 1) || "?"}
          </AvatarFallback>
        </Avatar>
      ),
    },
    erpColumn<ManagerRow>("code", { headerName: "직급", field: "gradeName", minWidth: 100 }),
    erpColumn<ManagerRow>("code", {
      headerName: "직위",
      field: "positionName",
      minWidth: 130,
      cellRenderer: (params: GridCellRendererParams<ManagerRow>) => (
        <Badge variant="info">{params.value || "미지정"}</Badge>
      ),
    }),
    erpColumn<ManagerRow>("name", { headerName: "소속 부서", field: "deptName", minWidth: 140, tooltipField: "deptName" }),
    erpColumn<ManagerRow>("code", {
      headerName: "고용형태",
      field: "employmentTypeName",
      minWidth: 110,
      cellRenderer: (params: GridCellRendererParams<ManagerRow>) =>
        params.value ? <Badge variant="outline">{params.value}</Badge> : "-",
    }),
    erpColumn<ManagerRow>("date", {
      headerName: "입사일",
      field: "hireDate",
      minWidth: 110,
      valueFormatter: (params) => formatDate(params.value),
    }),
    erpColumn<ManagerRow>("status", {
      headerName: "재직 상태",
      field: "serviceStatusName",
      minWidth: 110,
      cellRenderer: (params: GridCellRendererParams<ManagerRow>) => (
        <Badge
          variant={
            params.data?.serviceStatusCode === "101-010"
              ? "success"
              : "secondary"
          }
        >
          {params.value || "미지정"}
        </Badge>
      ),
    }),
    {
      headerName: "상세",
      colId: "detail",
      width: 90,
      sortable: false,
      filter: false,
      cellRenderer: (params: GridCellRendererParams<ManagerRow>) => (
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={(event) => {
            event.stopPropagation();
            if (params.data) openRow(params.data, params.column?.getColId());
          }}
        >
          상세보기
        </button>
      ),
    },
  ], [openRow]);

  return (
    <ListPageShell
      actions={
        <ListPageActions searchFormId={searchFormId} searching={loading}
          onCreate={() => handleCreateOpenChange(true)}>
          <ActionButton action="excel" type="button" loading={excel.exporting}
            disabled={loading} title="현재 조회되어 남아 있는 행과 표시된 열을 다운로드합니다."
            onClick={() => void excel.exportExcel(`#${excelGridId}`, "인사관리")} />
        </ListPageActions>
      }
    >
      <DetailPanelLayout
        open={isSheetOpen}
        onOpenChange={handleDetailOpenChange}
        onRestoreFocus={detailGrid.restoreFocus}
        navigation={{ ...detailGrid.navigation, disabled: detailLoading,
          previousLabel: "이전 인사정보", nextLabel: "다음 인사정보" }}
        title={
          <span className="inline-flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={selectedRow?.profilePhotoUrl || undefined} alt={selectedRow?.nameKo || ""} />
              <AvatarFallback>{selectedRow?.nameKo?.slice(0, 1) || "?"}</AvatarFallback>
            </Avatar>
            <span>{selectedRow?.nameKo || "인사 상세"}</span>
          </span>
        }
        description={selectedRow ? [selectedRow.employeeNo, selectedRow.gradeName, selectedRow.positionName].filter(Boolean).join(" · ") : "인사 상세정보"}
        children={
          <div className="min-w-0 space-y-4">
            <SearchPanel formId={searchFormId} onSearch={handleSearch} pending={searchPending}>
              <SearchField label="성명 / 사번" width="keyword">
                {(id) => (
                  <Input
                    id={id}
                    value={inputKeyword}
                    onChange={(event) => handleInputKeywordChange(event.target.value)}
                    placeholder="성명·사번 입력"
                  />
                )}
              </SearchField>
              <SearchField label="직급" width="compact">
                {(id) => <CodeSelect id={id} disabled={optionsDisabled}
                  value={filters.gradeCode}
                  options={filterOptions.grades}
                  onChange={(value) => handleFilterChange("gradeCode", value)}
                  placeholder="직급"
                />}
              </SearchField>
              <SearchField label="직위" width="compact">
                {(id) => <CodeSelect id={id} disabled={optionsDisabled}
                  value={filters.positionCode}
                  options={filterOptions.positions}
                  onChange={(value) => handleFilterChange("positionCode", value)}
                  placeholder="직위"
                />}
              </SearchField>
              <SearchField label="소속 부서" width="compact">
                {(id) => <CodeSelect id={id} disabled={optionsDisabled}
                  value={filters.deptCd}
                  options={filterOptions.departments}
                  onChange={(value) => handleFilterChange("deptCd", value)}
                  placeholder="소속 부서"
                />}
              </SearchField>
              <SearchField label="재직 상태" width="compact">
                {(id) => <CodeSelect id={id} disabled={optionsDisabled}
                  value={filters.serviceStatusCode}
                  options={filterOptions.serviceStatuses}
                  onChange={(value) => handleFilterChange("serviceStatusCode", value)}
                  placeholder="재직 상태"
                />}
              </SearchField>
              <SearchField label="고용형태" width="compact">
                {(id) => <CodeSelect id={id} disabled={optionsDisabled}
                  value={filters.employmentTypeCode}
                  options={filterOptions.employmentTypes}
                  onChange={(value) =>
                    handleFilterChange("employmentTypeCode", value)
                  }
                  placeholder="고용형태"
                />}
              </SearchField>
            </SearchPanel>

            <AsyncFeedback loading={optionsLoading} loadingMessage="검색조건을 불러오는 중..."
              error={optionsError} onRetry={retryOptions} />
            {createMessage && <p role="status" className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">{createMessage}</p>}

            <ResultPanel totalCount={totalElements} countUnit="명">
              <ErpDataGrid<ManagerRow>
                excel={excelSource}
                columns={columns}
                onLoadData={loadRows}
                onDataStateChanged={setGridState}
                getRowId={personKey}
                mobileHiddenColumns={MOBILE_HIDDEN_COLUMNS}
                emptyMessage="조회된 인사정보가 없습니다."
                gridOptions={detailGrid.gridOptions}
              />
            </ResultPanel>
          </div>
        }
        detail={
          <div className="min-w-0">
            <AsyncFeedback loading={detailLoading} error={detailError}
              onRetry={() => { if (selectedRow) void selectPerson(selectedRow); }} />
            {!detailLoading && selectedPerson && (
              <Tabs value={detailTab} onValueChange={setDetailTab}>
                <TabsList className="grid h-auto w-full grid-cols-4">
                  <TabsTrigger value="basic">기본 정보</TabsTrigger>
                  <TabsTrigger value="work">사역/근무</TabsTrigger>
                  <TabsTrigger value="career">경력</TabsTrigger>
                  <TabsTrigger value="assignment">임면 이력</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4">
                  <dl className="grid grid-cols-2 gap-x-5">
                    <InfoItem label="사번" value={selectedPerson.employeeNo} />
                    <InfoItem
                      label="성명(영문)"
                      value={selectedPerson.nameEn}
                    />
                    <InfoItem
                      label="성명(한자)"
                      value={selectedPerson.nameHanja}
                    />
                    <InfoItem
                      label="생년월일"
                      value={formatDate(selectedPerson.birthDate)}
                    />
                    <InfoItem label="성별" value={selectedPerson.genderCode} />
                    <InfoItem
                      label="주소"
                      value={[
                        selectedPerson.postalCode,
                        selectedPerson.addressLine1,
                        selectedPerson.addressLine2,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  </dl>
                  {selectedPerson.aiSummary && (
                    <p className="mt-5 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                      {selectedPerson.aiSummary}
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="work" className="mt-4">
                  <dl className="grid grid-cols-2 gap-x-5">
                    <InfoItem
                      label="소속 부서"
                      value={selectedPerson.deptName}
                    />
                    <InfoItem label="직급" value={selectedPerson.gradeName} />
                    <InfoItem
                      label="직위"
                      value={selectedPerson.positionName}
                    />
                    <InfoItem
                      label="고용형태"
                      value={selectedPerson.employmentTypeName}
                    />
                    <InfoItem
                      label="재직 상태"
                      value={selectedPerson.serviceStatusName}
                    />
                    <InfoItem
                      label="입사일"
                      value={formatDate(selectedPerson.hireDate)}
                    />
                    <InfoItem
                      label="퇴직일"
                      value={formatDate(selectedPerson.retireDate)}
                    />
                    <InfoItem
                      label="최근 승진일"
                      value={formatDate(selectedPerson.promotionDate)}
                    />
                  </dl>
                </TabsContent>
                <TabsContent value="career" className="mt-4 min-w-0">
                  <DataGrid
                    mode="basic"
                    columns={CAREER_COLUMNS}
                    rows={selectedPerson.careers}
                    pagination={false}
                    emptyMessage="등록된 경력 정보가 없습니다."
                    defaultColDef={{
                      valueFormatter: (params) => params.value || "-",
                    }}
                    gridOptions={{
                      getRowId: (params) => params.data.careerKey,
                    }}
                  />
                </TabsContent>
                <TabsContent value="assignment" className="mt-4 min-w-0">
                  <DataGrid
                    mode="basic"
                    columns={ASSIGNMENT_COLUMNS}
                    rows={selectedPerson.assignments}
                    pagination={false}
                    emptyMessage="등록된 발령 이력이 없습니다."
                    defaultColDef={{
                      valueFormatter: (params) => params.value || "-",
                    }}
                    gridOptions={{
                      getRowId: (params) => params.data.assignmentKey,
                    }}
                  />
                </TabsContent>
              </Tabs>
            )}
            {!detailLoading && !selectedPerson && !detailError && (
              <p className="py-8 text-center text-sm text-slate-500">
                인사정보를 표시할 수 없습니다.
              </p>
            )}
          </div>
        }
      />

      <Dialog
        open={isCreateOpen && (workspace?.active ?? true)}
        onOpenChange={handleCreateOpenChange}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl motion-reduce:animate-none" onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>신규 교직원 등록</DialogTitle>
            <DialogDescription>
              인사 기본정보를 입력합니다. 사번과 성명은 필수입니다.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-5" onSubmit={submitCreate} noValidate>
            <AsyncFeedback loading={optionsLoading} loadingMessage="등록 선택항목을 불러오는 중..."
              error={optionsError} onRetry={retryOptions} />
            <fieldset disabled={createLoading} className="grid gap-4 border-0 p-0 sm:grid-cols-2">
              {([
                { field: "employeeNo", label: "사번", required: true, maxLength: 30, type: "text" },
                { field: "nameKo", label: "성명", required: true, maxLength: 100, type: "text" },
                { field: "nameEn", label: "영문 성명", required: false, maxLength: 100, type: "text" },
                { field: "hireDate", label: "입사일", required: false, maxLength: undefined, type: "date" },
              ] as const).map(({ field, label, required, maxLength, type }) => (
                <FormField key={field} label={label} required={required} error={createFieldErrors[field]}>
                  {(control) => <Input {...control} type={type} required={required} maxLength={maxLength}
                    value={createForm[field] || ""} onChange={(event) => updateCreateForm(field, event.target.value)} />}
                </FormField>
              ))}
              {([
                { field: "deptCd", label: "부서", options: filterOptions.departments },
                { field: "gradeCode", label: "직급", options: filterOptions.grades },
                { field: "positionCode", label: "직위", options: filterOptions.positions },
                { field: "employmentTypeCode", label: "고용형태", options: filterOptions.employmentTypes },
                { field: "serviceStatusCode", label: "재직 상태", options: filterOptions.serviceStatuses },
              ] as const).map(({ field, label, options }) => (
                <FormField key={field} label={label} required={field === "serviceStatusCode"} error={createFieldErrors[field]}>
                  {(control) => <CodeSelect {...control} options={options} value={createForm[field] || ""}
                    disabled={optionsDisabled} onChange={(value) => updateCreateForm(field, value)}
                    placeholder={`${label} 선택`} allLabel="미지정" allowEmpty={field !== "serviceStatusCode"} />}
                </FormField>
              ))}
              <FormField label="생년월일" error={createFieldErrors.birthDate}>
                {(control) => <Input {...control} type="date" value={createForm.birthDate || ""}
                  onChange={(event) => updateCreateForm("birthDate", event.target.value)} />}
              </FormField>
            </fieldset>
            {createError && (
              <p role="alert" className="text-sm text-red-600">
                {createError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={createLoading}
                onClick={() => handleCreateOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={createLoading || optionsDisabled}>
                {createLoading ? "등록 중..." : "등록"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmModal
        isOpen={confirmDiscard && (workspace?.active ?? true)}
        title="등록 취소"
        message="입력한 내용이 저장되지 않았습니다. 입력을 버리고 닫으시겠습니까?"
        confirmText="입력 버리기"
        cancelText="계속 작성"
        onConfirm={discardCreate}
        onCancel={() => setConfirmDiscard(false)}
      />
    </ListPageShell>
  );
}
