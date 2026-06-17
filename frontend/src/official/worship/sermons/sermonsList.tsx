/**
 * File Name   : sermonsList
 * Description : 설교 목록 페이지 (AG Grid 적용)
 * -----------------------------------------------------------------------------
 * useSermons Hook에서 목록 상태와 메서드를 가져와 UI를 렌더링한다.
 */

import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DataGrid } from '../../../common/grid';
import type { GridColumnDef } from '../../../common/grid';
import { useSermons } from './sermonsHook';
import { SERMONS_BASE_PATH } from './sermonsModel';
import type { SermonItem, SermonListItem } from './sermonsModel';

/* ──────────────────────────────────────────────────────────────────────────
 * 상수
 * ────────────────────────────────────────────────────────────────────────── */

const VIEW_PATH = `${SERMONS_BASE_PATH}/view`;
const WRITE_PATH = `${SERMONS_BASE_PATH}/write`;

const WORSHIP_TYPE_LABEL_MAP: Record<string, string> = {
  SUNDAY: '주일예배',
  WEDNESDAY: '수요예배',
  DAWN: '새벽예배',
  SPECIAL: '특별예배',
};

/* ──────────────────────────────────────────────────────────────────────────
 * 유틸 함수
 * ────────────────────────────────────────────────────────────────────────── */

function normalizeDate(value: unknown): string {
  if (!value) return '-';
  return String(value).slice(0, 10);
}

function resolveWorshipTypeLabel(value: unknown): string {
  if (!value) return '-';
  return WORSHIP_TYPE_LABEL_MAP[String(value)] ?? String(value);
}

/* ──────────────────────────────────────────────────────────────────────────
 * 상태 뱃지
 * ────────────────────────────────────────────────────────────────────────── */

function StatusBadge({ commentCount }: { commentCount: number }) {
  const answered = commentCount > 0;
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-sm text-[10px] font-semibold leading-none ${
        answered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}
    >
      {answered ? '완료' : '미답변'}
    </span>
  );
}

/****************************************************************************************************
 * SermonsList - 목록 페이지
 ****************************************************************************************************/

