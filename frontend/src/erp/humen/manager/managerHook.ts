import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { managerApi } from "./managerApi";
import type { ManagerListQuery, ManagerListResult } from "./managerApi";
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
  const [items, setItems] = useState<ManagerRow[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");
  const [filters, setFilters] = useState<ManagerFilters>(() => ({
    ...EMPTY_FILTERS,
    deptCd: searchParams.get("deptCd") ?? "",
    serviceStatusCode: searchParams.get("serviceStatusCode") ?? "",
    employmentTypeCode: searchParams.get("employmentTypeCode") ?? "",
  }));
  const [filterOptions, setFilterOptions] =
    useState<ManagerFilterOptions>(EMPTY_OPTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPerson, setSelectedPerson] =
    useState<ManagerPersonDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetTop, setSheetTop] = useState(0);
  const [sheetRight, setSheetRight] = useState(12);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] =
    useState<ManagerCreateRequest>(EMPTY_CREATE_FORM);
  const [createLoading, setCreateLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useWorkspaceDirty(
    JSON.stringify(createForm) !== JSON.stringify(EMPTY_CREATE_FORM),
  );

  useLayoutEffect(() => {
    if (!isSheetOpen) return;
    const header = document.querySelector<HTMLElement>("header.header");
    const updateSheetBounds = () => {
      const headerBounds = header?.getBoundingClientRect();
      const frameRight = Math.min(
        document.documentElement.clientWidth,
        headerBounds?.right ?? document.documentElement.clientWidth,
      );
      setSheetTop(Math.max(0, headerBounds?.bottom ?? 0));
      setSheetRight(Math.max(0, window.innerWidth - frameRight) + 12);
    };
    updateSheetBounds();
    const observer = new ResizeObserver(updateSheetBounds);
    if (header) observer.observe(header);
    window.addEventListener("resize", updateSheetBounds);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSheetBounds);
    };
  }, [isSheetOpen]);

  const loadManagerList = useCallback(
    async (query: ManagerListQuery): Promise<ManagerListResult<ManagerRow>> => {
      return managerApi.getManagerList(query);
    },
    [],
  );

  useEffect(() => {
    let mounted = true;
    managerApi
      .getFilterOptions()
      .then((options) => {
        if (mounted) setFilterOptions(options);
      })
      .catch((e) => {
        if (mounted)
          setError(
            e instanceof Error
              ? e.message
              : "인사 필터 옵션을 불러오지 못했습니다.",
          );
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    loadManagerList({ page, size, keyword: keyword || undefined, ...filters })
      .then((result) => {
        if (!mounted) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      })
      .catch((e) => {
        if (!mounted) return;
        const message =
          e instanceof Error ? e.message : "담당자 목록을 불러오지 못했습니다.";
        setError(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, size, keyword, filters, loadManagerList, refreshKey]);

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setPage(0);
      setKeyword(inputKeyword.trim());
    },
    [inputKeyword],
  );

  const handleFilterChange = useCallback(
    (key: keyof ManagerFilters, value: string) => {
      setPage(0);
      setFilters((current) => ({
        ...current,
        [key]: value === "all" ? "" : value,
      }));
    },
    [],
  );

  const handleInputKeywordChange = useCallback((value: string) => {
    setInputKeyword(value);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPage((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((prev) => (prev >= totalPages - 1 ? prev : prev + 1));
  }, [totalPages]);

  const selectPerson = useCallback(async (row: ManagerRow) => {
    setSelectedPerson(null);
    setIsSheetOpen(true);
    setDetailLoading(true);
    setError("");
    try {
      setSelectedPerson(await managerApi.getPersonDetail(row.employeeNo));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "인사 상세정보를 불러오지 못했습니다.",
      );
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const updateCreateForm = useCallback(
    (key: keyof ManagerCreateRequest, value: string) => {
      setCreateForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const submitCreate = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setCreateLoading(true);
      setError("");
      const request = Object.fromEntries(
        Object.entries(createForm).map(([key, value]) => [
          key,
          value === "" ? undefined : value,
        ]),
      ) as unknown as ManagerCreateRequest;
      try {
        await managerApi.createPerson(request);
        setIsCreateOpen(false);
        setCreateForm(EMPTY_CREATE_FORM);
        setPage(0);
        setRefreshKey((current) => current + 1);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "인사정보 등록에 실패했습니다.",
        );
      } finally {
        setCreateLoading(false);
      }
    },
    [createForm],
  );

  return {
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
  };
}
