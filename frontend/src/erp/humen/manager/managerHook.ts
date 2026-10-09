import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { managerApi } from "./managerApi";
import { blockToPage, type GridLoadParams, type GridDataState } from "../../../common/grid";
import { INITIAL_GRID_STATE } from "../../../common/grid/infiniteDatasource";
import { useAsyncResource, useSearchQuery } from "../../../common/ui";
import { focusFirstInvalid, type FieldErrors } from "../../../common/ui/form/formValidation";
import { equalManagerSearch, hasManagerSearch, normalizeManagerCreate, validateManagerCreate, type ManagerSearch } from "./managerValidation";
import { useWorkspaceDirty } from "../../../common/workspace/workspaceHook";
import type {
  ManagerCreateRequest,
  ManagerFilterOptions,
  ManagerFilters,
  ManagerPersonDetail,
  ManagerRow,
} from "./managerModel";

const EMPTY_FILTERS: ManagerFilters = {
  deptCd: "",
  gradeCode: "",
  positionCode: "",
  employmentTypeCode: "",
  serviceStatusCode: "",
};

const EMPTY_OPTIONS: ManagerFilterOptions = {
  departments: [],
  grades: [],
  positions: [],
  employmentTypes: [],
  serviceStatuses: [],
};

const EMPTY_CREATE_FORM: ManagerCreateRequest = {
  employeeNo: "",
  nameKo: "",
  serviceStatusCode: "101-010",
};

