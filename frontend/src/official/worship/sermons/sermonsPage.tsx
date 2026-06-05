/**
 * File Name   : sermonsPage
 * Description : 주일설교 목록/상세/작성 화면
 * -----------------------------------------------------------------------------
 * pastorPage 기준으로 패널은 rounded-none, 주요 버튼은 rounded-md, 섹션 간격은 space-y-5로 통일한다.
 */

import { FormEvent, Suspense, lazy, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Attachment, useAttachment } from '../../../common/attachment';
import { sermonsApi } from './sermonsApi';
import { SERMONS_API_BASE_PATH, SERMONS_BASE_PATH } from './sermonsModel';
import { systemConfigCodeApi } from '../../../system/config/code/codeApi';
import type { BoardItem as BoardDto, CommentItem as CommentDto, FileItem as FileDto } from '../../../common/board/board.types';
import type { SystemConfigCodeRow } from '../../../system/config/code/codeModel';

type BoardItem = {
  id: number | string;
  rowNum: number;
  worshipType: string;
  title: string;
  author: string;
  date: string;
  views: number;
  answered?: boolean;
  secret?: boolean;
  hasFile?: boolean;
  commentCount: number;
  depth: number;
};

type CommentFormState = {
  writer: string;
  content: string;
  secret: boolean;
  spoiler: boolean;
  password: string;
  parentCommentId: number | undefined;
};

type SortType = 'latest' | 'popular';

const VIEW_PATH = `${SERMONS_BASE_PATH}/view`;
const WRITE_PATH = `${SERMONS_BASE_PATH}/write`;
const SERMONS_LIST_PATH = SERMONS_BASE_PATH;
const SERMONS_DOWNLOAD_PATH = `/api${SERMONS_API_BASE_PATH}/download`;
const LazyEditor = lazy(() => import('../../../common/editor/editor'));

function resolveDownloadUrl(file: FileDto): string {
  if (file.downloadUrl && file.downloadUrl.trim()) {
    return file.downloadUrl;
  }
  return `${SERMONS_DOWNLOAD_PATH}?fileId=${encodeURIComponent(String(file.fileId))}`;
}

type WorshipTypeOption = {
  value: string;
  label: string;
};

const DEFAULT_WORSHIP_TYPE_OPTIONS: WorshipTypeOption[] = [
  { value: 'SUNDAY', label: '주일예배' },
  { value: 'WEDNESDAY', label: '수요예배' },
  { value: 'DAWN', label: '새벽예배' },
  { value: 'SPECIAL', label: '특별예배' },
];

