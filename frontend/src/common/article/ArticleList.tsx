import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { CornerDownRight, Lock, Paperclip } from "lucide-react";
import type { GridColumnDef } from "../../common/grid";
import { useArticle } from "./ArticleHook";
import { getArticleTemplateConfig } from "./config";
import { GalleryView } from "./list/GalleryView";
import { ActionButton, Button, ErrorMessage, Skeleton } from "../../common/ui";
import type { ArticleListQuery } from "./ArticleModel";

interface ArticleListProps {
  menuKey: string;
  templateCode?: string;
  basePath: string;
  embedded?: boolean;
  middleColumns?: GridColumnDef[];
  onSecretClick?: (articleId: number, password?: string) => void;
  onExcelDownload?: () => void;
  onGalleryItemClick?: (item: any, allItems: any[]) => void;
  onGalleryEditClick?: (item: any) => void;
  onGalleryDeleteClick?: (item: any) => void;
  onReorderSlides?: (items: any[]) => void;
  enableDragDrop?: boolean;
  refreshKey?: number;
  headerExtra?: ReactNode;
  queryParams?: Partial<ArticleListQuery>;
  hideDefaultWriteButton?: boolean;
}

type BasicCellParams = {
  data: any;
  value: unknown;
  node: {
    rowIndex: number;
  };
};

function getBasicCellParams(
  column: GridColumnDef,
  row: any,
  rowIndex: number,
): BasicCellParams {
  const field = typeof column.field === "string" ? column.field : undefined;
  const baseValue = field ? row?.[field] : undefined;
  const value =
    typeof column.valueGetter === "function"
      ? column.valueGetter({
          data: row,
          value: baseValue,
          node: { rowIndex },
        } as any)
      : baseValue;

  return {
    data: row,
    value,
    node: { rowIndex },
  };
}

function getColumnClassName(
  className: GridColumnDef["cellClass"] | GridColumnDef["headerClass"],
  params: BasicCellParams,
): string {
  if (typeof className === "function") {
    const resolvedClassName = className(params as any);
    return Array.isArray(resolvedClassName)
      ? resolvedClassName.join(" ")
      : (resolvedClassName ?? "");
  }

  return typeof className === "string" ? className : "";
}

function getColumnStyle(column: GridColumnDef) {
  if (typeof column.width === "number") {
    return { width: `${column.width}px`, minWidth: `${column.width}px` };
  }

  if (typeof column.width === "string") {
    return { width: column.width, minWidth: column.width };
  }

  return undefined;
}

function renderBasicCell(column: GridColumnDef, row: any, rowIndex: number) {
  const params = getBasicCellParams(column, row, rowIndex);

  if (typeof column.cellRenderer === "function") {
    return column.cellRenderer(params);
  }

  if (
    params.value === null ||
    params.value === undefined ||
    params.value === ""
  ) {
    return "-";
  }

  return params.value as ReactNode;
}

