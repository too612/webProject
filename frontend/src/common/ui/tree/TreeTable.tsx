import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, type DragEvent, type ReactNode } from "react";
import type {
  TreeColumn,
  TreeItem,
  TreeMovePosition,
} from "./tree.types";
import { buildTreeRows } from "./treeUtils";

type TreeDropIntent = {
  targetId: string;
  position: TreeMovePosition;
};

type TreeTableProps<T> = {
  items: TreeItem<T>[];
  columns: TreeColumn<T>[];
  collapsed: Set<string>;
  selectedId?: string;
  onToggle?: (id: string) => void;
  onSelect?: (id: string) => void;
  onActivate?: (id: string) => void;
  onMove?: (
    sourceId: string,
    targetId: string | null,
    position: TreeMovePosition,
  ) => void | Promise<void>;
  renderTreeAction?: (item: T, selected: boolean) => ReactNode;
  emptyMessage?: string;
  rootDropMessage?: string;
  summaryLabel?: string;
  showSummary?: boolean;
  minWidthClassName?: string;
};

export default function TreeTable<T>({
  items,
  columns,
  collapsed,
  selectedId,
  onToggle,
  onSelect,
  onActivate,
  onMove,
  renderTreeAction,
  emptyMessage = "등록된 항목이 없습니다.",
  rootDropMessage = "여기에 놓으면 최상위 항목으로 이동합니다",
  summaryLabel = "개 항목",
  showSummary = true,
  minWidthClassName = "min-w-[42rem]",
}: TreeTableProps<T>) {
  const rows = buildTreeRows(items, collapsed);
  const [draggedId, setDraggedId] = useState("");
  const [dropIntent, setDropIntent] = useState<TreeDropIntent | null>(null);
  const [rootDropActive, setRootDropActive] = useState(false);
  const movable = Boolean(onMove);

  const finishDrag = () => {
    setDraggedId("");
    setDropIntent(null);
    setRootDropActive(false);
  };

  const moveTo = async (
    sourceId: string,
    targetId: string | null,
    position: TreeMovePosition,
  ) => {
    finishDrag();
    await onMove?.(sourceId, targetId, position);
  };

  const dropOnItem = async (
    event: DragEvent<HTMLTableRowElement>,
    targetId: string,
  ) => {
    event.preventDefault();
    const intent = dropIntent;
    const sourceId = draggedId;
    if (!intent || !sourceId || sourceId === targetId) {
      finishDrag();
      return;
    }
    await moveTo(sourceId, targetId, intent.position);
  };

  return (
    <div data-ui="tree-table" className="overflow-hidden rounded-md border border-slate-200 bg-white">
      {movable && (
        <div
          className={`border-b-2 border-dashed px-4 py-2 text-center text-xs font-semibold transition ${
            rootDropActive
              ? "border-violet-500 bg-violet-100 text-violet-700"
              : "border-slate-300 bg-slate-50 text-slate-500"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setRootDropActive(true);
            setDropIntent(null);
          }}
          onDragLeave={() => setRootDropActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            if (draggedId) void moveTo(draggedId, null, "inside");
            else finishDrag();
          }}
        >
          {rootDropMessage}
        </div>
      )}
      <div className="max-h-[36rem] overflow-auto">
        <table className={`w-full table-fixed border-collapse text-sm ${minWidthClassName}`}>
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`h-11 border-b border-slate-200 px-3 py-2 text-center ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const selected = row.id === selectedId;
              const expanded = row.hasChildren && !collapsed.has(row.id);
              const currentDropIntent = dropIntent?.targetId === row.id
                ? dropIntent.position
                : undefined;
              return (
                <tr
                  key={row.id}
                  data-tree-id={row.id}
                  draggable={movable}
                  tabIndex={onActivate ? 0 : undefined}
                  className={`border-b border-slate-200 transition-colors ${
                    onSelect ? "cursor-pointer" : ""
                  } ${
                    selected
                      ? "bg-sky-50 outline outline-1 -outline-offset-1 outline-sky-400"
                      : "hover:bg-slate-50"
                  } ${
                    currentDropIntent === "inside"
                      ? "outline outline-2 -outline-offset-2 outline-emerald-500"
                      : currentDropIntent === "before"
                        ? "border-t-2 border-t-sky-500"
                        : currentDropIntent === "after"
                          ? "border-b-2 border-b-sky-500"
                          : ""
                  } ${draggedId === row.id ? "opacity-50" : ""}`}
                  onClick={() => onSelect?.(row.id)}
                  onDoubleClick={() => onActivate?.(row.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && event.target === event.currentTarget && onActivate) {
                      event.preventDefault();
                      onActivate(row.id);
                    }
                  }}
                  onDragStart={(event) => {
                    if (!movable) return;
                    setDraggedId(row.id);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", row.id);
                  }}
                  onDragEnd={finishDrag}
                  onDragOver={(event) => {
                    if (!movable || draggedId === row.id) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    const rect = event.currentTarget.getBoundingClientRect();
                    const relativeY = (event.clientY - rect.top) / rect.height;
                    setRootDropActive(false);
                    setDropIntent({
                      targetId: row.id,
                      position: relativeY < 0.3
                        ? "before"
                        : relativeY > 0.7
                          ? "after"
                          : "inside",
                    });
                  }}
                  onDrop={(event) => {
                    void dropOnItem(event, row.id);
                  }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={column.type === "tree"
                        ? `relative h-[52px] px-3 py-2 ${column.cellClassName ?? ""}`
                        : `h-[52px] px-3 py-2 ${column.cellClassName ?? ""}`}
                    >
                      {column.type === "tree" ? (
                        <>
                          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                            {row.ancestorHasNextSibling.map((hasNextSibling, ancestorDepth) => (
                              hasNextSibling && ancestorDepth > 0 && (
                                <span
                                  key={ancestorDepth}
                                  data-tree-connector="ancestor"
                                  className="absolute -bottom-px top-0 w-px bg-slate-300"
                                  style={{ left: `${22 + (ancestorDepth - 1) * 24}px` }}
                                />
                              )
                            ))}
                            {row.depth > 0 && (
                              <>
                                <span
                                  data-tree-connector="branch"
                                  className="absolute top-0 w-px bg-slate-300"
                                  style={{
                                    bottom: row.isLastSibling ? "50%" : -1,
                                    left: `${22 + (row.depth - 1) * 24}px`,
                                  }}
                                />
                                <span
                                  data-tree-connector="elbow"
                                  className="absolute h-px w-6 bg-slate-300"
                                  style={{
                                    left: `${22 + (row.depth - 1) * 24}px`,
                                    top: "50%",
                                  }}
                                />
                              </>
                            )}
                            {expanded && (
                              <span
                                data-tree-connector="children"
                                className="absolute -bottom-px w-px bg-slate-300"
                                style={{
                                  left: `${22 + row.depth * 24}px`,
                                  top: "50%",
                                }}
                              />
                            )}
                          </div>
                          <div
                            className="relative flex min-w-0 items-center"
                            style={{ paddingLeft: `${row.depth * 24}px` }}
                          >
                            {row.hasChildren && onToggle ? (
                              <button
                                type="button"
                                aria-label={collapsed.has(row.id) ? "하위 항목 펼치기" : "하위 항목 접기"}
                                className="mr-1 flex size-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-slate-500 hover:bg-slate-100"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onToggle(row.id);
                                }}
                                onDoubleClick={(event) => event.stopPropagation()}
                              >
                                {collapsed.has(row.id)
                                  ? <ChevronRight className="size-3.5" />
                                  : <ChevronDown className="size-3.5" />}
                              </button>
                            ) : (
                              <span className="mr-1 size-5 shrink-0" />
                            )}
                            <span className="truncate font-medium text-slate-700">
                              {row.label}
                            </span>
                            {renderTreeAction?.(row.data, selected)}
                          </div>
                        </>
                      ) : (
                        column.render(row.data, index)
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-sm text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showSummary && <div data-ui="tree-summary" className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        {rows.length} / {items.length}{summaryLabel}
      </div>}
    </div>
  );
}
