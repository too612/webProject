import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GridApi, GridOptions, GridReadyEvent, RowClassParams, IRowNode } from "ag-grid-community";

export function findCachedRow<TData>(
  api: Pick<GridApi<TData>, "forEachNode">,
  key: string,
  getKey: (row: TData) => string,
): IRowNode<TData> | null {
  let found: IRowNode<TData> | null = null;
  api.forEachNode((node) => {
    if (node.data && getKey(node.data) === key) found = node;
  });
  return found;
}

export function useGridDetail<TData>({
  selected, open, getKey, onSelect, onClose, queryKey,
}: {
  readonly selected: TData | null;
  readonly open: boolean;
  readonly getKey: (row: TData) => string;
  readonly onSelect: (row: TData) => void | Promise<void>;
  readonly onClose: () => void;
  readonly queryKey: unknown;
}) {
  const apiRef = useRef<GridApi<TData> | null>(null);
  const focus = useRef<{ key: string; colId: string } | null>(null);
  const latest = useRef({ selected, open, getKey, onSelect, onClose });
  latest.current = { selected, open, getKey, onSelect, onClose };
  const [neighbors, setNeighbors] = useState<{ previous: TData | null; next: TData | null }>({ previous: null, next: null });

  const refreshNeighbors = useCallback(() => {
    const api = apiRef.current;
    const { selected: row, getKey: keyOf } = latest.current;
    const node = api && !api.isDestroyed() && row ? findCachedRow(api, keyOf(row), keyOf) : null;
    const index = node?.rowIndex;
    setNeighbors({
      previous: api && index != null && index > 0 ? api.getDisplayedRowAtIndex(index - 1)?.data ?? null : null,
      next: api && index != null ? api.getDisplayedRowAtIndex(index + 1)?.data ?? null : null,
    });
  }, []);

  const onGridReady = useCallback((event: GridReadyEvent<TData>) => {
    apiRef.current = event.api;
    refreshNeighbors();
  }, [refreshNeighbors]);

  const openRow = useCallback((row: TData, colId?: string) => {
    const cell = apiRef.current?.getFocusedCell();
    focus.current = { key: latest.current.getKey(row), colId: colId ?? cell?.column.getColId() ?? "rowNumber" };
    void latest.current.onSelect(row);
  }, []);

  const restoreFocus = useCallback(() => {
    requestAnimationFrame(() => {
      const api = apiRef.current;
      if (!api || api.isDestroyed() || !focus.current) return;
      const node = findCachedRow(api, focus.current.key, latest.current.getKey) ??
        api.getRenderedNodes().find((row) => row.data);
      if (node?.rowIndex != null) {
        const colId = api.getColumn(focus.current.colId)?.isVisible() ? focus.current.colId :
          api.getAllDisplayedColumns().find((column) => column.getColId() !== "rowNumber")?.getColId() ?? "rowNumber";
        api.ensureIndexVisible(node.rowIndex);
        api.setFocusedCell(node.rowIndex, colId);
      }
    });
  }, []);

  const getRowClass = useCallback(({ data }: RowClassParams<TData>) => {
    const { selected: row, open: isOpen, getKey: keyOf } = latest.current;
    return data && row && isOpen && keyOf(data) === keyOf(row) ? "erp-detail-active" : undefined;
  }, []);

  const onSortChanged = useCallback(() => {
    focus.current = null;
    latest.current.onClose();
    refreshNeighbors();
  }, [refreshNeighbors]);

  useEffect(() => {
    const api = apiRef.current;
    if (api && !api.isDestroyed()) api.redrawRows();
    refreshNeighbors();
  }, [selected, open, refreshNeighbors]);

  useEffect(() => {
    focus.current = null;
    latest.current.onClose();
    const api = apiRef.current;
    if (api && !api.isDestroyed()) api.ensureIndexVisible(0, "top");
  }, [queryKey]);

  const onGridPreDestroyed = useCallback(() => { apiRef.current = null; }, []);
  const gridOptions = useMemo<GridOptions<TData>>(() => ({
    onGridReady, onGridPreDestroyed, getRowClass, onSortChanged,
    onModelUpdated: refreshNeighbors,
    onRowClicked: (event) => { if (event.data) openRow(event.data); },
    onCellKeyDown: (event) => {
      if (event.event?.target instanceof Element && event.event.target.closest("button, a, input, select, textarea")) return;
      if (event.event instanceof KeyboardEvent && event.event.key === "Enter" && event.data) {
        openRow(event.data, "column" in event ? event.column.getColId() : undefined);
      }
    },
  }), [onGridReady, onGridPreDestroyed, getRowClass, onSortChanged, refreshNeighbors, openRow]);
  const previous = () => { if (neighbors.previous) openRow(neighbors.previous); };
  const next = () => { if (neighbors.next) openRow(neighbors.next); };

  return {
    gridOptions,
    navigation: {
      canPrevious: Boolean(neighbors.previous), canNext: Boolean(neighbors.next),
      onPrevious: previous, onNext: next,
    },
    openRow, restoreFocus, getRowClass, onGridReady, onSortChanged,
    onGridPreDestroyed,
    onModelUpdated: refreshNeighbors,
    canPrevious: Boolean(neighbors.previous),
    canNext: Boolean(neighbors.next),
    previous, next,
  };
}
