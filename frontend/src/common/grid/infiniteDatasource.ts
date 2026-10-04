import type { IDatasource } from "ag-grid-community";
import type { GridDataState, GridLoadParams } from "./gridModel";
import { getApiErrorMessage } from "../api/apiError";

export const INITIAL_GRID_STATE: GridDataState = {
  phase: "initialLoading", totalCount: null, error: null, pendingRequests: 0,
};

export function blockToPage(startRow: number, endRow: number, maxSize = 100) {
  const size = endRow - startRow;
  if (!Number.isInteger(startRow) || !Number.isInteger(endRow) ||
    startRow < 0 || size <= 0 || size > maxSize || startRow % size !== 0) {
    throw new Error("목록 조회 블록 범위가 올바르지 않습니다.");
  }
  return { page: startRow / size, size };
}

export function createInfiniteDatasource<TData>(
  load: (params: GridLoadParams) => Promise<{ rows: TData[]; totalCount: number }>,
  onState: (state: GridDataState) => void,
): IDatasource {
  let active = true;
  let controller = new AbortController();
  let queryKey: string | null = null;
  let requests = 0;
  let totalCount: number | null = null;
  const errors = new Map<number, string>();

  const publish = () => {
    if (!active) return;
    const error = errors.values().next().value ?? null;
    onState({
      phase: error ? "error" : requests > 0
        ? totalCount === null ? "initialLoading" : "loadingMore"
        : totalCount === 0 ? "empty" : "ready",
      totalCount, error, pendingRequests: requests,
    });
  };

  return {
    destroy: () => {
      active = false;
      controller.abort();
    },
    getRows: async (params) => {
      const nextKey = JSON.stringify([params.sortModel, params.filterModel]);
      if (queryKey !== nextKey) {
        controller.abort();
        controller = new AbortController();
        queryKey = nextKey;
        requests = 0;
        totalCount = null;
        errors.clear();
      }
      const signal = controller.signal;
      requests += 1;
      publish();
      try {
        const result = await load({
          startRow: params.startRow, endRow: params.endRow,
          sortModel: params.sortModel, filterModel: params.filterModel, signal,
        });
        if (!active || signal.aborted) return;
        if (!Number.isSafeInteger(result.totalCount) || result.totalCount < 0 ||
          result.rows.length > params.endRow - params.startRow) {
          throw new Error("목록 조회 응답의 행 수 또는 전체 건수가 올바르지 않습니다.");
        }
        totalCount = result.totalCount;
        errors.delete(params.startRow);
        params.successCallback(result.rows, result.totalCount);
      } catch (cause) {
        if (!active || signal.aborted) return;
        errors.set(params.startRow, getApiErrorMessage(cause, "목록을 불러오지 못했습니다."));
        params.failCallback();
      } finally {
        if (active && !signal.aborted) {
          requests -= 1;
          publish();
        }
      }
    },
  };
}
