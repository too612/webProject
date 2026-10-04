/**
 * @fileoverview 공통 DataGrid 컴포넌트
 *
 * @description
 * 4가지 운영 모드를 지원하는 AG Grid 래퍼 컴포넌트입니다.
 *
 * ## 사용 예시
 *
 * ### 1. 게시판 모드 (basic)
 * ```tsx
 * <DataGrid
 *   mode="basic"
 *   columns={columnDefs}
 *   rows={boardList}
 *   loading={isLoading}
 *   pagination={false}
 * />
 * ```
 *
 * ### 2. 서버 모드 (server) - ERP 목록용
 * ```tsx
 * <DataGrid
 *   mode="server"
 *   columns={columnDefs}
 *   rows={data}
 *   totalCount={total}
 *   onSortChanged={(sortModel) => fetchData({ sort: sortModel })}
 *   onFilterChanged={(filterModel) => fetchData({ filter: filterModel })}
 * />
 * ```
 *
 * ### 3. 무한 스크롤 모드 (infinite) - 대용량 데이터
 * ```tsx
 * <DataGrid
 *   mode="infinite"
 *   columns={columnDefs}
 *   onLoadData={async ({ startRow, endRow, sortModel, filterModel }) => {
 *     const res = await api.getList({ start: startRow, end: endRow, ... });
 *     return { rows: res.items, totalCount: res.total };
 *   }}
 * />
 * ```
 */
import {
  AllCommunityModule,
  ModuleRegistry,
  type GridApi,
  type SortChangedEvent,
  type FilterChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../styles/gridTheme.css";
import { RefreshCw } from "lucide-react";
import type { GridProps } from "./gridModel";
import { createInfiniteDatasource, INITIAL_GRID_STATE } from "./infiniteDatasource";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AsyncFeedback } from "../ui/AsyncFeedback";
import { registerExcelGrid, retainExcelGrid, invalidateExcelGrid, markExcelGridReady } from "../excel/excelRegistry";
import type { ExcelSheet } from "../excel/excelModel";

// AG Grid Community 모듈 등록 (앱 전체에서 한 번만 실행)
ModuleRegistry.registerModules([AllCommunityModule]);
const EMPTY_COLUMN_DEF = {};