const DEFAULT_WORSHIP_TYPE_LABEL_MAP = DEFAULT_WORSHIP_TYPE_OPTIONS.reduce<Record<string, string>>((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

/****************************************************************************************************
 * component method (목록 화면)
 ****************************************************************************************************/

export default function SermonsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam - 1 : 0);
  const [searchType, setSearchType] = useState(searchParams.get('searchType') ?? 'title');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '');
  const [inputKeyword, setInputKeyword] = useState(searchParams.get('keyword') ?? '');
  const [worshipType, setWorshipType] = useState(searchParams.get('worshipType') ?? '');
  const [items, setItems] = useState<BoardDto[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [secretModal, setSecretModal] = useState<{ show: boolean; rqstNo: string; password: string }>({ show: false, rqstNo: '', password: '' });

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

    return () => {
      mounted = false;
    };
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
    rowNum: totalElements - (page * pageSize) - index,
    worshipType: item.worshipType ? (DEFAULT_WORSHIP_TYPE_LABEL_MAP[String(item.worshipType)] ?? String(item.worshipType)) : '-',
    title: item.title ?? '',
    author: item.rqstId ?? '-',
    date: item.insDt ? String(item.insDt).slice(0, 10) : '-',
    views: item.views ?? 0,
    answered: (item.commentCount ?? 0) > 0,
    secret: item.secret === 'Y',
    hasFile: item.hasFile === true,
    commentCount: item.commentCount ?? 0,
    depth: item.depth ?? 0,
  }));

  const onSecretConfirm = () => {
    navigate(`${VIEW_PATH}?rqstNo=${secretModal.rqstNo}&password=${encodeURIComponent(secretModal.password)}`);
    setSecretModal({ show: false, rqstNo: '', password: '' });
  };

  const pageButtons = totalPages > 0 ? Array.from({ length: totalPages }, (_, index) => index) : [0];

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
  };

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">주일설교</h2>
            <p className="text-sm text-gray-600 leading-relaxed">게시물 수: {totalElements || rows.length} | 페이지: {page + 1}/{Math.max(totalPages, 1)}</p>
          </div>
          <Link className="hidden sm:inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors" to={WRITE_PATH}>글쓰기</Link>
        </div>

        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-none px-4 py-3">{error}</div>}

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
                    {post.secret ? (
                      <button
                        type="button"
                        className={`border-0 bg-transparent p-0 text-left text-brand-dark hover:text-brand-primary hover:underline${post.depth > 0 ? ' pl-5' : ''}`}
                        onClick={() => setSecretModal({ show: true, rqstNo: String(post.id), password: '' })}
                      >
                        {post.depth > 0 && <span className="material-icons reply-icon mr-1 align-middle text-base">subdirectory_arrow_right</span>}
                        <span className="material-icons lock-icon">lock</span>
                        {post.title}
                        {post.commentCount > 0 && <span className="ml-1 text-[13px] text-red-500">[{post.commentCount}]</span>}
                        {post.hasFile && <span className="material-icons ml-1 align-middle text-xs text-gray-500" title="첨부파일 있음">attach_file</span>}
                      </button>
                    ) : (
                      <Link to={`${VIEW_PATH}?rqstNo=${post.id}`} className={`text-brand-dark hover:text-brand-primary hover:underline${post.depth > 0 ? ' pl-5' : ''}`}>
                        {post.depth > 0 && <span className="material-icons reply-icon mr-1 align-middle text-base">subdirectory_arrow_right</span>}
                        {post.title}
                        {post.commentCount > 0 && <span className="ml-1 text-[13px] text-red-500">[{post.commentCount}]</span>}
                        {post.hasFile && <span className="material-icons ml-1 align-middle text-xs text-gray-500" title="첨부파일 있음">attach_file</span>}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.author}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-center text-gray-400 text-xs">{post.date}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-center text-gray-400 text-xs">{post.views}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ${post.answered === false ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {post.answered === false ? '미답변' : '완료'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden flex justify-end">
          <Link className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors" to={WRITE_PATH}>글쓰기</Link>
        </div>

        <div className="flex gap-1.5 justify-center">
          {pageButtons.map((buttonPage) => (
            <button
              key={buttonPage}
              type="button"
              className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${buttonPage === page ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setPage(buttonPage)}
            >
              {buttonPage + 1}
            </button>
          ))}
        </div>

        <form className="max-w-2xl mx-auto space-y-3 border border-slate-200 bg-slate-50/50 p-4" onSubmit={onSearch}>
          <div className="flex items-center gap-2">
            <select className="w-[112px] shrink-0 border border-slate-200 rounded-md px-2.5 py-2 text-sm text-slate-700" value={searchType} onChange={(event) => setSearchType(event.target.value)}>
              <option value="title">제목</option>
              <option value="rqstId">작성자</option>
              <option value="cont">내용</option>
            </select>
            <input
              type="text"
              className="min-w-0 flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm"
              placeholder="검색어를 입력하세요."
              value={inputKeyword}
              onChange={(event) => setInputKeyword(event.target.value)}
            />
            <button className="shrink-0 bg-slate-100 text-slate-700 rounded-md px-4 py-2.5 text-sm hover:bg-slate-200 transition-colors" type="submit">검색</button>
          </div>
        </form>
      </div>

      {secretModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none border border-slate-200 shadow-xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-brand-dark mb-4">비밀글 확인</h4>
            <p className="mb-3 text-[13px] text-gray-600">비밀번호를 입력하세요.</p>
            <input
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mb-4"
              type="password"
              value={secretModal.password}
              onChange={(event) => setSecretModal((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="비밀번호"
              onKeyDown={(event) => { if (event.key === 'Enter') onSecretConfirm(); }}
            />
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

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function updateCommentVotes(list: CommentDto[], commentId: number | string, likes: number, dislikes: number): CommentDto[] {
  return list.map((comment) => {
    if (String(comment.commentId) === String(commentId)) {
      return { ...comment, likes, dislikes };
    }
    if (comment.replies && comment.replies.length > 0) {
      return { ...comment, replies: updateCommentVotes(comment.replies, commentId, likes, dislikes) };
    }
    return comment;
  });
}

function countAllComments(list: CommentDto[]): number {
  return list.reduce((sum, comment) => sum + 1 + countAllComments(comment.replies ?? []), 0);
}

function getDepthIndentClass(depth: number): string {
  if (depth <= 0) return '';
  if (depth === 1) return 'ml-3 sm:ml-6';
  if (depth === 2) return 'ml-4 sm:ml-12';
  if (depth === 3) return 'ml-4 sm:ml-[72px]';
  return 'ml-4 sm:ml-24';
}

function CommentItem({
  comment,
  depth,
  onVote,
  onSubmitReply,
  commentLoading,
  voteMap,
}: {
  comment: CommentDto;
  depth: number;
  onVote: (commentId: number | string, action: 'like' | 'dislike') => void;
  onSubmitReply: (parentCommentId: number | undefined, form: CommentFormState) => Promise<void>;
  commentLoading: boolean;
  voteMap: Record<string, 'like' | 'dislike' | undefined>;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [spoilerVisible, setSpoilerVisible] = useState(false);
  const [replyForm, setReplyForm] = useState<CommentFormState>({
    writer: '',
    content: '',
    secret: false,
    spoiler: false,
    password: '',
    parentCommentId: typeof comment.commentId === 'number' ? comment.commentId : Number(comment.commentId),
  });

  const isSecret = comment.secret === 'Y';
  const isSpoiler = comment.spoiler === 'Y';
  const currentUserVote = voteMap[String(comment.commentId)];

  const handleReplySubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmitReply(replyForm.parentCommentId, replyForm);
    setShowReplyForm(false);
    setReplyForm((prev) => ({ ...prev, writer: '', content: '', password: '' }));
  };

  return (
    <div className={`bg-gray-50 rounded-none p-4${depth > 0 ? ` border-l-2 border-gray-200 ${getDepthIndentClass(depth)}` : ''}`}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          {depth > 0 && <span className="material-icons reply-icon align-middle text-base text-gray-500">subdirectory_arrow_right</span>}
          <span className="font-semibold text-sm text-brand-dark">{comment.writer ?? '익명'}</span>
          <span className="text-xs text-gray-400">{comment.insDt ? String(comment.insDt).replace('T', ' ').slice(0, 16) : ''}</span>
          {isSecret && <span className="material-icons text-sm text-gray-500" title="비밀글">lock</span>}
          {isSpoiler && <span className="spoiler-label ml-1 text-xs text-amber-500">스포일러</span>}
        </div>

        {isSecret ? (
          <div className="text-sm text-gray-400 italic">
            <span className="material-icons align-middle text-sm">lock</span> 작성자만 볼 수 있는 댓글입니다.
          </div>
        ) : isSpoiler && !spoilerVisible ? (
          <div className="select-none cursor-pointer text-sm text-gray-700 blur-[6px]" onClick={() => setSpoilerVisible(true)} title="클릭하면 내용을 볼 수 있습니다">
            {comment.content ?? ''}
          </div>
        ) : (
          <div className="text-sm text-gray-700">{comment.content ?? ''}</div>
        )}

        <div className="comment-actions mt-1.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onVote(comment.commentId, 'like')}
            className={`inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[13px] transition-colors ${currentUserVote === 'like' ? 'text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <span className="material-icons text-base">{currentUserVote === 'like' ? 'thumb_up' : 'thumb_up_off_alt'}</span>
            {comment.likes ?? 0}
          </button>
          <button
            type="button"
            onClick={() => onVote(comment.commentId, 'dislike')}
            className={`inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[13px] transition-colors ${currentUserVote === 'dislike' ? 'text-slate-800' : 'text-slate-600 hover:text-slate-800'}`}
          >
            <span className="material-icons text-base">{currentUserVote === 'dislike' ? 'thumb_down' : 'thumb_down_off_alt'}</span>
            {comment.dislikes ?? 0}
          </button>
          {isSpoiler && spoilerVisible && (
            <button type="button" className="cursor-pointer border-0 bg-transparent text-xs text-amber-500" onClick={() => setSpoilerVisible(false)}>숨기기</button>
          )}
          <button type="button" onClick={() => setShowReplyForm((value) => !value)} className="cursor-pointer border-0 bg-transparent text-[13px] text-gray-500">
            {showReplyForm ? '취소' : '답글'}
          </button>
        </div>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-2 border-t border-gray-200 pt-2">
            <textarea className="form-textarea w-full !min-h-[56px]" placeholder="답글을 입력하세요." value={replyForm.content} onChange={(event) => setReplyForm((prev) => ({ ...prev, content: event.target.value }))} rows={2} />
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
              <input className="form-input w-[96px]" type="text" placeholder="작성자" value={replyForm.writer} onChange={(event) => setReplyForm((prev) => ({ ...prev, writer: event.target.value }))} />
              <input className="form-input w-[96px]" type="password" placeholder="비밀번호" value={replyForm.password} onChange={(event) => setReplyForm((prev) => ({ ...prev, password: event.target.value }))} />
              <label className="inline-flex items-center gap-1"><input type="checkbox" checked={replyForm.secret} onChange={(event) => setReplyForm((prev) => ({ ...prev, secret: event.target.checked }))} />비밀글</label>
              <label className="inline-flex items-center gap-1"><input type="checkbox" checked={replyForm.spoiler} onChange={(event) => setReplyForm((prev) => ({ ...prev, spoiler: event.target.checked }))} />스포일러</label>
              <button type="submit" className="ml-auto inline-flex items-center bg-brand-primary text-white rounded-md px-3 py-2 text-xs font-medium hover:bg-[#4e5caf] transition-colors disabled:opacity-40" disabled={commentLoading}>{commentLoading ? '저장 중...' : '답글 저장'}</button>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && comment.replies.map((reply, index) => (
        <CommentItem
          key={`${reply.commentId ?? 'reply'}-${index}`}
          comment={reply}
          depth={depth + 1}
          onVote={onVote}
          onSubmitReply={onSubmitReply}
          commentLoading={commentLoading}
          voteMap={voteMap}
        />
      ))}
    </div>
  );
}

export function SermonsViewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rqstNo = searchParams.get('rqstNo') ?? '';
  const [board, setBoard] = useState<BoardDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(Boolean(rqstNo));
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);
  const [password, setPassword] = useState('');
  const [commentForm, setCommentForm] = useState<CommentFormState>({ writer: '', content: '', secret: false, spoiler: false, password: '', parentCommentId: undefined });
  const [commentLoading, setCommentLoading] = useState(false);
  const [sortType, setSortType] = useState<SortType>('latest');
  const [userVotes, setUserVotes] = useState<Record<string, 'like' | 'dislike' | undefined>>({});

  const loadData = async () => {
    if (!rqstNo) return;
    try {
      const data = await sermonsApi.getBoardView(rqstNo);
      setBoard(data.board);
      setComments(data.comments);
      setUserVotes((data.userVotes ?? {}) as Record<string, 'like' | 'dislike' | undefined>);
    } catch {
      setError('게시글을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    if (!rqstNo) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await sermonsApi.getBoardView(rqstNo);
        if (!mounted) return;
        setBoard(data.board);
        setComments(data.comments);
        setUserVotes((data.userVotes ?? {}) as Record<string, 'like' | 'dislike' | undefined>);
      } catch {
        if (!mounted) return;
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [rqstNo]);

  const openPasswordModal = (nextAction: 'edit' | 'delete') => {
    setAction(nextAction);
    setPassword('');
    setShowPasswordModal(true);
  };

  const onConfirm = async () => {
    if (!action || !rqstNo) {
      setShowPasswordModal(false);
      return;
    }

    if (board?.password) {
      const isValid = await sermonsApi.checkPassword(rqstNo, password);
      if (!isValid) {
        alert('비밀번호가 올바르지 않습니다.');
        return;
      }
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

  const onVote = async (commentId: number | string, voteAction: 'like' | 'dislike') => {
    try {
      const result = await sermonsApi.voteComment(commentId, voteAction);
      if (result) {
        setComments((prev) => updateCommentVotes(prev, commentId, result.likes, result.dislikes));
        setUserVotes((prev) => {
          const next = { ...prev };
          const key = String(commentId);
          const vote = result.userVote ?? undefined;
          if (!vote) {
            delete next[key];
          } else {
            next[key] = vote;
          }
          return next;
        });
      }
    } catch {
      // ignore
    }
  };

  const onSubmitReply = async (parentCommentId: number | undefined, form: CommentFormState) => {
    if (!rqstNo) return;
    if (!form.writer.trim() || !form.content.trim() || !form.password.trim()) {
      alert('작성자, 내용, 비밀번호는 필수입니다.');
      return;
    }
    try {
      setCommentLoading(true);
      await sermonsApi.saveComment({
        boardNo: rqstNo,
        content: form.content,
        writer: form.writer,
        secret: form.secret ? 'Y' : 'N',
        spoiler: form.spoiler ? 'Y' : 'N',
        password: form.password,
        parentCommentId,
      });
      await loadData();
    } catch {
      alert('댓글 저장 중 오류가 발생했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const onCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmitReply(undefined, commentForm);
    if (!commentLoading) {
      setCommentForm({ writer: '', content: '', secret: false, spoiler: false, password: '', parentCommentId: undefined });
    }
  };

  const sortedComments = [...comments].sort((left, right) => {
    if (sortType === 'popular') {
      return ((right.likes ?? 0) - (right.dislikes ?? 0)) - ((left.likes ?? 0) - (left.dislikes ?? 0));
    }
    return String(right.insDt ?? '').localeCompare(String(left.insDt ?? ''));
  });

  const topLevelComments = sortedComments.filter((comment) => !comment.parentCommentId);
  const totalCommentCount = countAllComments(comments);
  const resolvedTitle = board?.title ?? '주일설교';
  const resolvedAuthor = board?.rqstId ?? '-';
  const resolvedDateTime = board?.insDt ? String(board.insDt).replace('T', ' ').slice(0, 16) : '-';
  const resolvedViews = board?.views ?? 0;
  const resolvedContent = board?.cont ?? '';
  const resolvedPreacherName = board?.preacherName ?? '-';
  const resolvedScriptureReference = board?.scriptureReference ?? '-';
  const resolvedSermonDate = board?.sermonDate ? String(board.sermonDate).slice(0, 10) : '-';
  const resolvedWorshipType = board?.worshipType
    ? (DEFAULT_WORSHIP_TYPE_LABEL_MAP[String(board.worshipType)] ?? String(board.worshipType))
    : '-';
  const fileList: FileDto[] = board?.fileList ?? [];

  return (
    <section className="space-y-5">
      <article className="bg-white rounded-none shadow-panel border border-gray-100 p-6 md:p-7">
        <header className="pb-5 mb-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{resolvedTitle}</h2>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons text-base">person</span>{resolvedAuthor}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons text-base">calendar_today</span>{resolvedDateTime}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons text-base">visibility</span>{resolvedViews}회</div>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${totalCommentCount > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{totalCommentCount > 0 ? '답변 완료' : '답변 대기'}</span>
          </div>
        </header>

        {error && <div className="text-sm text-red-600 bg-red-50 rounded-none px-4 py-3 mb-4">{error}</div>}
        {loading && <div className="text-sm text-gray-400 text-center py-8">불러오는 중...</div>}

        {fileList.length > 0 && (
          <section className="mt-2 rounded-none border border-slate-200 bg-slate-50 px-3 py-2">
            <h4 className="mb-1 flex items-center gap-1 text-xs text-gray-700">
              <span className="material-icons text-sm">attach_file</span>
              첨부파일 {fileList.length}
            </h4>
            <ul className="m-0 list-none p-0 space-y-0.5">
              {fileList.map((file, index) => (
                <li key={file.fileId ?? index} className="flex items-center gap-1.5 py-0.5">
                  <span className="material-icons text-sm text-gray-500">description</span>
                  <a href={resolveDownloadUrl(file)} download={file.orgFileNm ?? file.filename} className="text-xs text-[#1976d2] no-underline">
                    {file.orgFileNm ?? file.filename ?? `파일 ${index + 1}`}
                  </a>
                  {file.fileSize > 0 && <span className="text-xs text-gray-400">({formatBytes(file.fileSize)})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-3 rounded-none border border-slate-100 bg-slate-50/60 p-5">
          <div className="grid grid-cols-1 gap-4 text-sm text-slate-700 md:grid-cols-2">
            <div className="flex items-center gap-2 text-base">
              <span className="font-medium text-slate-900">설교자</span>
              <span>{resolvedPreacherName}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <span className="font-medium text-slate-900">예배구분</span>
              <span>{resolvedWorshipType}</span>
            </div>
            <div className="flex items-center gap-2 text-base">
              <span className="font-medium text-slate-900">설교일자</span>
              <span>{resolvedSermonDate}</span>
            </div>
            <div className="md:col-span-2">
              <div className="mb-1 text-sm font-medium text-slate-900">성경본문</div>
              <div className="text-base">{resolvedScriptureReference}</div>
            </div>
          </div>
        </section>

        <section className="py-4 prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: resolvedContent }} />

        <section className="mt-6 pt-6 border-t border-gray-100">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="m-0"><span className="material-icons align-middle">chat_bubble</span>댓글 {totalCommentCount}</h3>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => setSortType('latest')} className={`cursor-pointer rounded-md border px-2.5 py-1 text-[13px] transition-colors ${sortType === 'latest' ? 'border-slate-500 bg-slate-200 text-slate-800' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'}`}>최신순</button>
              <button type="button" onClick={() => setSortType('popular')} className={`cursor-pointer rounded-md border px-2.5 py-1 text-[13px] transition-colors ${sortType === 'popular' ? 'border-slate-500 bg-slate-200 text-slate-800' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'}`}>인기순</button>
            </div>
          </div>

          <div className="space-y-3">
            {topLevelComments.length === 0 && !loading && <div className="py-6 text-center text-gray-400">등록된 댓글이 없습니다.</div>}
            {topLevelComments.map((comment, index) => (
              <CommentItem
                key={`${comment.commentId ?? 'comment'}-${index}`}
                comment={comment}
                depth={0}
                onVote={onVote}
                onSubmitReply={onSubmitReply}
                commentLoading={commentLoading}
                voteMap={userVotes}
              />
            ))}
          </div>

          <form className="mt-4 pt-4 border-t border-gray-100" onSubmit={onCommentSubmit}>
            <textarea className="form-textarea w-full !min-h-[56px]" placeholder="댓글을 입력하세요." value={commentForm.content} onChange={(event) => setCommentForm((prev) => ({ ...prev, content: event.target.value }))} rows={2} />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <input className="form-input w-[104px]" type="text" placeholder="작성자" value={commentForm.writer} onChange={(event) => setCommentForm((prev) => ({ ...prev, writer: event.target.value }))} />
              <input className="form-input w-[104px]" type="password" placeholder="비밀번호" value={commentForm.password} onChange={(event) => setCommentForm((prev) => ({ ...prev, password: event.target.value }))} />
              <label className="inline-flex items-center gap-1"><input type="checkbox" checked={commentForm.secret} onChange={(event) => setCommentForm((prev) => ({ ...prev, secret: event.target.checked }))} />비밀글</label>
              <label className="inline-flex items-center gap-1"><input type="checkbox" checked={commentForm.spoiler} onChange={(event) => setCommentForm((prev) => ({ ...prev, spoiler: event.target.checked }))} />스포일러</label>
              <button type="submit" className="ml-auto inline-flex items-center bg-brand-primary text-white rounded-md px-3 py-2 text-xs font-medium hover:bg-[#4e5caf] transition-colors disabled:opacity-40" disabled={commentLoading}>{commentLoading ? '저장 중...' : '댓글 저장'}</button>
            </div>
          </form>
        </section>

        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-0">
          <Link className="inline-flex items-center bg-brand-primary !text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-[#4e5caf] transition-colors" to={SERMONS_LIST_PATH}>목록</Link>
          {rqstNo && <button type="button" className="inline-flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors" onClick={() => navigate(`${SERMONS_LIST_PATH}/write?parentNo=${rqstNo}`)}>답글 작성</button>}
          <button type="button" className="inline-flex items-center bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors" onClick={() => openPasswordModal('edit')}>수정</button>
          <button type="button" className="inline-flex items-center bg-red-50 text-red-600 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-red-100 transition-colors" onClick={() => openPasswordModal('delete')}>삭제</button>
        </div>
      </article>

      <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${showPasswordModal ? '' : 'hidden'}`}>
        <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm">
          <h4 className="text-base font-bold text-brand-dark mb-4">비밀번호 확인</h4>
          <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm mb-4" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호를 입력하세요" />
          <div className="flex gap-2 justify-end">
            <button type="button" className="bg-brand-primary text-white rounded-md px-4 py-2.5 text-sm font-medium" onClick={onConfirm}>확인</button>
            <button type="button" className="bg-gray-100 text-gray-700 rounded-md px-4 py-2.5 text-sm font-medium" onClick={() => setShowPasswordModal(false)}>취소</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/****************************************************************************************************
 * component method (작성/수정 화면)
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

  useEffect(() => {
    let mounted = true;

    const loadWorshipTypeOptions = async () => {
      try {
        const result = await systemConfigCodeApi.getCodeList({
          page: 0,
          size: 100,
          groupCode: 'WORSHIP_TYPE',
        });

        if (!mounted) {
          return;
        }

        const mappedOptions = (result.items ?? [])
          .map((row) => {
            const item = row as SystemConfigCodeRow;
            const value = String(item.codeValue ?? '').trim();
            const label = String(item.codeName ?? '').trim();
            if (!value || !label) {
              return null;
            }
            return { value, label };
          })
          .filter((item): item is WorshipTypeOption => item !== null);

        if (mappedOptions.length > 0) {
          setWorshipTypeOptions(mappedOptions);
        }
      } catch {
        if (!mounted) {
          return;
        }
        setWorshipTypeOptions(DEFAULT_WORSHIP_TYPE_OPTIONS);
      }
    };

    loadWorshipTypeOptions();

    return () => {
      mounted = false;
    };
  }, []);

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
          sermonDate: data.sermonDate ? String(data.sermonDate).slice(0, 10) : '',
          worshipType: data.worshipType ?? 'SUNDAY',
          content: data.cont ?? '',
          secret: data.secret === 'Y',
          password: '',
          confirmPassword: '',
        }));
        resetAttachments((data.fileList as FileDto[] | undefined)?.map((file) => ({
          fileId: file.fileId,
          orgFileNm: file.orgFileNm ?? file.filename,
          fileSize: file.fileSize,
        })) ?? []);
      } catch {
        alert('수정할 설교를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isEdit, isReply, parentNo, rqstNo, resetAttachments]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
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

      if (isEdit) {
        await sermonsApi.updateBoard(payload, attachments.newFiles, attachments.deletedFileIds);
        alert('설교 수정이 완료되었습니다.');
      } else {
        await sermonsApi.saveBoard(payload, attachments.newFiles, attachments.deletedFileIds);
        alert(isReply ? '답글이 등록되었습니다.' : '설교 등록이 완료되었습니다.');
      }

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
          <h2 className="text-xl font-bold text-brand-dark">{isReply ? '설교 답글 작성' : '설교 작성'}</h2>
        </header>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀글</label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.secret} onChange={(event) => setForm((prev) => ({ ...prev, secret: event.target.checked }))} />
                비밀글로 등록
              </label>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">제목 <span className="text-red-500">*</span></label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="제목을 입력해주세요." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">이름 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.author} onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))} placeholder="이름을 입력해주세요." readOnly={isEdit} />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">설교자</label>
              <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.preacherName} onChange={(event) => setForm((prev) => ({ ...prev, preacherName: event.target.value }))} placeholder="설교자 이름" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">성경본문</label>
              <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.scriptureReference} onChange={(event) => setForm((prev) => ({ ...prev, scriptureReference: event.target.value }))} placeholder="예: 요한복음 3:16-21" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">설교일자</label>
              <input
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="YYYY-MM-DD"
                value={form.sermonDate}
                onChange={(event) => setForm((prev) => ({ ...prev, sermonDate: event.target.value }))}
              />
              <p className="text-xs text-gray-400">연-월-일만 입력합니다.</p>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">예배구분</label>
            <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.worshipType} onChange={(event) => setForm((prev) => ({ ...prev, worshipType: event.target.value }))}>
              {worshipTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">내용 <span className="text-red-500">*</span></label>
            <div className="[&_.editor-resize-surface]:min-h-[22rem] [&_.editor-resize-surface_.ProseMirror]:min-h-[20rem]">
              <Suspense fallback={<div className="w-full min-h-40 border border-slate-300 rounded-none bg-white px-3 py-2.5 text-sm text-slate-500">에디터 불러오는 중...</div>}>
                <LazyEditor
                  value={form.content}
                  onChange={(nextValue) => setForm((prev) => ({ ...prev, content: nextValue }))}
                  placeholder="내용을 입력해주세요."
                />
              </Suspense>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">첨부파일</label>
            <Attachment
              existingFiles={attachments.existingFiles}
              newFiles={attachments.newFiles}
              onAdd={(files) => attachments.addFiles(files)}
              onRemoveExisting={(fileId) => attachments.removeExisting(fileId)}
              onRemoveNew={(index) => attachments.removeNew(index)}
              compact
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="비밀번호" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 확인 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" type="password" value={form.confirmPassword} onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))} placeholder="비밀번호 확인" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-brand-primary text-white rounded-md px-6 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-40 transition-colors" disabled={loading}>{isEdit ? '수정하기' : '등록하기'}</button>
            <Link to={SERMONS_LIST_PATH} className="bg-gray-100 text-gray-700 rounded-md px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">취소</Link>
          </div>
        </form>
      </article>
    </section>
  );
}
