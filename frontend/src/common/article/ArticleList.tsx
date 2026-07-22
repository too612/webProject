import React, { useEffect, useState, FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { DataGrid } from "../../common/grid";
import type { GridColumnDef } from "../../common/grid";
import { useArticle } from "./ArticleHook";
import { getArticleTemplateConfig } from "./config";
import { GalleryView } from "./list/GalleryView";
import { LoadingSpinner, ErrorMessage } from "../../common/ui";

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
  headerExtra?: React.ReactNode;
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
}: Readonly<ArticleListProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const config = getArticleTemplateConfig(templateCode || "DEFAULT");
  const { list, title } = config;

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

  useEffect(() => {
    const query: any = {
      page,
      menuKey,
      searchType: searchType || undefined,
      keyword: keyword.trim() || undefined,
    };
    if (templateCode) {
      query.templateCode = templateCode;
    }
    loadList(query);
  }, [page, menuKey, templateCode, searchType, keyword, loadList, refreshKey]);

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
    loadList({
      page: 0,
      menuKey,
      templateCode: templateCode || undefined,
      searchType: searchType || undefined,
      keyword: trimmed || undefined,
    });
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
            onRetry={() => loadList({ page, menuKey, templateCode })}
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
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
                {title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                게시물 수: {totalElements} | 페이지: {page + 1}/
                {Math.max(totalPages, 1)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {list.excelDownload && onExcelDownload && (
                <button
                  id="btn_excel_download"
                  className="inline-flex items-center bg-green-600 text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors"
                  onClick={onExcelDownload}
                >
                  <span className="material-icons text-sm mr-1">
                    table_chart
                  </span>
                  엑셀 다운로드
                </button>
              )}
              {list.buttons?.write?.visible !== false && (
                <Link
                  id={list.buttons?.write?.id || "btn_write"}
                  className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
                  to={`${basePath}/write`}
                >
                  {list.buttons?.write?.label || "글쓰기"}
                </Link>
              )}
            </div>
          </div>

          {headerExtra}

          {listError && (
            <ErrorMessage
              message={listError}
              onRetry={() => loadList({ page, menuKey, templateCode })}
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
              <button
                key={p}
                type="button"
                className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${p === page ? "bg-brand-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
                onClick={() => setPage(p)}
              >
                {p + 1}
              </button>
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
                <button
                  id={list.buttons?.search?.id || "btn_search"}
                  className="shrink-0 bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm hover:bg-[#4e5caf] transition-colors"
                  type="submit"
                >
                  {list.buttons?.search?.label || "검색"}
                </button>
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
              <span className="material-icons shrink-0" style={iconStyle}>
                subdirectory_arrow_right
              </span>
            )}
            {post.isSecret ? (
              <button
                type="button"
                className="border-0 bg-transparent p-0 text-left text-brand-dark hover:text-brand-primary hover:underline inline-flex items-center gap-1"
                onClick={() => {
                  if (onSecretClick) onSecretClick(post.articleId);
                  else alert("비밀글입니다.");
                }}
              >
                <span className="material-icons shrink-0" style={iconStyle}>
                  lock
                </span>
                {post.title}
                {post.commentCount > 0 && (
                  <span className="text-[13px] text-red-500">
                    [{post.commentCount}]
                  </span>
                )}
                {(post.fileCount ?? 0) > 0 && (
                  <span
                    className="material-icons shrink-0"
                    style={iconStyle}
                    title="첨부파일 있음"
                  >
                    attach_file
                  </span>
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
                  <span
                    className="material-icons shrink-0"
                    style={iconStyle}
                    title="첨부파일 있음"
                  >
                    attach_file
                  </span>
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

  if (listLoading) return <LoadingSpinner text="게시물을 불러오는 중..." />;
  if (listError)
    return (
      <ErrorMessage
        message={listError}
        onRetry={() => loadList({ page, menuKey, templateCode })}
        className="m-4"
      />
    );

  const btn = list.buttons || {};

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
              {title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              게시물 수: {totalElements} | 페이지: {page + 1}/
              {Math.max(totalPages, 1)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {list.excelDownload && onExcelDownload && (
              <button
                id={btn.excel?.id || "btn_excel_download"}
                className="inline-flex items-center bg-green-600 text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors"
                onClick={onExcelDownload}
              >
                <span className="material-icons text-sm mr-1">table_chart</span>
                {btn.excel?.label || "엑셀 다운로드"}
              </button>
            )}
            {btn.write?.visible !== false && (
              <Link
                id={btn.write?.id || "btn_write"}
                className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
                to={`${basePath}/write`}
              >
                {btn.write?.label || "글쓰기"}
              </Link>
            )}
          </div>
        </div>

        <DataGrid
          mode="basic"
          columns={allColumns}
          rows={items}
          loading={listLoading}
          pagination={false}
          rowHeight={44}
          totalCount={totalElements}
          defaultColDef={{ sortable: false, filter: false }}
          emptyMessage="등록된 게시물이 없습니다."
        />

        <div className="sm:hidden flex justify-end">
          {btn.write?.visible !== false && (
            <Link
              id={btn.write?.id || "btn_write"}
              className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
              to={`${basePath}/write`}
            >
              {btn.write?.label || "글쓰기"}
            </Link>
          )}
        </div>

        <div className="flex gap-1.5 justify-center">
          {Array.from({ length: totalPages > 0 ? totalPages : 1 }, (_, p) => (
            <button
              key={p}
              type="button"
              className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${p === page ? "bg-brand-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
              onClick={() => setPage(p)}
            >
              {p + 1}
            </button>
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
              <button
                id={btn.search?.id || "btn_search"}
                className="shrink-0 bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm hover:bg-[#4e5caf] transition-colors"
                type="submit"
              >
                {btn.search?.label || "검색"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
