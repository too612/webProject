/**
 * File Name   : sermonsPage
 * Description : 주일설교 목록/상세/작성 화면
 * -----------------------------------------------------------------------------
 * pastorPage 기준으로 패널은 rounded-none, 주요 버튼은 rounded-md, 섹션 간격은 space-y-5로 통일한다.
 *
 * [개선 사항]
 * - date 입력 필드: react-datepicker 로 교체 (한국어 로케일, YYYY-MM-DD 포맷)
 * - 상세 조회 화면: 메타데이터 영역을 카드형 그리드(라벨 muted 소형 + 값 굵고 크게)로 개선
 * - worshipType: useState setter 미사용 → const 로 변경
 * - loadData 중복 제거: useCallback 으로 통합
 * - 상태 뱃지: 목록/상세 모두 commentCount 기준으로 일치시킴
 * - CommentItem 최대 depth 제한 (MAX_COMMENT_DEPTH 이상이면 답글 버튼 숨김)
 * - 전반적인 form 입력 필드 className 통일 (fieldCls)
 * - 비밀번호 불일치 인라인 경고 (실시간)
 */

import { FormEvent, Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Attachment, useAttachment, attachmentApi } from '../../../common/attachment';
import { CommentSection } from '../../../common/comment';
import EditorViewer from '../../../common/editor/editorViewer';
import { sermonsApi } from './sermonsApi';
import { SERMONS_BASE_PATH } from './sermonsModel';
import { systemConfigCodeApi } from '../../../system/config/code/codeApi';
import type { BoardItem as BoardDto, FileItem as FileDto } from '../../../common/board/board.types';
import type { SystemConfigCodeRow } from '../../../system/config/code/codeModel';

/* ──────────────────────────────────────────────────────────────────────────
 * 타입 정의
 * ────────────────────────────────────────────────────────────────────────── */

type BoardItem = {
  id: number | string;
  rowNum: number;
  worshipType: string;
  title: string;
  author: string;
  date: string;
  views: number;
  commentCount: number;
  secret?: boolean;
  hasFile?: boolean;
  depth: number;
};

type WorshipTypeOption = {
  value: string;
  label: string;
};

/* ──────────────────────────────────────────────────────────────────────────
 * 상수
 * ────────────────────────────────────────────────────────────────────────── */

const VIEW_PATH = `${SERMONS_BASE_PATH}/view`;
const WRITE_PATH = `${SERMONS_BASE_PATH}/write`;
const SERMONS_LIST_PATH = SERMONS_BASE_PATH;

const DEFAULT_WORSHIP_TYPE_OPTIONS: WorshipTypeOption[] = [
  { value: 'SUNDAY', label: '주일예배' },
  { value: 'WEDNESDAY', label: '수요예배' },
  { value: 'DAWN', label: '새벽예배' },
  { value: 'SPECIAL', label: '특별예배' },
];

const DEFAULT_WORSHIP_TYPE_LABEL_MAP = DEFAULT_WORSHIP_TYPE_OPTIONS.reduce<Record<string, string>>(
  (acc, option) => { acc[option.value] = option.label; return acc; },
  {},
);

const LazyEditor = lazy(() => import('../../../common/editor/editor'));

/* ──────────────────────────────────────────────────────────────────────────
 * 유틸 함수
 * ────────────────────────────────────────────────────────────────────────── */

/** YYYY-MM-DD 형식으로 정규화. 이미 해당 포맷이면 그대로 반환 */
function normalizeDate(value: unknown): string {
  if (!value) return '-';
  const str = String(value);
  // ISO datetime (2024-05-19T00:00:00) → 날짜 부분만 추출
  return str.slice(0, 10);
}

function resolveWorshipTypeLabel(value: unknown): string {
  if (!value) return '-';
  const key = String(value);
  return DEFAULT_WORSHIP_TYPE_LABEL_MAP[key] ?? key;
}

