import { useState, useCallback } from 'react';
import type { GridApi } from 'ag-grid-community';

/**
 * 그리드 상태 관리 훅 (선택)
 * - 선택된 행, 정렬 상태, 필터 상태 등을 관리
 * - 필요에 따라 도메인별로 확장 가능
 */
export function useGrid() {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const onGridReady = useCallback((params: any) => {
    setGridApi(params.api);
  }, []);

  const onSelectionChanged = useCallback((params: any) => {
    const selected = params.api.getSelectedRows();
    setSelectedRows(selected);
  }, []);

  return {
    gridApi,
    selectedRows,
    onGridReady,
    onSelectionChanged,
  };
}