export default function SermonsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = Math.max(0, (Number(searchParams.get('page')) || 1) - 1);
  const initialSearchType = searchParams.get('searchType') ?? 'title';
  const initialKeyword = searchParams.get('keyword') ?? '';
  const initialWorshipType = searchParams.get('worshipType') ?? '';

  const [searchType, setSearchType] = useState(initialSearchType);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [inputKeyword, setInputKeyword] = useState(initialKeyword);
  const [worshipType] = useState(initialWorshipType);
  const [sortModel, setSortModel] = useState<Array<{ colId: string; sort: 'asc' | 'desc' | null }>>([]);

  const [secretModal, setSecretModal] = useState<{ show: boolean; rqstNo: string; password: string }>({
    show: false,
    rqstNo: '',
    password: '',
  });

  const {
    items,
    totalElements,
    totalPages,
    page,
    setPage,
    listLoading,
    listError,
    loadList,
    clearError,
  } = useSermons();

  /****************************************************************************************************
   * 데이터 로드
   ****************************************************************************************************/

  useEffect(() => {
    loadList({
      page,
      searchType,
      keyword: keyword.trim() || undefined,
      worshipType: worshipType || undefined,
      sortField: sortModel.length > 0 ? sortModel[0].colId : undefined,
      sortOrder: sortModel.length > 0 ? (sortModel[0].sort?.toUpperCase() as 'ASC' | 'DESC') : undefined,
    });
  }, [page, searchType, keyword, worshipType, sortModel]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(page + 1));
    if (searchType) params.set('searchType', searchType);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (worshipType) params.set('worshipType', worshipType);
    setSearchParams(params, { replace: true });
  }, [page, searchType, keyword, worshipType]);

  /****************************************************************************************************
   * 이벤트 핸들러
   ****************************************************************************************************/

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
    clearError();
  };

  const onSecretConfirm = () => {
    navigate(`${VIEW_PATH}?rqstNo=${secretModal.rqstNo}&password=${encodeURIComponent(secretModal.password)}`);
    setSecretModal({ show: false, rqstNo: '', password: '' });
  };

  const handleSortChanged = (newSortModel: Array<{ colId: string; sort: 'asc' | 'desc' | null }>) => {
    setSortModel(newSortModel);
    setPage(0);
  };

  /****************************************************************************************************
   * 데이터 가공 (AG Grid용)
   ****************************************************************************************************/

  const pageSize = 10;
  const rows: SermonListItem[] = items.map((item, index) => ({
    id: item.rqstNo ?? '',
    rowNum: totalElements - page * pageSize - index,
    worshipType: resolveWorshipTypeLabel(item.worshipType),
    title: item.title ?? '',
    author: item.rqstId ?? '-',
    date: normalizeDate(item.insDt),
    views: item.views ?? 0,
    commentCount: item.commentCount ?? 0,
    secret: item.secret === 'Y',
    hasFile: item.hasFile === true,
    depth: item.depth ?? 0,
  }));

  /****************************************************************************************************
   * AG Grid 컬럼 정의
   ****************************************************************************************************/

  const columnDefs: GridColumnDef[] = [
    { field: 'rowNum', headerName: '번호', width: 80, headerClass: 'text-center', cellClass: 'text-center', sortable: false, filter: false },
    { field: 'worshipType', headerName: '예배구분', width: 100, headerClass: 'text-center', cellClass: 'text-center', sortable: false, filter: false },
    {
      field: 'title',
      headerName: '제목',
      flex: 1,
      headerClass: 'text-center',
      sortable: true,
      filter: false,
      cellRenderer: (params: any) => {
        const post = params.data as SermonListItem;
        const iconStyle = { fontSize: '16px', lineHeight: 1, color: 'var(--ag-secondary-foreground-color, #94a3b8)' };
        return (
          <div className="flex items-center gap-1 py-0.5">
            {post.depth > 0 && <span className="material-icons shrink-0" style={iconStyle}>subdirectory_arrow_right</span>}
            {post.secret ? (
              <button type="button" className="border-0 bg-transparent p-0 text-left text-brand-dark hover:text-brand-primary hover:underline inline-flex items-center gap-1" onClick={() => setSecretModal({ show: true, rqstNo: String(post.id), password: '' })}>
                <span className="material-icons shrink-0" style={iconStyle}>lock</span>
                {post.title}
                {post.commentCount > 0 && <span className="text-[13px] text-red-500">[{post.commentCount}]</span>}
                {post.hasFile && <span className="material-icons shrink-0" style={iconStyle} title="첨부파일 있음">attach_file</span>}
              </button>
            ) : (
              <Link to={`${VIEW_PATH}?rqstNo=${post.id}`} className="text-brand-dark hover:text-brand-primary hover:underline inline-flex items-center gap-1">
                {post.title}
                {post.commentCount > 0 && <span className="text-[13px] text-red-500">[{post.commentCount}]</span>}
                {post.hasFile && <span className="material-icons shrink-0" style={iconStyle} title="첨부파일 있음">attach_file</span>}
              </Link>
            )}
          </div>
        );
      },
    },
    { field: 'author', headerName: '작성자', width: 120, headerClass: 'text-center', cellClass: 'text-center', sortable: true, filter: false },
    { field: 'date', headerName: '작성일', width: 130, headerClass: 'text-center', cellClass: 'text-center', sortable: true, filter: false },
    { field: 'views', headerName: '조회', width: 80, headerClass: 'text-center', cellClass: 'text-center', sortable: true, filter: false },
    { field: 'commentCount', headerName: '상태', width: 100, headerClass: 'text-center', cellClass: 'text-center', sortable: false, filter: false, cellRenderer: (params: any) => <StatusBadge commentCount={params.value} /> },
  ];

  const pageButtons = totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i) : [0];

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">설교정보</h2>
            <p className="text-sm text-gray-600 leading-relaxed">게시물 수: {totalElements || rows.length} | 페이지: {page + 1}/{Math.max(totalPages, 1)}</p>
          </div>
          <Link className="hidden sm:inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors" to={WRITE_PATH}>글쓰기</Link>
        </div>

        {listError && <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-none px-4 py-3">{listError}</div>}

        <DataGrid mode="server" columns={columnDefs} rows={rows} loading={listLoading} pagination={false} rowHeight={44} totalCount={totalElements} onSortChanged={handleSortChanged} defaultColDef={{ sortable: true, filter: false }} emptyMessage="등록된 게시물이 없습니다." />

        <div className="sm:hidden flex justify-end">
          <Link className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors" to={WRITE_PATH}>글쓰기</Link>
        </div>

        <div className="flex gap-1.5 justify-center">
          {pageButtons.map((buttonPage) => (
            <button key={buttonPage} type="button" className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${buttonPage === page ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`} onClick={() => setPage(buttonPage)}>{buttonPage + 1}</button>
          ))}
        </div>

        <form className="w-full space-y-3" onSubmit={onSearch}>
          <div className="flex items-center gap-2">
            <select className="w-[112px] shrink-0 border border-slate-200 rounded-md px-2.5 py-2 text-sm text-slate-700" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="title">제목</option><option value="rqstId">작성자</option><option value="cont">내용</option>
            </select>
            <input type="text" className="min-w-0 flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm" placeholder="검색어를 입력하세요." value={inputKeyword} onChange={(e) => setInputKeyword(e.target.value)} />
            <button className="shrink-0 bg-slate-100 text-slate-700 rounded-md px-4 py-2.5 text-sm hover:bg-slate-200 transition-colors" type="submit">검색</button>
          </div>
        </form>
      </div>

      {secretModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none border border-slate-200 shadow-xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-brand-dark mb-4">비밀글 확인</h4>
            <p className="mb-3 text-[13px] text-gray-600">비밀번호를 입력하세요.</p>
            <input className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white mb-4" type="password" value={secretModal.password} onChange={(e) => setSecretModal((prev) => ({ ...prev, password: e.target.value }))} placeholder="비밀번호" onKeyDown={(e) => { if (e.key === 'Enter') onSecretConfirm(); }} />
            <div className="flex gap-2 justify-end">
              <button type="button" className="bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm font-semibold" onClick={onSecretConfirm}>확인</button>
              <button type="button" className="bg-slate-100 text-slate-700 rounded-md px-4 py-2.5 text-sm font-medium" onClick={() => setSecretModal({ show: false, rqstNo: '', password: '' })}>취소</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}