/* ──────────────────────────────────────────────────────────────────────────
 * 공통 스타일 헬퍼
 * ────────────────────────────────────────────────────────────────────────── */

/** 폼 입력 필드 공통 className */
const fieldCls = 'w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white';

/* ──────────────────────────────────────────────────────────────────────────
 * 카드형 메타데이터 필드 컴포넌트
 * — 조회 화면에서 각 항목을 개별 카드(배경+border)로 표시한다.
 *   라벨: 소형 muted 텍스트 / 값: 굵고 선명하게 → 한눈에 파악 가능.
 * ────────────────────────────────────────────────────────────────────────── */

function MetaField({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div
      className={`rounded-md border border-slate-200 bg-white px-4 py-3 flex flex-col gap-1 ${
        wide ? 'sm:col-span-2' : ''
      }`}
    >
      <dt className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </dt>
      <dd className="text-[15px] font-semibold text-slate-800 leading-snug break-words">
        {value || '-'}
      </dd>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 상태 뱃지 컴포넌트
 * — 댓글 수 기준. 0이면 '답변 대기', 1 이상이면 '답변 완료'.
 * ────────────────────────────────────────────────────────────────────────── */

function StatusBadge({ commentCount }: { commentCount: number }) {
  const answered = commentCount > 0;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ${
        answered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}
    >
      {answered ? '완료' : '미답변'}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 날짜 입력 컴포넌트 — @mui/x-date-pickers 기반
 * — string(YYYY-MM-DD) ↔ Date 변환을 내부에서 처리.
 *   toISOString() 은 UTC 기준이라 로컬 날짜가 하루 밀릴 수 있으므로
 *   getFullYear/getMonth/getDate 로 직접 포맷한다.
 *   LocalizationProvider 는 이 컴포넌트 내부에 포함해 독립적으로 동작하게 한다.
 * ────────────────────────────────────────────────────────────────────────── */

function formatDateToString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateString(value: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function DateInput({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  const dateValue = parseDateString(value);

  const handleChange = (date: Date | null) => {
    onChange(date ? formatDateToString(date) : '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <MuiDatePicker
        value={dateValue}
        onChange={handleChange}
        format="yyyy-MM-dd"
        slotProps={{
          field: {
            id,
          },
          textField: {
            size: 'small',
            fullWidth: true,
            sx: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#fff',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#94a3b8' },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color-brand-primary, #5c6bc0)',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputBase-input': {
                padding: '8px 12px',
              },
              '& input::placeholder': {
                fontSize: '0.875rem',
                color: '#94a3b8',
                opacity: 1,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}

/****************************************************************************************************
 * SermonsPage — 목록 화면
 ****************************************************************************************************/

export default function SermonsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get('page') ?? '1');
  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam - 1 : 0);
  const [searchType, setSearchType] = useState(searchParams.get('searchType') ?? 'title');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '');
  const [inputKeyword, setInputKeyword] = useState(searchParams.get('keyword') ?? '');

  // setter 미사용 → const 로 처리
  const worshipType = searchParams.get('worshipType') ?? '';

  const [items, setItems] = useState<BoardDto[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [secretModal, setSecretModal] = useState<{ show: boolean; rqstNo: string; password: string }>({
    show: false, rqstNo: '', password: '',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await sermonsApi.getBoardList({
          page,
          searchType,
          keyword: keyword.trim() || undefined,
          worshipType: worshipType || undefined,
        });
        if (!mounted) return;
        setItems(data.items);
        setPageSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch {
        if (!mounted) return;
        setError('게시글 목록을 불러오지 못했습니다.');
        setItems([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page, searchType, keyword, worshipType]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(page + 1));
    if (searchType) params.set('searchType', searchType);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (worshipType) params.set('worshipType', worshipType);
    setSearchParams(params, { replace: true });
  }, [page, searchType, keyword, worshipType, setSearchParams]);

  const rows: BoardItem[] = items.map((item, index) => ({
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

  const onSecretConfirm = () => {
    navigate(`${VIEW_PATH}?rqstNo=${secretModal.rqstNo}&password=${encodeURIComponent(secretModal.password)}`);
    setSecretModal({ show: false, rqstNo: '', password: '' });
  };

  const pageButtons = totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i) : [0];

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
  };

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">

        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">설교정보</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              게시물 수: {totalElements || rows.length} | 페이지: {page + 1}/{Math.max(totalPages, 1)}
            </p>
          </div>
          <Link
            className="hidden sm:inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
            to={WRITE_PATH}
          >
            글쓰기
          </Link>
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-none px-4 py-3">{error}</div>
        )}

        {/* 테이블 */}
        <div className="overflow-x-auto rounded-none border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="hidden sm:table-cell w-[80px] px-4 py-3 font-medium whitespace-nowrap">번호</th>
                <th className="w-[10%] px-4 py-3 font-medium">예배구분</th>
                <th className="w-[38%] px-4 py-3 font-medium text-left">제목</th>
                <th className="w-[13%] px-4 py-3 font-medium">작성자</th>
                <th className="hidden sm:table-cell w-[13%] px-4 py-3 font-medium">작성일</th>
                <th className="hidden sm:table-cell w-[8%] px-4 py-3 font-medium">조회</th>
                <th className="w-[12%] px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">등록된 게시물이 없습니다.</td>
                </tr>
              )}
              {rows.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="hidden sm:table-cell px-4 py-3 text-center text-gray-500 whitespace-nowrap">{post.rowNum}</td>
                  <td className="px-4 py-3 text-center text-gray-500 text-xs whitespace-nowrap">{post.worshipType}</td>
                  <td className="px-4 py-3">
                    {/* 화살표만으로 답글 표현 */}
                    <div className="flex items-center">
                      {post.depth > 0 && (
                        <span className="material-icons mr-1 text-sm text-slate-400 shrink-0">subdirectory_arrow_right</span>
                      )}
                      {post.secret ? (
                        <button
                          type="button"
                          className="border-0 bg-transparent p-0 text-left text-brand-dark hover:text-brand-primary hover:underline inline-flex items-center gap-1"
                          onClick={() => setSecretModal({ show: true, rqstNo: String(post.id), password: '' })}
                        >
                          <span className="material-icons text-sm text-slate-400">lock</span>
                          {post.title}
                          {post.commentCount > 0 && (
                            <span className="text-[13px] text-red-500">[{post.commentCount}]</span>
                          )}
                          {post.hasFile && (
                            <span className="material-icons text-xs text-gray-500" title="첨부파일 있음">attach_file</span>
                          )}
                        </button>
                      ) : (
                        <Link
                          to={`${VIEW_PATH}?rqstNo=${post.id}`}
                          className="text-brand-dark hover:text-brand-primary hover:underline inline-flex items-center gap-1"
                        >
                          {post.title}
                          {post.commentCount > 0 && (
                            <span className="text-[13px] text-red-500">[{post.commentCount}]</span>
                          )}
                          {post.hasFile && (
                            <span className="material-icons text-xs text-gray-500" title="첨부파일 있음">attach_file</span>
                          )}
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.author}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-center text-gray-400 text-xs">{post.date}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-center text-gray-400 text-xs">{post.views}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge commentCount={post.commentCount} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 모바일 글쓰기 버튼 */}
        <div className="sm:hidden flex justify-end">
          <Link
            className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
            to={WRITE_PATH}
          >
            글쓰기
          </Link>
        </div>

        {/* 페이지네이션 */}
        <div className="flex gap-1.5 justify-center">
          {pageButtons.map((buttonPage) => (
            <button
              key={buttonPage}
              type="button"
              className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                buttonPage === page ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
              onClick={() => setPage(buttonPage)}
            >
              {buttonPage + 1}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <form className="w-full space-y-3" onSubmit={onSearch}>
          <div className="flex items-center gap-2">
            <select
              className="w-[112px] shrink-0 border border-slate-200 rounded-md px-2.5 py-2 text-sm text-slate-700"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="title">제목</option>
              <option value="rqstId">작성자</option>
              <option value="cont">내용</option>
            </select>
            <input
              type="text"
              className="min-w-0 flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm"
              placeholder="검색어를 입력하세요."
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
            />
            <button
              className="shrink-0 bg-slate-100 text-slate-700 rounded-md px-4 py-2.5 text-sm hover:bg-slate-200 transition-colors"
              type="submit"
            >
              검색
            </button>
          </div>
        </form>
      </div>

      {/* 비밀글 모달 */}
      {secretModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none border border-slate-200 shadow-xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-brand-dark mb-4">비밀글 확인</h4>
            <p className="mb-3 text-[13px] text-gray-600">비밀번호를 입력하세요.</p>
            <input
              className={`${fieldCls} mb-4`}
              type="password"
              value={secretModal.password}
              onChange={(e) => setSecretModal((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="비밀번호"
              onKeyDown={(e) => { if (e.key === 'Enter') onSecretConfirm(); }}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm font-semibold"
                onClick={onSecretConfirm}
              >
                확인
              </button>
              <button
                type="button"
                className="bg-slate-100 text-slate-700 rounded-md px-4 py-2.5 text-sm font-medium"
                onClick={() => setSecretModal({ show: false, rqstNo: '', password: '' })}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
/****************************************************************************************************
 * SermonsViewPage — 상세 조회 화면
 ****************************************************************************************************/

export function SermonsViewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rqstNo = searchParams.get('rqstNo') ?? '';
  const passwordParam = searchParams.get('password') ?? '';

  const [board, setBoard] = useState<BoardDto | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(Boolean(rqstNo));
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);
  const [password, setPassword] = useState('');

  // useCallback 으로 통합 → 댓글 저장 후 재호출 가능
  const loadData = useCallback(async () => {
    if (!rqstNo) return;
    try {
      const data = await sermonsApi.getBoardView(rqstNo, passwordParam);
      setBoard(data.board);
      setCommentCount(data.commentCount);
    } catch {
      setError('게시글을 불러오지 못했습니다.');
    }
  }, [rqstNo, passwordParam]);

  useEffect(() => {
    if (!rqstNo) { setLoading(false); return; }
    let mounted = true;
    setLoading(true);
    setError('');
    loadData().finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [rqstNo, loadData]);

  const openPasswordModal = (nextAction: 'edit' | 'delete') => {
    setAction(nextAction);
    setPassword('');
    setShowPasswordModal(true);
  };

  const onConfirm = async () => {
    if (!action || !rqstNo) { setShowPasswordModal(false); return; }

    if (board?.password) {
      const isValid = await sermonsApi.checkPassword(rqstNo, password);
      if (!isValid) { alert('비밀번호가 올바르지 않습니다.'); return; }
    }

    if (action === 'edit') {
      navigate(`${SERMONS_LIST_PATH}/write?rqstNo=${rqstNo}`);
      return;
    }

    try {
      await sermonsApi.deleteBoard(rqstNo);
      alert('게시글이 삭제되었습니다.');
      navigate(SERMONS_LIST_PATH);
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  /* 조회 화면 출력용 값 — 모두 정제된 문자열로 변환 */
  const resolvedTitle = board?.title ?? '주일설교';
  const resolvedAuthor = board?.rqstId ?? '-';
  const resolvedDateTime = board?.insDt ? String(board.insDt).replace('T', ' ').slice(0, 16) : '-';
  const resolvedViews = board?.views ?? 0;
  const resolvedContent = board?.cont ?? '';
  const resolvedPreacherName = board?.preacherName ?? '-';
  const resolvedScriptureReference = board?.scriptureReference ?? '-';
  // ★ 날짜: normalizeDate 로 YYYY-MM-DD 형식만 표시 (T 이하 제거)
  const resolvedSermonDate = normalizeDate(board?.sermonDate);
  const resolvedWorshipType = resolveWorshipTypeLabel(board?.worshipType);
  const fileList: FileDto[] = board?.fileList ?? [];

  return (
    <section className="space-y-5">
      <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">

        {/* 게시글 헤더 */}
        <header className="pb-5 mb-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{resolvedTitle}</h2>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons text-base">person</span>{resolvedAuthor}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons text-base">calendar_today</span>{resolvedDateTime}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons text-base">visibility</span>{resolvedViews}회
              </div>
            </div>
            <StatusBadge commentCount={commentCount} />
          </div>
        </header>

        {error && <div className="text-sm text-red-600 bg-red-50 rounded-none px-4 py-3 mb-4">{error}</div>}
        {loading && <div className="text-sm text-gray-400 text-center py-8">불러오는 중...</div>}

        {/* ★ 설교 메타데이터 — 카드형 그리드 (라벨 소형 muted + 값 굵고 선명) */}
        <section className="mt-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MetaField label="설교자" value={resolvedPreacherName} />
            <MetaField label="예배구분" value={resolvedWorshipType} />
            <MetaField label="설교일자" value={resolvedSermonDate} />
            <MetaField label="성경본문" value={resolvedScriptureReference} wide />
          </dl>
        </section>

        {/* 본문 */}
        <section className="py-4 text-gray-700">
          <EditorViewer value={resolvedContent} emptyText="등록된 내용이 없습니다." />
        </section>

        {/* ★ 첨부파일 — Attachment 컴포넌트 readOnly 모드 */}
        <Attachment
          readOnly
          existingFiles={fileList.map((f) => ({
            fileId: f.fileId,
            orgFileNm: f.orgFileNm ?? f.filename,
            fileSize: f.fileSize ?? 0,
          }))}
          buildDownloadUrl={(fileId) => `/api/common/files/${fileId}/download`}
          buildZipUrl={fileList.length > 1 ? `/api/common/files/downloadZip?pgmId=sermon&refId=${rqstNo}` : undefined}
        />

        <CommentSection pgmId="SERMONS" refId={rqstNo} />

        {/* 하단 액션 버튼 */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-0">
          <Link
            className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-[#4e5caf] transition-colors"
            to={SERMONS_LIST_PATH}
          >
            목록
          </Link>
          {rqstNo && (
            <button
              type="button"
              className="inline-flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
              onClick={() => navigate(`${SERMONS_LIST_PATH}/write?parentNo=${rqstNo}`)}
            >
              답글 작성
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
            onClick={() => openPasswordModal('edit')}
          >
            수정
          </button>
          <button
            type="button"
            className="inline-flex items-center bg-red-50 text-red-600 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-red-100 transition-colors"
            onClick={() => openPasswordModal('delete')}
          >
            삭제
          </button>
        </div>
      </article>

      {/* 비밀번호 확인 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-brand-dark mb-4">비밀번호 확인</h4>
            <input
              className={`${fieldCls} mb-4`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(); }}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm font-medium"
                onClick={onConfirm}
              >
                확인
              </button>
              <button
                type="button"
                className="bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium"
                onClick={() => setShowPasswordModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/****************************************************************************************************
 * SermonsWritePage — 작성/수정 화면
 ****************************************************************************************************/

export function SermonsWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rqstNo = searchParams.get('rqstNo') ?? '';
  const parentNo = searchParams.get('parentNo') ?? '';
  const isEdit = Boolean(rqstNo);
  const isReply = Boolean(parentNo);

  const [form, setForm] = useState({
    title: '',
    author: '',
    preacherName: '',
    scriptureReference: '',
    sermonDate: '',
    worshipType: 'SUNDAY',
    content: '',
    secret: false,
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [worshipTypeOptions, setWorshipTypeOptions] = useState<WorshipTypeOption[]>(DEFAULT_WORSHIP_TYPE_OPTIONS);
  const attachments = useAttachment();
  const resetAttachments = attachments.reset;

  /* 예배구분 코드 로드 */
  useEffect(() => {
    let mounted = true;
    const loadWorshipTypeOptions = async () => {
      try {
        const result = await systemConfigCodeApi.getCodeList({ page: 0, size: 100, groupCode: 'WORSHIP_TYPE' });
        if (!mounted) return;
        const mapped = (result.items ?? [])
          .map((row) => {
            const item = row as SystemConfigCodeRow;
            const value = String(item.codeValue ?? '').trim();
            const label = String(item.codeName ?? '').trim();
            return value && label ? { value, label } : null;
          })
          .filter((item): item is WorshipTypeOption => item !== null);
        if (mapped.length > 0) setWorshipTypeOptions(mapped);
      } catch {
        if (mounted) setWorshipTypeOptions(DEFAULT_WORSHIP_TYPE_OPTIONS);
      }
    };
    loadWorshipTypeOptions();
    return () => { mounted = false; };
  }, []);

  /* 수정/답글 시 기존 데이터 로드 */
  useEffect(() => {
    if (!isEdit && !isReply) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = isReply
          ? await sermonsApi.getReplyForm(parentNo)
          : await sermonsApi.getWriteForm(rqstNo);
        if (!mounted || !data) return;
        setForm((prev) => ({
          ...prev,
          title: data.title ?? '',
          author: data.rqstId ?? '',
          preacherName: data.preacherName ?? '',
          scriptureReference: data.scriptureReference ?? '',
          // ★ 날짜: normalizeDate 로 YYYY-MM-DD 형식으로 정제
          sermonDate: normalizeDate(data.sermonDate),
          worshipType: data.worshipType ?? 'SUNDAY',
          content: data.cont ?? '',
          secret: data.secret === 'Y',
          password: '',
          confirmPassword: '',
        }));
        resetAttachments(
          (data.fileList as FileDto[] | undefined)?.map((file) => ({
            fileId: file.fileId,
            orgFileNm: file.orgFileNm ?? file.filename,
            fileSize: file.fileSize,
          })) ?? [],
        );
      } catch {
        alert('수정할 설교를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isEdit, isReply, parentNo, rqstNo, resetAttachments]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.content || !form.password) {
      alert('필수 항목을 입력해 주세요.');
      return;
    }
    if (form.password.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // ★ 날짜 검증: 입력하지 않아도 되지만, 입력했다면 YYYY-MM-DD 형식 준수
    if (form.sermonDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.sermonDate)) {
      alert('설교일자는 YYYY-MM-DD 형식으로 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        rqstNo: rqstNo || undefined,
        parentNo: parentNo || undefined,
        title: form.title,
        cont: form.content,
        rqstId: form.author,
        preacherName: form.preacherName,
        scriptureReference: form.scriptureReference,
        sermonDate: form.sermonDate,
        worshipType: form.worshipType,
        secret: form.secret ? 'Y' : 'N',
        password: form.password,
      };

      let savedRqstNo = rqstNo;

      if (isEdit) {
        await sermonsApi.updateBoard(payload);
      } else {
        const result = await sermonsApi.saveBoard(payload);
        // 신규 등록 시 서버에서 발급된 rqstNo 획득
        savedRqstNo = result?.rqstNo ?? rqstNo;
      }

      // ★ 파일 삭제 — 공통 파일 API
      await Promise.all(
        attachments.deletedFileIds.map((fileId) => attachmentApi.remove(fileId))
      );

      // ★ 파일 업로드 — 공통 파일 API (pgmId=sermon, refId=게시글번호)
      if (attachments.newFiles.length > 0 && savedRqstNo) {
        await Promise.all(
          attachments.newFiles.map((file) =>
            attachmentApi.upload(file, 'sermon', savedRqstNo)
          )
        );
      }

      alert(isEdit ? '설교 수정이 완료되었습니다.' : isReply ? '답글이 등록되었습니다.' : '설교 등록이 완료되었습니다.');
      navigate(SERMONS_LIST_PATH);
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-5">
      <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">
        <header className="pb-4 mb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">
            {isReply ? '설교 답글 작성' : isEdit ? '설교 수정' : '설교 작성'}
          </h2>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">

          {/* 비밀글 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀글</label>
            <label htmlFor="is-secret-check" className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                id="is-secret-check"
                type="checkbox"
                checked={form.secret}
                onChange={(e) => setForm((prev) => ({ ...prev, secret: e.target.checked }))}
              />
              비밀글로 등록
            </label>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              className={fieldCls}
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="제목을 입력해주세요."
            />
          </div>

          {/* 이름 / 설교자 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                className={fieldCls}
                value={form.author}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="이름을 입력해주세요."
                readOnly={isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설교자</label>
              <input
                className={fieldCls}
                value={form.preacherName}
                onChange={(e) => setForm((prev) => ({ ...prev, preacherName: e.target.value }))}
                placeholder="설교자 이름"
              />
            </div>
          </div>

          {/* 성경본문 / 설교일자 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성경본문</label>
              <input
                className={fieldCls}
                value={form.scriptureReference}
                onChange={(e) => setForm((prev) => ({ ...prev, scriptureReference: e.target.value }))}
                placeholder="예: 요한복음 3:16-21"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설교일자</label>
              {/* ★ MUI DatePicker 달력 UI */}
              <DateInput
                value={form.sermonDate}
                onChange={(v) => setForm((prev) => ({ ...prev, sermonDate: v }))}
              />
            </div>
          </div>

          {/* 예배구분 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예배구분</label>
            <select
              className={fieldCls}
              value={form.worshipType}
              onChange={(e) => setForm((prev) => ({ ...prev, worshipType: e.target.value }))}
            >
              {worshipTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용 <span className="text-red-500">*</span>
            </label>
            <div className="[&_.editor-resize-surface]:min-h-[22rem] [&_.editor-resize-surface_.ProseMirror]:min-h-[20rem]">
              <Suspense fallback={
                <div className="w-full min-h-40 border border-slate-300 rounded-none bg-white px-3 py-2.5 text-sm text-slate-500">
                  에디터 불러오는 중...
                </div>
              }>
                <LazyEditor
                  value={form.content}
                  onChange={(v) => setForm((prev) => ({ ...prev, content: v }))}
                  placeholder="내용을 입력해주세요."
                />
              </Suspense>
            </div>
          </div>

          {/* 첨부파일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">첨부파일</label>
            <Attachment
              existingFiles={attachments.existingFiles}
              newFiles={attachments.newFiles}
              onAdd={(files) => attachments.addFiles(files)}
              onRemoveExisting={(fileId) => attachments.removeExisting(fileId)}
              onRemoveNew={(index) => attachments.removeNew(index)}
              compact
            />
          </div>

          {/* 비밀번호 / 비밀번호 확인 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                className={fieldCls}
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="비밀번호 (4자 이상)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                className={fieldCls}
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="비밀번호 재입력"
              />
              {/* 비밀번호 불일치 인라인 경고 */}
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
          </div>

          {/* 폼 액션 버튼 */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-brand-primary text-white rounded-md px-6 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-40 transition-colors"
              disabled={loading}
            >
              {isEdit ? '수정하기' : '등록하기'}
            </button>
            <Link
              to={SERMONS_LIST_PATH}
              className="bg-gray-100 text-gray-700 rounded-md px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              취소
            </Link>
          </div>
        </form>
      </article>
    </section>
  );
}
