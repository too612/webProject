import { useCallback, useMemo, useRef } from "react";
import type { ColDef } from "ag-grid-community";
import DataGrid from "./grid";
import { rowNumberColumn } from "./erpGrid";
import type { GridProps } from "./gridModel";

const ERP_COLUMN_DEFAULTS = { filter: false };

export interface ErpDataGridProps<TData> extends Omit<GridProps<TData>, "mode" | "rows" | "pagination"> {
  readonly getRowId: (row: TData) => string;
  readonly onLoadData: NonNullable<GridProps<TData>["onLoadData"]>;
  readonly mobileHiddenColumns: readonly string[];
}

export function ErpDataGrid<TData>({
  columns, getRowId, mobileHiddenColumns,
  gridOptions, onGridReady, defaultColDef = ERP_COLUMN_DEFAULTS,
  ...props
}: ErpDataGridProps<TData>) {
  const numberedColumns = useMemo<ColDef<TData>[]>(
    () => [rowNumberColumn<TData>(), ...columns], [columns],
  );
  const resolvedDefaults = useMemo(() => ({ ...ERP_COLUMN_DEFAULTS, ...defaultColDef }), [defaultColDef]);
  const getIdRef = useRef(getRowId);
  getIdRef.current = getRowId;
  const resolveRowId = useCallback(({ data }: { data: TData }) => getIdRef.current(data), []);

  return (
    <div data-ui="erp-grid" className="min-w-0">
      <DataGrid
        {...props}
        mode="infinite"
        columns={numberedColumns}
        defaultColDef={resolvedDefaults}
        pagination={false}
        height={props.height ?? "min(65dvh, 640px)"}
        rowHeight={props.rowHeight ?? 52}
        cacheBlockSize={props.cacheBlockSize ?? 50}
        maxBlocksInCache={props.maxBlocksInCache ?? 6}
        onGridReady={onGridReady}
        gridOptions={{
          suppressMultiSort: true,
          ...gridOptions,
          getRowId: resolveRowId,
          onGridSizeChanged: (event) => {
            if (event.clientWidth > 0) event.api.setColumnsVisible([...mobileHiddenColumns], event.clientWidth >= 640);
            gridOptions?.onGridSizeChanged?.(event);
          },
        }}
      />
    </div>
  );
}
