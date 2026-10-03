import { useManagerPage } from "./managerHook";
import {
  ASSIGNMENT_COLUMNS,
  CAREER_COLUMNS,
  type ManagerCodeOption,
  type ManagerRow,
} from "./managerModel";
import {
  DataGrid,
  type GridCellRendererParams,
  type GridColumnDef,
} from "../../../common/grid";
import {
  ActionButton,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ListPageShell,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../common/ui";
import { UserPlus } from "lucide-react";
import { useWorkspaceTab } from "../../../common/workspace/workspaceHook";

function formatDate(value?: string | null) {
  return value ? value.slice(0, 10) : "-";
}

type OptionSelectProps = Readonly<{
  value: string;
  options: ManagerCodeOption[];
  onChange: (value: string) => void;
  placeholder: string;
  allLabel?: string;
}>;

function OptionSelect({
  value,
  options,
  onChange,
  placeholder,
  allLabel = `${placeholder} 전체`,
}: OptionSelectProps) {
  return (
    <Select value={value || "all"} onValueChange={onChange}>
      <SelectTrigger className="w-full" aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.code} value={option.code}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
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
  const {
    items,
    page,
    totalPages,
    totalElements,
    inputKeyword,
    filters,
    filterOptions,
    loading,
    error,
    selectedPerson,
    detailLoading,
    isSheetOpen,
    sheetTop,
    sheetRight,
    isCreateOpen,
    createForm,
    createLoading,
    handleSearch,
    handleInputKeywordChange,
    handleFilterChange,
    handlePrevPage,
    handleNextPage,
    selectPerson,
    setIsSheetOpen,
    setIsCreateOpen,
    updateCreateForm,
    submitCreate,
  } = useManagerPage();

  const columns: GridColumnDef[] = [
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
    { headerName: "성명", field: "nameKo", minWidth: 120, flex: 1 },
    {
      headerName: "직급 / 직위",
      minWidth: 130,
      valueGetter: (params) =>
        params.data?.positionName || params.data?.gradeName || "-",
      cellRenderer: (params: GridCellRendererParams<ManagerRow>) => (
        <Badge variant="info">{params.value || "미지정"}</Badge>
      ),
    },
    { headerName: "소속 부서", field: "deptName", minWidth: 140 },
    {
      headerName: "고용형태",
      field: "employmentTypeName",
      minWidth: 110,
      cellRenderer: (params: GridCellRendererParams<ManagerRow>) =>
        params.value ? <Badge variant="outline">{params.value}</Badge> : "-",
    },
    {
      headerName: "입사일",
      field: "hireDate",
      minWidth: 110,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
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
    },
    {
      headerName: "상세",
      width: 90,
      sortable: false,
      filter: false,
      cellRenderer: (params: GridCellRendererParams<ManagerRow>) => (
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={(event) => {
            event.stopPropagation();
            if (params.data) void selectPerson(params.data);
          }}
        >
          상세보기
        </button>
      ),
    },
  ];

  return (
    <ListPageShell
      actions={
        <Button onClick={() => setIsCreateOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> 신규 등록
        </Button>
      }
    >
      <div className="min-w-0 space-y-4 [&_.ag-horizontal-left-spacer]:!overflow-x-hidden">
        <form
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          onSubmit={handleSearch}
        >
          <div className="flex gap-2">
            <Input
              value={inputKeyword}
              onChange={(event) => handleInputKeywordChange(event.target.value)}
              placeholder="성명 또는 사번 검색"
              aria-label="성명 또는 사번 검색"
            />
            <ActionButton
              action="search"
              type="submit"
              loading={loading}
              className="min-w-0"
            />
          </div>
          <OptionSelect
            value={filters.gradeCode}
            options={filterOptions.grades}
            onChange={(value) => handleFilterChange("gradeCode", value)}
            placeholder="직급"
          />
          <OptionSelect
            value={filters.positionCode}
            options={filterOptions.positions}
            onChange={(value) => handleFilterChange("positionCode", value)}
            placeholder="직위"
          />
          <OptionSelect
            value={filters.deptCd}
            options={filterOptions.departments}
            onChange={(value) => handleFilterChange("deptCd", value)}
            placeholder="소속 부서"
          />
          <OptionSelect
            value={filters.serviceStatusCode}
            options={filterOptions.serviceStatuses}
            onChange={(value) => handleFilterChange("serviceStatusCode", value)}
            placeholder="재직 상태"
          />
          <OptionSelect
            value={filters.employmentTypeCode}
            options={filterOptions.employmentTypes}
            onChange={(value) =>
              handleFilterChange("employmentTypeCode", value)
            }
            placeholder="고용형태"
          />
        </form>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <DataGrid
          mode="basic"
          columns={columns}
          rows={items}
          loading={loading}
          pagination={false}
          rowHeight={52}
          emptyMessage="조회된 인사정보가 없습니다."
          defaultColDef={{ cellStyle: { textAlign: "center" } }}
          gridOptions={{
            getRowId: (params) => params.data.personKey,
            rowSelection: {
              mode: "multiRow",
              checkboxes: true,
              headerCheckbox: false,
              enableClickSelection: false,
            },
            selectionColumnDef: {
              headerName: "선택",
              width: 74,
              pinned: "left",
              resizable: false,
              cellClass:
                "[&_.ag-cell-wrapper]:justify-center [&_.ag-selection-checkbox]:!m-0 [&_.ag-cell-value]:hidden",
            },
            onRowClicked: (event) => {
              if (event.data) void selectPerson(event.data as ManagerRow);
            },
          }}
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">총 {totalElements}명</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0 || loading}
              onClick={handlePrevPage}
            >
              이전
            </Button>
            <span className="min-w-16 text-center text-slate-600">
              {page + 1} / {Math.max(totalPages, 1)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1 || loading}
              onClick={handleNextPage}
            >
              다음
            </Button>
          </div>
        </div>
      </div>

      <Sheet
        open={isSheetOpen && (workspace?.active ?? true)}
        onOpenChange={setIsSheetOpen}
      >
        <SheetContent
          side="right"
          className="flex min-h-0 w-full flex-col overflow-hidden rounded-md p-0 sm:max-w-xl"
          style={{
            top: sheetTop + 12,
            bottom: 12,
            right: sheetRight,
            width: `calc(100% - ${sheetRight + 12}px)`,
            height: `calc(100dvh - ${sheetTop + 24}px)`,
          }}
        >
          <SheetHeader className="shrink-0 border-b border-slate-200 px-6 py-5 pr-12 text-left">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={selectedPerson?.profilePhotoUrl || undefined}
                  alt={selectedPerson?.nameKo || ""}
                />
                <AvatarFallback>
                  {selectedPerson?.nameKo?.slice(0, 1) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <SheetTitle>
                  {detailLoading
                    ? "인사정보 불러오는 중"
                    : selectedPerson?.nameKo || "인사 상세"}
                </SheetTitle>
                <SheetDescription className="mt-1">
                  {selectedPerson
                    ? `${selectedPerson.employeeNo} · ${selectedPerson.positionName || selectedPerson.gradeName || "직급 미지정"}`
                    : "인사 상세정보"}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {detailLoading && (
              <p className="py-12 text-center text-sm text-slate-500">
                불러오는 중...
              </p>
            )}
            {!detailLoading && selectedPerson && (
              <Tabs defaultValue="basic">
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
                      cellStyle: { textAlign: "center" },
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
                      cellStyle: { textAlign: "center" },
                      valueFormatter: (params) => params.value || "-",
                    }}
                    gridOptions={{
                      getRowId: (params) => params.data.assignmentKey,
                    }}
                  />
                </TabsContent>
              </Tabs>
            )}
            {!detailLoading && !selectedPerson && (
              <p className="py-8 text-center text-sm text-slate-500">
                인사정보를 표시할 수 없습니다.
              </p>
            )}
          </div>
          <SheetFooter className="shrink-0 border-t border-slate-200 px-6 py-4">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              닫기
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog
        open={isCreateOpen && (workspace?.active ?? true)}
        onOpenChange={setIsCreateOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>신규 교직원 등록</DialogTitle>
            <DialogDescription>
              인사 기본정보를 입력합니다. 사번과 성명은 필수입니다.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-5" onSubmit={submitCreate}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeNo">사번</Label>
                <Input
                  id="employeeNo"
                  value={createForm.employeeNo}
                  onChange={(event) =>
                    updateCreateForm("employeeNo", event.target.value)
                  }
                  required
                  maxLength={30}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameKo">성명</Label>
                <Input
                  id="nameKo"
                  value={createForm.nameKo}
                  onChange={(event) =>
                    updateCreateForm("nameKo", event.target.value)
                  }
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">영문 성명</Label>
                <Input
                  id="nameEn"
                  value={createForm.nameEn || ""}
                  onChange={(event) =>
                    updateCreateForm("nameEn", event.target.value)
                  }
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">입사일</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={createForm.hireDate || ""}
                  onChange={(event) =>
                    updateCreateForm("hireDate", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>부서</Label>
                <OptionSelect
                  value={createForm.deptCd || ""}
                  options={filterOptions.departments}
                  onChange={(value) =>
                    updateCreateForm("deptCd", value === "all" ? "" : value)
                  }
                  placeholder="부서 선택"
                  allLabel="미지정"
                />
              </div>
              <div className="space-y-2">
                <Label>직급</Label>
                <OptionSelect
                  value={createForm.gradeCode || ""}
                  options={filterOptions.grades}
                  onChange={(value) =>
                    updateCreateForm("gradeCode", value === "all" ? "" : value)
                  }
                  placeholder="직급 선택"
                  allLabel="미지정"
                />
              </div>
              <div className="space-y-2">
                <Label>직위</Label>
                <OptionSelect
                  value={createForm.positionCode || ""}
                  options={filterOptions.positions}
                  onChange={(value) =>
                    updateCreateForm(
                      "positionCode",
                      value === "all" ? "" : value,
                    )
                  }
                  placeholder="직위 선택"
                  allLabel="미지정"
                />
              </div>
              <div className="space-y-2">
                <Label>고용형태</Label>
                <OptionSelect
                  value={createForm.employmentTypeCode || ""}
                  options={filterOptions.employmentTypes}
                  onChange={(value) =>
                    updateCreateForm(
                      "employmentTypeCode",
                      value === "all" ? "" : value,
                    )
                  }
                  placeholder="고용형태 선택"
                  allLabel="미지정"
                />
              </div>
              <div className="space-y-2">
                <Label>재직 상태</Label>
                <OptionSelect
                  value={createForm.serviceStatusCode || ""}
                  options={filterOptions.serviceStatuses}
                  onChange={(value) =>
                    updateCreateForm(
                      "serviceStatusCode",
                      value === "all" ? "" : value,
                    )
                  }
                  placeholder="재직 상태 선택"
                  allLabel="미지정"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">생년월일</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={createForm.birthDate || ""}
                  onChange={(event) =>
                    updateCreateForm("birthDate", event.target.value)
                  }
                />
              </div>
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={createLoading}>
                {createLoading ? "등록 중..." : "등록"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ListPageShell>
  );
}