export function useManagerPage() {
  const [searchParams] = useSearchParams();
  const [initialQuery] = useState<ManagerSearch>(() => ({
    ...EMPTY_FILTERS,
    keyword: searchParams.get("keyword") ?? "",
    deptCd: searchParams.get("deptCd") ?? "",
    gradeCode: searchParams.get("gradeCode") ?? "",
    positionCode: searchParams.get("positionCode") ?? "",
    serviceStatusCode: searchParams.get("serviceStatusCode") ?? "",
    employmentTypeCode: searchParams.get("employmentTypeCode") ?? "",
  }));
  const search = useSearchQuery(initialQuery, equalManagerSearch);
  const { draft: filters, applied: appliedQuery, revision, setDraft, apply, refresh } = search;
  const options = useAsyncResource(managerApi.getFilterOptions, "인사 검색조건을 불러오지 못했습니다.");
  const [gridState, setGridState] = useState<GridDataState>(INITIAL_GRID_STATE);
  const [detailError, setDetailError] = useState("");
  const [createError, setCreateError] = useState("");
  const [createFieldErrors, setCreateFieldErrors] = useState<FieldErrors<ManagerCreateRequest>>({});
  const [createMessage, setCreateMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState<ManagerRow | null>(null);
  const [selectedPerson, setSelectedPerson] =
    useState<ManagerPersonDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] =
    useState<ManagerCreateRequest>(EMPTY_CREATE_FORM);
  const [createLoading, setCreateLoading] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const detailRequest = useRef<AbortController | null>(null);
  const createInFlight = useRef(false);
  const excelState = useRef<{ token?: string }>({});
  const createDirty = JSON.stringify(createForm) !== JSON.stringify(EMPTY_CREATE_FORM);
  useWorkspaceDirty(createDirty);
  const loadRows = useCallback(
    async ({ startRow, endRow, sortModel, signal }: GridLoadParams) => {
      const { page, size } = blockToPage(startRow, endRow);
      const sort = sortModel?.[0];
      const result = await managerApi.getManagerList({
        ...appliedQuery,
        page,
        size,
        ...(sort ? { sortField: sort.colId, sortDirection: sort.sort ?? "asc" } : {}),
      }, signal);
      if (!signal?.aborted) excelState.current = { token: result.excelToken };
      return { rows: result.items, totalCount: result.totalElements };
    },
    [appliedQuery, revision],
  );

  useEffect(() => () => detailRequest.current?.abort(), []);

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      apply({ ...filters, keyword: filters.keyword.trim() });
      setIsSheetOpen(false);
    },
    [apply, filters],
  );

  const handleFilterChange = useCallback(
    (key: keyof ManagerFilters, value: string) => {
      setDraft((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [setDraft],
  );

  const handleInputKeywordChange = useCallback((value: string) => {
    setDraft((current) => ({ ...current, keyword: value }));
  }, [setDraft]);

  const selectPerson = useCallback(async (row: ManagerRow) => {
    detailRequest.current?.abort();
    const controller = new AbortController();
    detailRequest.current = controller;
    setSelectedRow(row);
    setSelectedPerson(null);
    setIsSheetOpen(true);
    setDetailLoading(true);
    setDetailError("");
    try {
      const detail = await managerApi.getPersonDetail(row.employeeNo, controller.signal);
      if (!controller.signal.aborted) setSelectedPerson(detail);
    } catch (e) {
      if (controller.signal.aborted) return;
      setDetailError(
        e instanceof Error ? e.message : "인사 상세정보를 불러오지 못했습니다.",
      );
    } finally {
      if (!controller.signal.aborted) setDetailLoading(false);
    }
  }, []);

  const handleDetailOpenChange = useCallback((open: boolean) => {
    setIsSheetOpen(open);
    if (!open) detailRequest.current?.abort();
  }, []);

  const handleCreateOpenChange = useCallback((open: boolean) => {
    if (createInFlight.current) return;
    if (!open && createDirty) {
      setConfirmDiscard(true);
      return;
    }
    setCreateError("");
    setCreateFieldErrors({});
    if (open) setCreateMessage("");
    setIsCreateOpen(open);
  }, [createLoading, createDirty]);

  const discardCreate = useCallback(() => {
    setCreateForm({ ...EMPTY_CREATE_FORM });
    setCreateError("");
    setCreateFieldErrors({});
    setIsCreateOpen(false);
    setConfirmDiscard(false);
  }, []);

  const updateCreateForm = useCallback(
    (key: keyof ManagerCreateRequest, value: string) => {
      setCreateForm((current) => ({ ...current, [key]: value }));
      setCreateFieldErrors((current) => ({ ...current, [key]: undefined }));
      setCreateError("");
    },
    [],
  );

  const submitCreate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (createInFlight.current) return;
      if (options.loading || options.error) {
        setCreateError("검색조건을 불러온 후 등록할 수 있습니다.");
        return;
      }
      const errors = validateManagerCreate(createForm);
      setCreateFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        const form = event.currentTarget;
        setCreateError("입력 내용을 확인하세요.");
        requestAnimationFrame(() => focusFirstInvalid(form));
        return;
      }
      createInFlight.current = true;
      setCreateLoading(true);
      setCreateError("");
      const request = normalizeManagerCreate(createForm);
      try {
        await managerApi.createPerson(request);
        setIsCreateOpen(false);
        setCreateForm(EMPTY_CREATE_FORM);
        refresh();
        setCreateMessage(hasManagerSearch(appliedQuery)
          ? `${request.nameKo} 등록이 완료되었습니다. 현재 검색조건에 따라 목록에 보이지 않을 수 있습니다.`
          : `${request.nameKo} 등록이 완료되었습니다.`);
      } catch (e) {
        setCreateError(
          e instanceof Error ? e.message : "인사정보 등록에 실패했습니다.",
        );
      } finally {
        createInFlight.current = false;
        setCreateLoading(false);
      }
    },
    [createForm, options.loading, options.error, appliedQuery, refresh],
  );

  return {
    excelState,
    loadRows,
    totalElements: gridState.totalCount,
    setGridState,
    searchPending: search.pending,
    inputKeyword: filters.keyword,
    filters,
    filterOptions: options.data ?? EMPTY_OPTIONS,
    loading: gridState.phase === "initialLoading",
    optionsLoading: options.loading,
    optionsError: options.error,
    retryOptions: options.retry,
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
    confirmDiscard,
    setConfirmDiscard,
    discardCreate,
    handleSearch,
    handleInputKeywordChange,
    handleFilterChange,
    selectPerson,
    handleDetailOpenChange,
    handleCreateOpenChange,
    updateCreateForm,
    submitCreate,
  };
}
