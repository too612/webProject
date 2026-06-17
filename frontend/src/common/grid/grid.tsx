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
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../../styles/gridTheme.css';
import type { GridProps } from './gridModel';
import { useCallback, useEffect, useRef, useMemo } from 'react';

// AG Grid Community 모듈 등록 (앱 전체에서 한 번만 실행)
ModuleRegistry.registerModules([AllCommunityModule]);

export default function grid(props: GridProps) {
  const {
    mode = 'basic',
    columns,
    rows = [],
    loading = false,
    pagination = true,
    pageSize = 10,
    rowHeight = 44,
    totalCount,
    onSortChanged,
    onFilterChanged,
    onLoadData,
    onGridReady,
    emptyMessage = '데이터가 없습니다.',
    gridOptions = {},
    defaultColDef = {},
    saveState = false,
    stateKey,
    loadingComponent,
    emptyComponent,
  } = props;

  // AG Grid API 참조를 저장할 ref
  const gridApiRef = useRef<any>(null);

  // ===== 모드별 기본 컬럼 속성 결정 =====
  const getDefaultColDef = useCallback(() => {
    const base = {
      resizable: true,
      ...defaultColDef,
    };

    switch (mode) {
      case 'basic':
        // 게시판: 정렬/필터 완전 비활성화
        return { ...base, sortable: false, filter: false };
      case 'server':
      case 'infinite':
      case 'client':
        // 서버/무한/클라이언트: 정렬/필터 활성화 (단, 이벤트는 페이지에서 처리)
        return { ...base, sortable: true, filter: true };
      default:
        return base;
    }
  }, [mode, defaultColDef]);

  // ===== 모드별 rowModelType 결정 =====
  const getRowModelType = useCallback(() => {
    if (mode === 'infinite') return 'infinite';
    return undefined; // 기본값 (client-side)
  }, [mode]);

  // ===== 서버 모드 이벤트 핸들러 =====
  const handleSortChanged = useCallback((params: any) => {
    if (mode !== 'server' && mode !== 'infinite') return;
    const sortModel = params.api.getSortModel();
    onSortChanged?.(sortModel);
  }, [mode, onSortChanged]);

  const handleFilterChanged = useCallback((params: any) => {
    if (mode !== 'server' && mode !== 'infinite') return;
    const filterModel = params.api.getFilterModel();
    onFilterChanged?.(filterModel);
  }, [mode, onFilterChanged]);

  // ===== Infinite 모드 Datasource 설정 =====
  const getInfiniteDatasource = useCallback(() => {
    if (!onLoadData) return undefined;

    return {
      getRows: async (params: any) => {
        const { startRow, endRow, sortModel, filterModel } = params;
        try {
          const result = await onLoadData({
            startRow,
            endRow,
            sortModel,
            filterModel,
          });
          params.successCallback(result.rows, result.totalCount);
        } catch (error) {
          console.error('Infinite mode load error:', error);
          params.failCallback();
        }
      },
    };
  }, [onLoadData]);

  // ===== 상태 저장 (localStorage) =====
  useEffect(() => {
    if (!saveState || !stateKey || !gridApiRef.current) return;

    const api = gridApiRef.current;
    const columnApi = api.getColumnApi();

    // 저장된 상태 복원
    const savedState = localStorage.getItem(`grid-state-${stateKey}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.columnState) columnApi.applyColumnState(parsed.columnState);
        if (parsed.sortModel) api.setSortModel(parsed.sortModel);
        if (parsed.filterModel) api.setFilterModel(parsed.filterModel);
      } catch (e) {
        console.warn('Failed to restore grid state:', e);
      }
    }

    // 상태 변경 시 저장
    const saveCurrentState = () => {
      const state = {
        columnState: columnApi.getColumnState(),
        sortModel: api.getSortModel(),
        filterModel: api.getFilterModel(),
      };
      localStorage.setItem(`grid-state-${stateKey}`, JSON.stringify(state));
    };

    // 이벤트 리스너 등록
    api.addEventListener('columnMoved', saveCurrentState);
    api.addEventListener('columnResized', saveCurrentState);
    api.addEventListener('sortChanged', saveCurrentState);
    api.addEventListener('filterChanged', saveCurrentState);

    return () => {
      api.removeEventListener('columnMoved', saveCurrentState);
      api.removeEventListener('columnResized', saveCurrentState);
      api.removeEventListener('sortChanged', saveCurrentState);
      api.removeEventListener('filterChanged', saveCurrentState);
    };
  }, [saveState, stateKey]);

  // ===== 로딩 UI =====
  if (loading) {
    return loadingComponent || (
      <div className="flex items-center justify-center h-60 border border-slate-200 rounded-md bg-slate-50">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="material-icons animate-spin">sync</span>
          <span className="text-sm">불러오는 중...</span>
        </div>
      </div>
    );
  }

  // ===== 빈 데이터 UI =====
  if ((!rows || rows.length === 0) && mode !== 'infinite') {
    return emptyComponent || (
      <div className="flex items-center justify-center h-60 border border-slate-200 rounded-md bg-white">
        <span className="text-sm text-slate-400">{emptyMessage}</span>
      </div>
    );
  }

  // ===== AG Grid 렌더링 =====
  return (
    <div className="ag-theme-custom w-full border border-slate-200 rounded-md overflow-hidden">
      <AgGridReact
        // ===== 기본 설정 =====
        theme="legacy"
        columnDefs={columns}
        rowData={mode === 'infinite' ? undefined : rows}
        pagination={pagination}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        rowHeight={rowHeight}
        suppressMovableColumns={true}
        suppressCellFocus={true}
        rowClass="hover:bg-slate-50/80 transition-colors"
        domLayout="autoHeight"
        
        // ===== 모드별 설정 =====
        rowModelType={getRowModelType()}
        datasource={mode === 'infinite' ? getInfiniteDatasource() : undefined}
        
        // ===== 컬럼 기본값 =====
        defaultColDef={getDefaultColDef()}
        
        // ===== 이벤트 =====
        onGridReady={(params) => {
          gridApiRef.current = params.api;
          onGridReady?.(params);
        }}
        onSortChanged={handleSortChanged}
        onFilterChanged={handleFilterChanged}
        
        // ===== 사용자 정의 옵션 =====
        {...gridOptions}
      />
    </div>
  );
}