export default function DataGrid<TData>(props: GridProps<TData>) {
  const {
    mode = "basic",
    columns,
    rows = [],
    loading = false,
    pagination = mode !== "infinite",
    pageSize = 10,
    rowHeight = 44,
    onSortChanged,
    onFilterChanged,
    onLoadData,
    onGridReady,
    emptyMessage = "데이터가 없습니다.",
    gridOptions = {},
    defaultColDef = EMPTY_COLUMN_DEF,
    saveState = false,
    stateKey,
    loadingComponent,
    emptyComponent,
    height = 480,
    cacheBlockSize = 50,
    maxBlocksInCache = 6,
    onTotalCountChanged,
    onLoadStateChanged,
    onDataStateChanged,
    excel,
  } = props;

  // AG Grid API 참조를 저장할 ref
  const gridApiRef = useRef<GridApi<TData> | null>(null);
  const [dataState, setDataState] = useState(INITIAL_GRID_STATE);
  const dataStateRef = useRef(dataState);
  dataStateRef.current = dataState;
  const excelRef = useRef(excel);
  excelRef.current = excel;
  const callbacks = useRef({ onTotalCountChanged, onLoadStateChanged, onDataStateChanged });
  callbacks.current = { onTotalCountChanged, onLoadStateChanged, onDataStateChanged };
  const snapshotExcel = useCallback((): ExcelSheet => {
    const source = excelRef.current;
    const api = gridApiRef.current;
    if (!source || !api || api.isDestroyed()) throw new Error("엑셀 그리드가 준비되지 않았습니다.");
    const state = dataStateRef.current;
    if (loading || (mode === "infinite" && (state.pendingRequests > 0 || !["ready", "empty"].includes(state.phase)))) {
      throw new Error(state.error || "조회가 완료된 후 엑셀을 다운로드하세요.");
    }
    const nodes: Array<{ index: number; data: TData }> = [];
    const collect = (node: { rowIndex: number | null; data: TData | undefined }) => {
      if (node.data && node.rowIndex != null) nodes.push({ index: node.rowIndex, data: node.data });
    };
    if (mode === "infinite") api.forEachNode(collect);
    else api.forEachNodeAfterFilterAndSort(collect);
    nodes.sort((a, b) => a.index - b.index);
    for (let index = api.getPinnedTopRowCount() - 1; index >= 0; index--) {
      const data = api.getPinnedTopRow(index)?.data;
      if (data) nodes.unshift({ index: -index - 1, data });
    }
    for (let index = 0; index < api.getPinnedBottomRowCount(); index++) {
      const data = api.getPinnedBottomRow(index)?.data;
      if (data) nodes.push({ index: Number.MAX_SAFE_INTEGER - index, data });
    }
    const blocks: Array<{ token: string; indexes: number[] }> = [];
    for (const node of nodes) {
      const ref = source.getRowRef(node.data);
      if (!ref) throw new Error("엑셀 조회 검증 정보가 없습니다. 화면을 다시 조회하세요.");
      const previous = blocks[blocks.length - 1];
      if (previous?.token === ref.token) previous.indexes.push(ref.index);
      else blocks.push({ token: ref.token, indexes: [ref.index] });
    }
    if (!nodes.length) {
      if (mode === "infinite" && state.totalCount !== 0) throw new Error("엑셀 조회 행이 준비되지 않았습니다.");
      const token = source.getEmptyToken();
      if (!token) throw new Error("조회하지 않은 그리드는 다운로드할 수 없습니다.");
      blocks.push({ token, indexes: [] });
    }
    return { name: source.sheetName, blocks,
      columns: api.getAllDisplayedColumns().map(column => ({
        id: column.getColId(), title: api.getDisplayNameForColumn(column, "header") || column.getColId(),
        width: column.getActualWidth(),
      })) };
  }, [mode, loading]);
  const snapshotRef = useRef(snapshotExcel);
  snapshotRef.current = snapshotExcel;

  // ===== 모드별 기본 컬럼 속성 결정 =====
  const resolvedDefaultColDef = useMemo(() => {
    const base = {
      resizable: true,
      ...defaultColDef,
    };

    switch (mode) {
      case "basic":
        // 게시판: 정렬/필터 완전 비활성화
        return { ...base, sortable: false, filter: false };
      case "server":
      case "infinite":
      case "client":
        // 서버/무한/클라이언트: 정렬/필터 활성화 (단, 이벤트는 페이지에서 처리)
        return { sortable: true, filter: true, ...base };
      default:
        return base;
    }
  }, [mode, defaultColDef]);

  // ===== 모드별 rowModelType 결정 =====
  const getRowModelType = useCallback(() => {
    if (mode === "infinite") return "infinite";
    return undefined; // 기본값 (client-side)
  }, [mode]);

  // ===== 서버 모드 이벤트 핸들러 =====
  const handleSortChanged = useCallback(
    (params: SortChangedEvent<TData>) => {
      if (mode !== "server" && mode !== "infinite") return;
      const sortModel = params.api.getColumnState()
        .filter((column) => column.sort)
        .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
        .map((column) => ({ colId: column.colId, sort: column.sort ?? null }));
      onSortChanged?.(sortModel);
    },
    [mode, onSortChanged],
  );

  const handleFilterChanged = useCallback(
    (params: FilterChangedEvent<TData>) => {
      if (mode !== "server" && mode !== "infinite") return;
      const filterModel = params.api.getFilterModel();
      onFilterChanged?.(filterModel);
    },
    [mode, onFilterChanged],
  );

  // ===== Infinite 모드 Datasource 설정 =====
  const infiniteDatasource = useMemo(() => {
    if (mode !== "infinite" || !onLoadData) return undefined;
    return createInfiniteDatasource(onLoadData, (state) => {
      setDataState(state);
      dataStateRef.current = state;
      if (excelRef.current && ["ready", "empty"].includes(state.phase) && state.pendingRequests === 0) {
        markExcelGridReady(excelRef.current.scope, excelRef.current.id);
      }
      callbacks.current.onTotalCountChanged?.(state.totalCount);
      callbacks.current.onLoadStateChanged?.(state.pendingRequests > 0);
      callbacks.current.onDataStateChanged?.(state);
    });
  }, [mode, onLoadData]);

  useEffect(() => {
    if (mode !== "infinite") return;
    setDataState(INITIAL_GRID_STATE);
    dataStateRef.current = INITIAL_GRID_STATE;
    if (excelRef.current) invalidateExcelGrid(excelRef.current.scope, excelRef.current.id, "조회 조건이 변경되었습니다. 다시 조회하세요.");
    callbacks.current.onTotalCountChanged?.(null);
    callbacks.current.onDataStateChanged?.(INITIAL_GRID_STATE);
  }, [mode, infiniteDatasource]);

  useEffect(() => {
    if (mode === "infinite" || !excelRef.current) return;
    const source = excelRef.current;
    if (loading) invalidateExcelGrid(source.scope, source.id, "조회 중입니다.");
    else markExcelGridReady(source.scope, source.id);
  }, [mode, loading, rows]);

  // ===== 상태 저장 (localStorage) =====
  useEffect(() => {
    if (!saveState || !stateKey || !gridApiRef.current) return;

    const api = gridApiRef.current;
    const columnApi = api;

    // 저장된 상태 복원
    const savedState = localStorage.getItem(`grid-state-${stateKey}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.columnState) columnApi.applyColumnState({ state: parsed.columnState, applyOrder: true });
        if (parsed.sortModel) api.applyColumnState({ state: parsed.sortModel, defaultState: { sort: null } });
        if (parsed.filterModel) api.setFilterModel(parsed.filterModel);
      } catch (e) {
        console.warn("Failed to restore grid state:", e);
      }
    }

    // 상태 변경 시 저장
    const saveCurrentState = () => {
      const state = {
        columnState: columnApi.getColumnState(),
        sortModel: api.getColumnState().filter((column) => column.sort),
        filterModel: api.getFilterModel(),
      };
      localStorage.setItem(`grid-state-${stateKey}`, JSON.stringify(state));
    };

    // 이벤트 리스너 등록
    api.addEventListener("columnMoved", saveCurrentState);
    api.addEventListener("columnResized", saveCurrentState);
    api.addEventListener("sortChanged", saveCurrentState);
    api.addEventListener("filterChanged", saveCurrentState);

    return () => {
      api.removeEventListener("columnMoved", saveCurrentState);
      api.removeEventListener("columnResized", saveCurrentState);
      api.removeEventListener("sortChanged", saveCurrentState);
      api.removeEventListener("filterChanged", saveCurrentState);
    };
  }, [saveState, stateKey]);

  // ===== 로딩 UI =====
  if (loading && mode !== "infinite") {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center h-60 border border-slate-200 rounded-md bg-slate-50">
          <div className="flex items-center gap-2 text-slate-400">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">불러오는 중...</span>
          </div>
        </div>
      )
    );
  }

  // ===== 빈 데이터 UI =====
  if ((!rows || rows.length === 0) && mode !== "infinite") {
    return (
      emptyComponent || (
        <div className="flex items-center justify-center h-60 border border-slate-200 rounded-md bg-white">
          <span className="text-sm text-slate-400">{emptyMessage}</span>
        </div>
      )
    );
  }

  // ===== AG Grid 렌더링 =====
  return (
    <div className="min-w-0 space-y-2">
      {mode === "infinite" && <AsyncFeedback
        loading={dataState.pendingRequests > 0}
        loadingMessage={dataState.phase === "loadingMore" ? "추가 결과를 불러오는 중..." : "조회 중..."}
        error={dataState.error ?? ""}
        onRetry={() => gridApiRef.current?.refreshInfiniteCache()}
      />}
      {mode === "infinite" && dataState.phase === "empty" && (
        <p role="status" className="py-3 text-center text-sm text-slate-500">{emptyMessage}</p>
      )}
      <div
        className={`ag-theme-alpine ag-theme-custom w-full border border-slate-200 rounded-md overflow-hidden ${excel?.classNames?.join(" ") ?? ""}`}
        id={excel?.id}
        style={mode === "infinite" ? { height } : undefined}
        aria-busy={mode === "infinite" ? dataState.pendingRequests > 0 : loading}
      >
        <AgGridReact
          // ===== 기본 설정 =====
          theme="legacy"
          columnDefs={columns}
          rowData={mode === "infinite" ? undefined : rows}
          pagination={pagination}
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          rowHeight={rowHeight}
          suppressMovableColumns={true}
          suppressCellFocus={mode !== "infinite"}
          rowClass="hover:bg-slate-50/80 transition-colors"
          domLayout={mode === "infinite" ? "normal" : "autoHeight"}
          {...(mode === "infinite" ? {
            cacheBlockSize,
            maxBlocksInCache,
            maxConcurrentDatasourceRequests: 2,
          } : {})}
          // ===== 모드별 설정 =====
          rowModelType={getRowModelType()}
          datasource={infiniteDatasource}
          // ===== 컬럼 기본값 =====
          defaultColDef={resolvedDefaultColDef}
          // ===== 사용자 정의 옵션 =====
          {...gridOptions}
          // ===== 이벤트 =====
          onGridReady={(params) => {
            gridApiRef.current = params.api;
            if (excelRef.current) {
              const source = excelRef.current;
              registerExcelGrid({ scope: source.scope, id: source.id, classNames: source.classNames ?? [],
                snapshot: () => snapshotRef.current() });
            }
            onGridReady?.(params);
            gridOptions.onGridReady?.(params);
          }}
          onSortChanged={(params) => {
            handleSortChanged(params);
            gridOptions.onSortChanged?.(params);
          }}
          onFilterChanged={(params) => {
            handleFilterChanged(params);
            gridOptions.onFilterChanged?.(params);
          }}
          onGridPreDestroyed={(params) => {
            if (excelRef.current) retainExcelGrid(excelRef.current.scope, excelRef.current.id);
            gridApiRef.current = null;
            gridOptions.onGridPreDestroyed?.(params);
          }}
        />
      </div>
    </div>
  );
}
