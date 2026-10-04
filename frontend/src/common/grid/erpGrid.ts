import type { ColDef } from "ag-grid-community";

export type ErpColumnKind = "code" | "status" | "date" | "number" | "name" | "text";

export function erpColumn<TData>(
  kind: ErpColumnKind,
  definition: ColDef<TData>,
): ColDef<TData> {
  const textAlign =
    kind === "number"
      ? "right"
      : kind === "name" || kind === "text"
        ? "left"
        : "center";

  return { cellStyle: { textAlign }, ...definition };
}

export function rowNumberColumn<TData>(offset = 0): ColDef<TData> {
  return {
    colId: "rowNumber",
    headerName: "NO",
    width: 72,
    pinned: "left",
    sortable: false,
    filter: false,
    resizable: false,
    cellStyle: { textAlign: "center" },
    valueGetter: ({ node }) =>
      node?.rowIndex == null ? "" : offset + node.rowIndex + 1,
  };
}