export function ArticleList({
  menuKey,
  templateCode,
  basePath,
  embedded = false,
  middleColumns = [],
  onSecretClick,
  onExcelDownload,
  onGalleryItemClick,
  onGalleryEditClick,
  onGalleryDeleteClick,
  onReorderSlides,
  enableDragDrop = false,
  refreshKey = 0,
  headerExtra,
  queryParams,
  hideDefaultWriteButton = false,
}: Readonly<ArticleListProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const config = getArticleTemplateConfig(templateCode || "DEFAULT");
  const { list } = config;

  const initialKeyword = searchParams.get("keyword") ?? "";
  const initialSearchType =
    searchParams.get("searchType") || list.searchFields[0]?.value || "title";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [inputKeyword, setInputKeyword] = useState(initialKeyword);
  const [searchType, setSearchType] = useState(initialSearchType);

  const {
    items,
    totalElements,
    totalPages,
    page,
    setPage,
    listLoading,
    listError,
    loadList,
  } = useArticle();

  const buildQuery = (nextPage: number, nextKeyword: string) => {
    const query: ArticleListQuery = {
      page: nextPage,
      menuKey,
      ...(queryParams || {}),
      searchType: searchType || undefined,
      keyword: nextKeyword.trim() || undefined,
    };

    if (templateCode) {
      query.templateCode = templateCode;
    }

    return query;
  };

  useEffect(() => {
    loadList(buildQuery(page, keyword));
  }, [
    page,
    menuKey,
    templateCode,
    searchType,
    keyword,
    loadList,
    refreshKey,
    queryParams,
  ]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page + 1));
    if (searchType) params.set("searchType", searchType);
    if (keyword.trim()) params.set("keyword", keyword.trim());
    setSearchParams(params, { replace: true });
  }, [page, searchType, keyword, setSearchParams]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputKeyword.trim();
    setKeyword(trimmed);
    setPage(0);
    loadList(buildQuery(0, trimmed));
  };

  const viewMode = list.viewMode || "grid";

  // ============================================================
  // 갤러리 모드
  // ============================================================
  if (viewMode === "gallery") {
    const handleItemClick =
      onGalleryItemClick ||
      ((item: any) => {
        window.location.href = `${basePath}/view?rqstNo=${item.articleId}`;
      });

    if (embedded) {
      if (listError) {
        return (
          <ErrorMessage
            message={listError}
            onRetry={() => loadList(buildQuery(page, keyword))}
          />
        );
      }

      return (
        <GalleryView
          items={items}
          config={config}
          loading={listLoading}
          onItemClick={handleItemClick}
          onEditClick={onGalleryEditClick}
          onDeleteClick={onGalleryDeleteClick}
          onReorder={onReorderSlides}
          enableDragDrop={enableDragDrop}
        />
      );
    }

    return (
      <section className="space-y-5">
        <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
          <div className="flex items-start justify-end gap-4 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {list.excelDownload && onExcelDownload && (
                <ActionButton
                  id="btn_excel_download"
                  action="excel"
                  onClick={onExcelDownload}
                />
              )}
              {!hideDefaultWriteButton &&
                list.buttons?.write?.visible !== false && (
                  <Button asChild>
                    <Link
                      id={list.buttons?.write?.id || "btn_write"}
                      to={`${basePath}/write`}
                    >
                      {list.buttons?.write?.label || "글쓰기"}
                    </Link>
                  </Button>
                )}
            </div>
          </div>

          {headerExtra}

          {listError && (
            <ErrorMessage
              message={listError}
              onRetry={() => loadList(buildQuery(page, keyword))}
            />
          )}

          <GalleryView
            items={items}
            config={config}
            loading={listLoading}
            onItemClick={handleItemClick}
            onEditClick={onGalleryEditClick}
            onDeleteClick={onGalleryDeleteClick}
            onReorder={onReorderSlides}
            enableDragDrop={enableDragDrop}
          />

          <div className="flex gap-1.5 justify-center pt-4">
            {Array.from({ length: totalPages > 0 ? totalPages : 1 }, (_, p) => (
              <Button
                key={p}
                type="button"
                variant={p === page ? "default" : "ghost"}
                className="h-9 w-9 p-0"
                onClick={() => setPage(p)}
              >
                {p + 1}
              </Button>
            ))}
          </div>

          {list.searchable && (
            <form
              className="w-full space-y-3 pt-4 border-t border-slate-100"
              onSubmit={onSearch}
            >
              <div className="flex items-center gap-2">
                <select
                  className="w-[112px] shrink-0 border border-slate-200 rounded-md px-2.5 py-2 text-sm text-slate-700"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  {list.searchFields.map(
                    (field: { value: string; label: string }) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ),
                  )}
                </select>
                <input
                  type="text"
                  className="min-w-0 flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm"
                  placeholder="검색어를 입력하세요."
                  value={inputKeyword}
                  onChange={(e) => setInputKeyword(e.target.value)}
                />
                <ActionButton
                  id={list.buttons?.search?.id || "btn_search"}
                  action="search"
                  type="submit"
                  loading={listLoading}
                  className="shrink-0 min-w-0"
                />
              </div>
            </form>
          )}
        </div>
      </section>
    );
  }

  // ============================================================
  // 일반 그리드 모드
  // ============================================================
  const pageSize = list.pageSize || 10;
  const hideColumns = list.hideColumns || [];

  const baseColumns: GridColumnDef[] = [
    {
      field: "rowNum",
      headerName: "번호",
      width: 80,
      headerClass: "text-center",
      cellClass: "text-center",
      sortable: false,
      filter: false,
      valueGetter: (params: any) =>
        totalElements - page * pageSize - params.node.rowIndex,
    },
    ...middleColumns,
    {
      field: "title",
      headerName: "제목",
      flex: 1,
      headerClass: "text-center",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const post = params.data;
        const iconStyle = {
          fontSize: "16px",
          lineHeight: 1,
          color: "var(--ag-secondary-foreground-color, #94a3b8)",
        };
        return (
          <div className="flex items-center gap-1 py-0.5">
            {post.depth > 0 && (
              <CornerDownRight className="h-4 w-4 shrink-0" style={iconStyle} />
            )}
            {post.isSecret ? (
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-left text-brand-dark hover:text-brand-primary hover:underline inline-flex items-center gap-1"
                onClick={() => {
                  if (onSecretClick) onSecretClick(post.articleId);
                  else toast.info("비밀글입니다.");
                }}
              >
                <Lock className="h-4 w-4 shrink-0" style={iconStyle} />
                {post.title}
                {post.commentCount > 0 && (
                  <span className="text-[13px] text-red-500">
                    [{post.commentCount}]
                  </span>
                )}
                {(post.fileCount ?? 0) > 0 && (
                  <Paperclip
                    className="h-4 w-4 shrink-0"
                    style={iconStyle}
                    aria-label="첨부파일 있음"
                  />
                )}
              </button>
            ) : (
              <Link
                to={`${basePath}/view?rqstNo=${post.articleId}`}
                className="text-brand-dark hover:text-brand-primary hover:underline inline-flex items-center gap-1"
              >
                {post.title}
                {post.commentCount > 0 && (
                  <span className="text-[13px] text-red-500">
                    [{post.commentCount}]
                  </span>
                )}
                {(post.fileCount ?? 0) > 0 && (
                  <Paperclip
                    className="h-4 w-4 shrink-0"
                    style={iconStyle}
                    aria-label="첨부파일 있음"
                  />
                )}
              </Link>
            )}
          </div>
        );
      },
    },
    {
      field: "authorId",
      headerName: "작성자",
      width: 120,
      headerClass: "text-center",
      cellClass: "text-center",
      sortable: false,
      filter: false,
    },
    {
      field: "createdAt",
      headerName: "작성일",
      width: 130,
      headerClass: "text-center",
      cellClass: "text-center",
      sortable: false,
      filter: false,
      valueGetter: (params: any) =>
        params.data.createdAt
          ? String(params.data.createdAt).slice(0, 10)
          : "-",
    },
    {
      field: "viewCount",
      headerName: "조회",
      width: 80,
      headerClass: "text-center",
      cellClass: "text-center",
      sortable: false,
      filter: false,
    },
  ];

  const statusColumn: GridColumnDef = {
    field: "commentCount",
    headerName: "상태",
    width: 100,
    headerClass: "text-center",
    cellClass: "text-center",
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      const answered = params.value > 0;
      return (
        <span
          className={`inline-block px-2.5 py-1 rounded-sm text-[10px] font-semibold leading-none ${answered ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
        >
          {answered ? "완료" : "미답변"}
        </span>
      );
    },
  };

  let allColumns = [...baseColumns];
  if (!hideColumns.includes("status")) allColumns.push(statusColumn);
  if (hideColumns.includes("views"))
    allColumns = allColumns.filter((col) => col.field !== "viewCount");
  if (hideColumns.includes("author"))
    allColumns = allColumns.filter((col) => col.field !== "authorId");

  if (listLoading) {
    const skeletonCols = 3 + middleColumns.length;
    return (
      <section className="space-y-5">
        <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {Array.from({ length: skeletonCols }).map((_, i) => (
                    <th key={i} className="px-3 py-3">
                      <Skeleton className="h-4 w-full" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: list.pageSize ?? 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: skeletonCols }).map((_, j) => (
                      <td key={j} className="px-3 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }
  if (listError)
    return (
      <ErrorMessage
        message={listError}
        onRetry={() => loadList(buildQuery(page, keyword))}
        className="m-4"
      />
    );

  const btn = list.buttons || {};

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-end gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {list.excelDownload && onExcelDownload && (
              <ActionButton
                id={btn.excel?.id || "btn_excel_download"}
                action="excel"
                label={btn.excel?.label}
                onClick={onExcelDownload}
              />
            )}
            {!hideDefaultWriteButton && btn.write?.visible !== false && (
              <Button asChild>
                <Link
                  id={btn.write?.id || "btn_write"}
                  to={`${basePath}/write`}
                >
                  {btn.write?.label || "글쓰기"}
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          {items.length > 0 ? (
            <table className="min-w-full border-collapse text-sm text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  {allColumns.map((column, columnIndex) => {
                    const headerParams = getBasicCellParams(column, {}, 0);
                    const headerClassName = getColumnClassName(
                      column.headerClass,
                      headerParams,
                    );

                    return (
                      <th
                        key={String(
                          column.field ?? column.headerName ?? columnIndex,
                        )}
                        className={`border-b border-slate-200 px-3 py-3 text-xs font-semibold text-slate-600 ${headerClassName}`.trim()}
                        scope="col"
                        style={getColumnStyle(column)}
                      >
                        {column.headerName ?? "-"}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {items.map((row, rowIndex) => (
                  <tr
                    key={row.articleId ?? `${row.title ?? "row"}-${rowIndex}`}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 transition-colors"
                  >
                    {allColumns.map((column, columnIndex) => {
                      const cellParams = getBasicCellParams(
                        column,
                        row,
                        rowIndex,
                      );
                      const cellClassName = getColumnClassName(
                        column.cellClass,
                        cellParams,
                      );
                      const isTitleColumn = column.field === "title";

                      return (
                        <td
                          key={String(
                            column.field ?? column.headerName ?? columnIndex,
                          )}
                          className={`px-3 py-3 align-middle ${isTitleColumn ? "" : "whitespace-nowrap"} ${cellClassName}`.trim()}
                          style={getColumnStyle(column)}
                        >
                          {renderBasicCell(column, row, rowIndex)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex h-60 items-center justify-center text-sm text-slate-400">
              등록된 게시물이 없습니다.
            </div>
          )}
        </div>

        <div className="sm:hidden flex justify-end">
          {btn.write?.visible !== false && (
            <Button asChild>
              <Link id={btn.write?.id || "btn_write"} to={`${basePath}/write`}>
                {btn.write?.label || "글쓰기"}
              </Link>
            </Button>
          )}
        </div>

        <div className="flex gap-1.5 justify-center">
          {Array.from({ length: totalPages > 0 ? totalPages : 1 }, (_, p) => (
            <Button
              key={p}
              type="button"
              variant={p === page ? "default" : "ghost"}
              className="h-9 w-9 p-0"
              onClick={() => setPage(p)}
            >
              {p + 1}
            </Button>
          ))}
        </div>

        {list.searchable && (
          <form className="w-full space-y-3" onSubmit={onSearch}>
            <div className="flex items-center gap-2">
              <select
                className="w-[112px] shrink-0 border border-slate-200 rounded-md px-2.5 py-2 text-sm text-slate-700"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                {list.searchFields.map(
                  (field: { value: string; label: string }) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ),
                )}
              </select>
              <input
                type="text"
                className="min-w-0 flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm"
                placeholder="검색어를 입력하세요."
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
              />
              <ActionButton
                id={btn.search?.id || "btn_search"}
                action="search"
                type="submit"
                loading={listLoading}
                className="shrink-0 min-w-0"
              />
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
