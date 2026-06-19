import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { announcementApi } from './announcementApi';
import { ANNOUNCEMENT_PATHS } from './announcementModel';
import type { BoardItem as BoardDto, CommentItem as CommentDto, FileItem as FileDto } from '../../../common/board/board.types';

type BoardItem = {
  id: number | string;
  rowNum: number;
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

type AnnouncementBoardListProps = {
  title: string;
  breadcrumb: string;
  viewPath: string;
  writePath: string;
  listPath?: string;
  posts?: BoardItem[];
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

function AnnouncementBoardListPage({
  title,
  breadcrumb,
  viewPath,
  writePath,
  listPath,
  posts = [],
}: AnnouncementBoardListProps) {
  const navigate = useNavigate();
  const resolvedListPath = useMemo(() => listPath ?? writePath.replace(/\/write$/, ''), [listPath, writePath]);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const [page, setPage] = useState(Number.isFinite(pageParam) && pageParam > 0 ? pageParam - 1 : 0);
  const [searchType, setSearchType] = useState(searchParams.get('searchType') ?? 'title');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '');
  const [inputKeyword, setInputKeyword] = useState(searchParams.get('keyword') ?? '');

  const [items, setItems] = useState<BoardDto[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [secretModal, setSecretModal] = useState<{ show: boolean; rqstNo: string; password: string }>({
    show: false,
    rqstNo: '',
    password: '',
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await announcementApi.getBoardList({
          page,
          searchType,
          keyword: keyword.trim() || undefined,
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
  }, [resolvedListPath, page, searchType, keyword]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(page + 1));
    if (searchType) params.set('searchType', searchType);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    setSearchParams(params, { replace: true });
  }, [page, searchType, keyword, setSearchParams]);

  const rows: BoardItem[] = !error
    ? items.map((item, index) => ({
        id: item.rqstNo ?? '',
        rowNum: totalElements - page * pageSize - index,
        title: item.title ?? '',
        author: item.rqstId ?? '-',
        date: item.insDt ? String(item.insDt).slice(0, 10) : '-',
        views: item.views ?? 0,
        answered: (item.commentCount ?? 0) > 0,
        secret: item.secret === 'Y',
        hasFile: item.hasFile === true,
        commentCount: item.commentCount ?? 0,
        depth: item.depth ?? 0,
      }))
    : posts;

  const openSecretModal = (rqstNo: string) => {
    setSecretModal({ show: true, rqstNo, password: '' });
  };

  const onSecretConfirm = async () => {
    navigate(`${viewPath}?rqstNo=${secretModal.rqstNo}&password=${encodeURIComponent(secretModal.password)}`);
    setSecretModal({ show: false, rqstNo: '', password: '' });
  };

  const pageButtons = totalPages > 0 ? Array.from({ length: totalPages }, (_, index) => index) : [0];

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
  };

  return (
    <>
      <section className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">{title}</h2>
            <div className="mt-1 text-sm text-gray-500">
              게시물: {totalElements || rows.length} | 페이지: {page + 1}/{Math.max(totalPages, 1)}
            </div>
          </div>
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{breadcrumb}</div>
        </div>

        {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-panel">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium" style={{ width: '6%' }}>
                  번호
                </th>
                <th className="px-2 py-3" style={{ width: '4%' }}></th>
                <th className="px-4 py-3 text-left font-medium" style={{ width: '44%' }}>
                  제목
                </th>
                <th className="px-4 py-3 font-medium" style={{ width: '13%' }}>
                  작성자
                </th>
                <th className="px-4 py-3 font-medium" style={{ width: '13%' }}>
                  작성일
                </th>
                <th className="px-4 py-3 font-medium" style={{ width: '8%' }}>
                  조회수
                </th>
                <th className="px-4 py-3 font-medium" style={{ width: '12%' }}>
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    게시물이 없습니다.
                  </td>
                </tr>
              )}
              {rows.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-center text-gray-500">{post.rowNum}</td>
                  <td className="px-2 py-3 text-center">
                    {post.hasFile && (
                      <span className="material-icons" style={{ fontSize: '16px', color: '#777' }} title="첨부파일 있음">
                        attach_file
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {post.secret ? (
                      <button
                        type="button"
                        className={`text-left text-brand-dark hover:text-brand-primary hover:underline${post.depth > 0 ? ' pl-5' : ''}`}
                        onClick={() => openSecretModal(String(post.id))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        {post.depth > 0 && (
                          <span className="material-icons" style={{ marginRight: '4px', fontSize: '16px', verticalAlign: 'middle' }}>
                            subdirectory_arrow_right
                          </span>
                        )}
                        <span className="material-icons" style={{ marginRight: '2px', fontSize: '14px' }}>
                          lock
                        </span>
                        {post.title}
                        {post.commentCount > 0 && <span className="ml-1 text-[13px] text-red-500">[{post.commentCount}]</span>}
                      </button>
                    ) : (
                      <Link to={`${viewPath}?rqstNo=${post.id}`} className={`${post.depth > 0 ? ' pl-5' : ''} text-brand-dark hover:text-brand-primary hover:underline`}>
                        {post.depth > 0 && (
                          <span className="material-icons" style={{ marginRight: '4px', fontSize: '16px', verticalAlign: 'middle' }}>
                            subdirectory_arrow_right
                          </span>
                        )}
                        {post.title}
                        {post.commentCount > 0 && <span className="ml-1 text-[13px] text-red-500">[{post.commentCount}]</span>}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{post.author}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{post.date}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{post.views}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${post.answered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {post.answered ? '완료' : '대기'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-1.5">
          {pageButtons.map((buttonPage) => (
            <button
              key={buttonPage}
              type="button"
              className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${buttonPage === page ? 'bg-brand-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setPage(buttonPage)}
            >
              {buttonPage + 1}
            </button>
          ))}
        </div>

        <form className="flex flex-col gap-2 sm:flex-row rounded-2xl border border-slate-200 bg-white p-3" onSubmit={onSearch}>
          <div className="flex flex-1 gap-2">
            <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700" value={searchType} onChange={(event) => setSearchType(event.target.value)}>
              <option value="title">제목</option>
              <option value="rqstId">작성자</option>
              <option value="cont">내용</option>
            </select>
            <input
              type="text"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="검색어를 입력하세요."
              value={inputKeyword}
              onChange={(event) => setInputKeyword(event.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-200" type="submit">
              검색
            </button>
            <Link className="inline-flex items-center rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4e5caf]" to={writePath}>
              글쓰기
            </Link>
          </div>
        </form>
      </section>

      {secretModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h4 className="mb-4 text-base font-bold text-brand-dark">비밀글 확인</h4>
            <p className="mb-3 text-xs text-gray-500">게시글 비밀번호를 입력하세요.</p>
            <input
              className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              type="password"
              value={secretModal.password}
              onChange={(event) => setSecretModal((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="비밀번호"
              onKeyDown={(event) => {
                if (event.key === 'Enter') onSecretConfirm();
              }}
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded-xl bg-brand-primary px-4 py-2 text-sm text-white" onClick={onSecretConfirm}>
                확인
              </button>
              <button
                type="button"
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700"
                onClick={() => setSecretModal({ show: false, rqstNo: '', password: '' })}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AnnouncementCommentItem({
  comment,
  depth,
  onVote,
  onSubmitReply,
  commentLoading,
}: {
  comment: CommentDto;
  depth: number;
  onVote: (commentId: number | string, action: 'like' | 'dislike') => void;
  onSubmitReply: (parentCommentId: number | undefined, form: CommentFormState) => Promise<void>;
  commentLoading: boolean;
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

  const handleReplySubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmitReply(replyForm.parentCommentId, replyForm);
    setShowReplyForm(false);
    setReplyForm((prev) => ({ ...prev, writer: '', content: '', password: '' }));
  };

  return (
    <div
      className={`rounded-lg bg-gray-50 p-4${depth > 0 ? ' border-l-2 border-gray-200' : ''}`}
      style={depth > 0 ? { marginLeft: `${depth * 24}px` } : {}}
    >
      <div className="mb-2 flex items-center gap-2">
        {depth > 0 && (
          <span className="material-icons" style={{ fontSize: '16px', color: '#888' }}>
            subdirectory_arrow_right
          </span>
        )}
        <span className="text-sm font-semibold text-brand-dark">{comment.writer ?? '익명'}</span>
        <span className="text-xs text-gray-400">{comment.insDt ? String(comment.insDt).replace('T', ' ').slice(0, 16) : ''}</span>
        {isSecret && (
          <span className="material-icons" style={{ fontSize: '14px', color: '#888' }} title="비밀 댓글">
            lock
          </span>
        )}
        {isSpoiler && <span style={{ fontSize: '12px', color: '#f90' }}>스포일러</span>}
      </div>

      {isSecret ? (
        <div className="text-sm italic text-gray-400">비밀 댓글입니다. 관리자만 볼 수 있습니다.</div>
      ) : isSpoiler && !spoilerVisible ? (
        <div
          className="cursor-pointer select-none text-sm text-gray-700"
          style={{ filter: 'blur(6px)' }}
          onClick={() => setSpoilerVisible(true)}
          title="클릭하면 내용을 볼 수 있습니다"
        >
          {comment.content ?? ''}
        </div>
      ) : (
        <div className="text-sm text-gray-700">{comment.content ?? ''}</div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <button type="button" onClick={() => onVote(comment.commentId, 'like')} className="inline-flex items-center gap-1 text-xs text-gray-600">
          <span className="material-icons" style={{ fontSize: '16px', color: '#4caf50' }}>
            thumb_up
          </span>
          {comment.likes ?? 0}
        </button>
        <button type="button" onClick={() => onVote(comment.commentId, 'dislike')} className="inline-flex items-center gap-1 text-xs text-gray-600">
          <span className="material-icons" style={{ fontSize: '16px', color: '#f44336' }}>
            thumb_down
          </span>
          {comment.dislikes ?? 0}
        </button>
        <button type="button" onClick={() => setShowReplyForm((value) => !value)} className="text-xs text-gray-600">
          {showReplyForm ? '취소' : '답글'}
        </button>
      </div>

      {showReplyForm && (
        <form className="mt-3 border-t border-gray-200 pt-3" onSubmit={handleReplySubmit}>
          <div className="flex flex-wrap gap-2">
            <input
              className="rounded border border-gray-200 px-2 py-1 text-sm"
              type="text"
              placeholder="작성자"
              value={replyForm.writer}
              onChange={(event) => setReplyForm((prev) => ({ ...prev, writer: event.target.value }))}
            />
            <input
              className="rounded border border-gray-200 px-2 py-1 text-sm"
              type="password"
              placeholder="비밀번호"
              value={replyForm.password}
              onChange={(event) => setReplyForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>
          <textarea
            className="mt-2 w-full rounded border border-gray-200 px-2 py-1 text-sm"
            rows={2}
            placeholder="답글을 입력하세요"
            value={replyForm.content}
            onChange={(event) => setReplyForm((prev) => ({ ...prev, content: event.target.value }))}
          />
          <div className="mt-2 flex items-center gap-2">
            <label className="inline-flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={replyForm.secret}
                onChange={(event) => setReplyForm((prev) => ({ ...prev, secret: event.target.checked }))}
              />
              Secret
            </label>
            <label className="inline-flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={replyForm.spoiler}
                onChange={(event) => setReplyForm((prev) => ({ ...prev, spoiler: event.target.checked }))}
              />
              스포일러
            </label>
            <button
              type="submit"
              disabled={commentLoading}
              className="ml-auto rounded bg-brand-primary px-3 py-1 text-xs text-white disabled:opacity-50"
            >
              {commentLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      )}

      {comment.replies?.map((reply, idx) => (
        <AnnouncementCommentItem
          key={`${reply.commentId ?? 'r'}-${idx}`}
          comment={reply}
          depth={depth + 1}
          onVote={onVote}
          onSubmitReply={onSubmitReply}
          commentLoading={commentLoading}
        />
      ))}
    </div>
  );
}

export function AnnouncementViewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rqstNo = searchParams.get('rqstNo') ?? '';
  const listPath = ANNOUNCEMENT_PATHS.listPath;

  const [board, setBoard] = useState<BoardDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(Boolean(rqstNo));
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);
  const [password, setPassword] = useState('');
  const [commentForm, setCommentForm] = useState<CommentFormState>({
    writer: '',
    content: '',
    secret: false,
    spoiler: false,
    password: '',
    parentCommentId: undefined,
  });
  const [commentLoading, setCommentLoading] = useState(false);
  const [sortType, setSortType] = useState<SortType>('latest');

  const loadData = async () => {
    if (!rqstNo) return;
    const data = await announcementApi.getBoardView(rqstNo);
    setBoard(data.board);
    setComments(data.comments);
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
        const data = await announcementApi.getBoardView(rqstNo);
        if (!mounted) return;
        setBoard(data.board);
        setComments(data.comments);
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
  }, [listPath, rqstNo]);

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
      const isValid = await announcementApi.checkPassword(rqstNo, password);
      if (!isValid) {
        alert('비밀번호가 올바르지 않습니다.');
        return;
      }
    }

    if (action === 'edit') {
      navigate(`${listPath}/write?rqstNo=${rqstNo}`);
      return;
    }

    try {
      await announcementApi.deleteBoard(rqstNo);
      alert('게시글이 삭제되었습니다.');
      navigate(listPath);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const onVote = async (commentId: number | string, voteAction: 'like' | 'dislike') => {
    try {
      const result = await announcementApi.voteComment(commentId, voteAction);
      if (!result) return;
      setComments((prev) =>
        prev.map((comment) => {
          if (String(comment.commentId) === String(commentId)) {
            return { ...comment, likes: result.likes, dislikes: result.dislikes };
          }
          return comment;
        })
      );
    } catch {
      // ignore vote failure
    }
  };

  const onSubmitReply = async (parentCommentId: number | undefined, form: CommentFormState) => {
    if (!rqstNo) return;
    if (!form.writer.trim() || !form.content.trim() || !form.password.trim()) {
      alert('작성자, 내용, 비밀번호를 모두 입력해 주세요.');
      return;
    }

    try {
      setCommentLoading(true);
      await announcementApi.saveComment({
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
      alert('댓글 저장에 실패했습니다.');
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

  const sortedComments = [...comments].sort((a, b) => {
    if (sortType === 'popular') {
      return (b.likes ?? 0) - (b.dislikes ?? 0) - ((a.likes ?? 0) - (a.dislikes ?? 0));
    }
    return String(b.insDt ?? '').localeCompare(String(a.insDt ?? ''));
  });

  const topLevelComments = sortedComments.filter((comment) => !comment.parentCommentId);
  const fileList: FileDto[] = board?.fileList ?? [];

  const resolvedTitle = board?.title ?? 'Post';
  const resolvedAuthor = board?.rqstId ?? '-';
  const resolvedDateTime = board?.insDt ? String(board.insDt).replace('T', ' ').slice(0, 16) : '-';
  const resolvedViews = board?.views ?? 0;
  const resolvedContent = board?.cont ?? '';

  const totalCommentCount = (function countAll(list: CommentDto[]): number {
    return list.reduce((sum, comment) => sum + 1 + countAll(comment.replies ?? []), 0);
  })(comments);

  return (
    <section>
      <article className="rounded-panel border border-gray-100 bg-white p-6 shadow-panel">
        <header className="mb-5 border-b border-gray-100 pb-5">
          <h2 className="text-xl font-bold text-brand-dark">{resolvedTitle}</h2>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons" style={{ fontSize: '16px' }}>
                  person
                </span>
                {resolvedAuthor}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons" style={{ fontSize: '16px' }}>
                  calendar_today
                </span>
                {resolvedDateTime}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="material-icons" style={{ fontSize: '16px' }}>
                  visibility
                </span>
                {resolvedViews}
              </div>
            </div>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${totalCommentCount > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {totalCommentCount > 0 ? '완료' : '대기'}
            </span>
          </div>
        </header>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        {loading && <div className="py-8 text-center text-sm text-gray-400">불러오는 중...</div>}

        <section className="prose max-w-none py-4 text-gray-700" dangerouslySetInnerHTML={{ __html: resolvedContent }} />

        {fileList.length > 0 && (
          <section className="my-4 rounded border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold">
              <span className="material-icons" style={{ fontSize: '18px' }}>
                attach_file
              </span>
              Attachments ({fileList.length})
            </h4>
            <ul className="space-y-1">
              {fileList.map((file, idx) => (
                <li key={file.fileId ?? idx} className="flex items-center gap-2 text-sm">
                  <span className="material-icons" style={{ fontSize: '16px', color: '#777' }}>
                    description
                  </span>
                  <a
                    href={file.downloadUrl ?? `/api${listPath}/download?fileId=${file.fileId}`}
                    download={file.orgFileNm ?? file.filename}
                    className="text-blue-600 hover:underline"
                  >
                    {file.orgFileNm ?? file.filename ?? `File ${idx + 1}`}
                  </a>
                  {file.fileSize > 0 && <span className="text-xs text-gray-400">({formatBytes(file.fileSize)})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 border-t border-gray-100 pt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="m-0 text-base font-semibold">
              <span className="material-icons align-middle">chat_bubble</span> 댓글 {totalCommentCount}
            </h3>
            <div className="flex gap-1">
              <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => setSortType('latest')}>
                Latest
              </button>
              <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => setSortType('popular')}>
                Popular
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {topLevelComments.length === 0 && !loading && <div className="py-6 text-center text-sm text-gray-400">댓글이 없습니다.</div>}
            {topLevelComments.map((comment, index) => (
              <AnnouncementCommentItem
                key={`${comment.commentId ?? 'comment'}-${index}`}
                comment={comment}
                depth={0}
                onVote={onVote}
                onSubmitReply={onSubmitReply}
                commentLoading={commentLoading}
              />
            ))}
          </div>

          <form className="mt-4 border-t border-gray-100 pt-4" onSubmit={onCommentSubmit}>
            <div className="flex flex-wrap gap-2">
              <input
                className="rounded border border-gray-200 px-2 py-1 text-sm"
                type="text"
                placeholder="작성자"
                value={commentForm.writer}
                onChange={(event) => setCommentForm((prev) => ({ ...prev, writer: event.target.value }))}
              />
              <input
                className="rounded border border-gray-200 px-2 py-1 text-sm"
                type="password"
                placeholder="비밀번호"
                value={commentForm.password}
                onChange={(event) => setCommentForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </div>
            <textarea
              className="mt-2 w-full rounded border border-gray-200 px-2 py-1 text-sm"
              rows={3}
              placeholder="댓글을 입력하세요"
              value={commentForm.content}
              onChange={(event) => setCommentForm((prev) => ({ ...prev, content: event.target.value }))}
            />
            <div className="mt-2 flex items-center gap-2">
              <label className="inline-flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={commentForm.secret}
                  onChange={(event) => setCommentForm((prev) => ({ ...prev, secret: event.target.checked }))}
                />
                Secret
              </label>
              <label className="inline-flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={commentForm.spoiler}
                  onChange={(event) => setCommentForm((prev) => ({ ...prev, spoiler: event.target.checked }))}
                />
                Spoiler
              </label>
              <button type="submit" disabled={commentLoading} className="ml-auto rounded bg-brand-primary px-4 py-2 text-sm text-white disabled:opacity-50">
                {commentLoading ? '저장 중...' : '댓글 등록'}
              </button>
            </div>
          </form>
        </section>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
          <Link className="rounded-lg bg-brand-primary px-4 py-2 text-sm text-white" to={listPath}>
            List
          </Link>
          {rqstNo && (
            <button type="button" className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700" onClick={() => navigate(`${listPath}/write?parentNo=${rqstNo}`)}>
              답글
            </button>
          )}
          <button type="button" className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700" onClick={() => openPasswordModal('edit')}>
            Edit
          </button>
          <button type="button" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600" onClick={() => openPasswordModal('delete')}>
            Delete
          </button>
        </div>
      </article>

      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${showPasswordModal ? '' : 'hidden'}`}>
        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
          <h4 className="mb-4 text-base font-bold text-brand-dark">비밀번호 확인</h4>
          <input
            className="mb-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="rounded-lg bg-brand-primary px-4 py-2 text-sm text-white" onClick={onConfirm}>
              Confirm
            </button>
            <button type="button" className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700" onClick={() => setShowPasswordModal(false)}>
              취소
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AnnouncementWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rqstNo = searchParams.get('rqstNo') ?? '';
  const parentNo = searchParams.get('parentNo') ?? '';
  const isEdit = Boolean(rqstNo);
  const isReply = Boolean(parentNo);
  const title = '공지사항 등록';
  const listPath = ANNOUNCEMENT_PATHS.listPath;
  const [form, setForm] = useState({
    title: '',
    author: '',
    content: '',
    secret: false,
    password: '',
    confirmPassword: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit && !isReply) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = isReply
          ? await announcementApi.getReplyForm(parentNo)
          : await announcementApi.getWriteForm(rqstNo);
        if (!mounted || !data) return;

        setForm((prev) => ({
          ...prev,
          title: data.title ?? '',
          author: data.rqstId ?? '',
          content: data.cont ?? '',
          secret: data.secret === 'Y',
          password: data.password ?? '',
          confirmPassword: data.password ?? '',
        }));
      } catch {
        alert('수정할 데이터를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isEdit, isReply, listPath, rqstNo, parentNo]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.author || !form.content || !form.password) {
      alert('필수 항목을 모두 입력해 주세요.');
      return;
    }
    if (form.password.length < 4) {
      alert('비밀번호는 4자 이상 입력해 주세요.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
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
        secret: form.secret ? 'Y' : 'N',
        password: form.password,
      };

      if (isEdit) {
        await announcementApi.updateBoard(payload, files);
        alert(`${title} 수정이 완료되었습니다.`);
      } else {
        await announcementApi.saveBoard(payload, files);
        alert(isReply ? '답글이 등록되었습니다.' : `${title} 등록이 완료되었습니다.`);
      }

      navigate(listPath);
    } catch {
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-6">
        <header className="pb-4 mb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{isReply ? '답글 작성' : title}</h2>
        </header>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀글</label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={form.secret}
                  onChange={(event) => setForm((prev) => ({ ...prev, secret: event.target.checked }))}
                />
                비밀글로 등록
              </label>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">제목 <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="제목을 입력해 주세요."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">작성자<span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                value={form.author}
                onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
                placeholder="작성자를 입력해 주세요."
                readOnly={isEdit}
              />
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">내용 <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="내용을 입력해 주세요."
            />
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">첨부파일</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              type="file"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호<span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="비밀번호를 입력해 주세요."
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 확인<span className="text-red-500">*</span></label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                placeholder="비밀번호를 다시 입력해 주세요."
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-5 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? '저장 중...' : (isEdit ? '수정' : '등록')}
            </button>
            <Link className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700" to={listPath}>
              취소
            </Link>
          </div>
        </form>
      </article>
    </section>
  );
}