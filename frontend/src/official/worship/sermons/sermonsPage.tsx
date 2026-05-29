import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { sermonsApi } from './sermonsApi';
import { SERMONS_BASE_PATH } from './sermonsModel';
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

export default function SermonsPage() {
  const navigate = useNavigate();
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
  }, [page, searchType, keyword]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', String(page + 1));
    if (searchType) params.set('searchType', searchType);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    setSearchParams(params, { replace: true });
  }, [page, searchType, keyword, setSearchParams]);

  const rows: BoardItem[] = items.map((item, index) => ({
    id: item.rqstNo ?? '',
    rowNum: totalElements - (page * pageSize) - index,
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
    <>
      <section className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-brand-dark">주일설교</h2>
            <div className="text-sm text-gray-400 mt-0.5">게시물 수: {totalElements || rows.length} | 페이지: {page + 1}/{Math.max(totalPages, 1)}</div>
          </div>
          <div className="text-sm text-gray-500">홈 &gt; 예배 &gt; 주일설교</div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

        <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium" style={{ width: '6%' }}>번호</th>
                <th className="px-2 py-3" style={{ width: '4%' }}></th>
                <th className="px-4 py-3 font-medium text-left" style={{ width: '44%' }}>제목</th>
                <th className="px-4 py-3 font-medium" style={{ width: '13%' }}>작성자</th>
                <th className="px-4 py-3 font-medium" style={{ width: '13%' }}>작성일</th>
                <th className="px-4 py-3 font-medium" style={{ width: '8%' }}>조회</th>
                <th className="px-4 py-3 font-medium" style={{ width: '12%' }}>상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">등록된 게시물이 없습니다.</td>
                </tr>
              )}
              {rows.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-gray-500">{post.rowNum}</td>
                  <td className="px-2 py-3 text-center">
                    {post.hasFile && <span className="material-icons" style={{ fontSize: '16px', color: '#777', verticalAlign: 'middle' }} title="첨부파일 있음">attach_file</span>}
                  </td>
                  <td className="px-4 py-3">
                    {post.secret ? (
                      <button
                        type="button"
                        className={`text-brand-dark hover:text-brand-primary hover:underline text-left${post.depth > 0 ? ' pl-5' : ''}`}
                        onClick={() => setSecretModal({ show: true, rqstNo: String(post.id), password: '' })}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                      >
                        {post.depth > 0 && <span className="material-icons reply-icon" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>subdirectory_arrow_right</span>}
                        <span className="material-icons lock-icon">lock</span>
                        {post.title}
                        {post.commentCount > 0 && <span style={{ color: '#f44336', marginLeft: '4px', fontSize: '13px' }}>[{post.commentCount}]</span>}
                      </button>
                    ) : (
                      <Link to={`${VIEW_PATH}?rqstNo=${post.id}`} className={`text-brand-dark hover:text-brand-primary hover:underline${post.depth > 0 ? ' pl-5' : ''}`}>
                        {post.depth > 0 && <span className="material-icons reply-icon" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>subdirectory_arrow_right</span>}
                        {post.title}
                        {post.commentCount > 0 && <span style={{ color: '#f44336', marginLeft: '4px', fontSize: '13px' }}>[{post.commentCount}]</span>}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.author}</td>
                  <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.date}</td>
                  <td className="px-4 py-3 text-center text-gray-400 text-xs">{post.views}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.answered === false ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {post.answered === false ? '미답변' : '완료'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-1 justify-center">
          {pageButtons.map((buttonPage) => (
            <button
              key={buttonPage}
              type="button"
              className={`w-8 h-8 rounded text-sm ${buttonPage === page ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setPage(buttonPage)}
            >
              {buttonPage + 1}
            </button>
          ))}
        </div>

        <form className="flex flex-col sm:flex-row gap-2" onSubmit={onSearch}>
          <div className="flex gap-2 flex-1">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={searchType} onChange={(event) => setSearchType(event.target.value)}>
              <option value="title">제목</option>
              <option value="rqstId">작성자</option>
              <option value="cont">내용</option>
            </select>
            <input
              type="text"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="검색어를 입력하세요."
              value={inputKeyword}
              onChange={(event) => setInputKeyword(event.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 transition-colors" type="submit">검색</button>
            <Link className="inline-flex items-center bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4e5caf] transition-colors" to={WRITE_PATH}>글쓰기</Link>
          </div>
        </form>
      </section>

      {secretModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-brand-dark mb-4">비밀글 확인</h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>비밀번호를 입력하세요.</p>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4"
              type="password"
              value={secretModal.password}
              onChange={(event) => setSecretModal((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="비밀번호"
              onKeyDown={(event) => { if (event.key === 'Enter') onSecretConfirm(); }}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" className="bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium" onClick={onSecretConfirm}>확인</button>
              <button type="button" className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium" onClick={() => setSecretModal({ show: false, rqstNo: '', password: '' })}>취소</button>
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

function CommentItem({
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
    <div className={`bg-gray-50 rounded-lg p-4${depth > 0 ? ' border-l-2 border-gray-200' : ''}`} style={depth > 0 ? { marginLeft: `${depth * 24}px` } : {}}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          {depth > 0 && <span className="material-icons reply-icon" style={{ fontSize: '16px', verticalAlign: 'middle', color: '#888' }}>subdirectory_arrow_right</span>}
          <span className="font-semibold text-sm text-brand-dark">{comment.writer ?? '익명'}</span>
          <span className="text-xs text-gray-400">{comment.insDt ? String(comment.insDt).replace('T', ' ').slice(0, 16) : ''}</span>
          {isSecret && <span className="material-icons" style={{ fontSize: '14px', color: '#888' }} title="비밀글">lock</span>}
          {isSpoiler && <span className="spoiler-label" style={{ fontSize: '12px', color: '#f90', marginLeft: '4px' }}>스포일러</span>}
        </div>

        {isSecret ? (
          <div className="text-sm text-gray-400 italic">
            <span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>lock</span> 작성자만 볼 수 있는 댓글입니다.
          </div>
        ) : isSpoiler && !spoilerVisible ? (
          <div className="text-sm text-gray-700" style={{ filter: 'blur(6px)', cursor: 'pointer', userSelect: 'none' }} onClick={() => setSpoilerVisible(true)} title="클릭하면 내용을 볼 수 있습니다">
            {comment.content ?? ''}
          </div>
        ) : (
          <div className="text-sm text-gray-700">{comment.content ?? ''}</div>
        )}

        <div className="comment-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
          <button type="button" onClick={() => onVote(comment.commentId, 'like')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#555', fontSize: '13px' }}>
            <span className="material-icons" style={{ fontSize: '16px', color: '#4caf50' }}>thumb_up</span>
            {comment.likes ?? 0}
          </button>
          <button type="button" onClick={() => onVote(comment.commentId, 'dislike')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#555', fontSize: '13px' }}>
            <span className="material-icons" style={{ fontSize: '16px', color: '#f44336' }}>thumb_down</span>
            {comment.dislikes ?? 0}
          </button>
          {isSpoiler && spoilerVisible && (
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f90', fontSize: '12px' }} onClick={() => setSpoilerVisible(false)}>숨기기</button>
          )}
          <button type="button" onClick={() => setShowReplyForm((value) => !value)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '13px' }}>
            {showReplyForm ? '취소' : '답글'}
          </button>
        </div>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input className="form-input" type="text" placeholder="작성자" value={replyForm.writer} onChange={(event) => setReplyForm((prev) => ({ ...prev, writer: event.target.value }))} style={{ width: '110px' }} />
              <input className="form-input" type="password" placeholder="비밀번호" value={replyForm.password} onChange={(event) => setReplyForm((prev) => ({ ...prev, password: event.target.value }))} style={{ width: '110px' }} />
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}><input type="checkbox" checked={replyForm.secret} onChange={(event) => setReplyForm((prev) => ({ ...prev, secret: event.target.checked }))} />비밀글</label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}><input type="checkbox" checked={replyForm.spoiler} onChange={(event) => setReplyForm((prev) => ({ ...prev, spoiler: event.target.checked }))} />스포일러</label>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <textarea className="form-textarea" placeholder="답글을 입력하세요." value={replyForm.content} onChange={(event) => setReplyForm((prev) => ({ ...prev, content: event.target.value }))} rows={2} style={{ flex: 1 }} />
              <button type="submit" className="inline-flex items-center bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4e5caf] transition-colors disabled:opacity-40" disabled={commentLoading} style={{ alignSelf: 'flex-end' }}>{commentLoading ? '저장 중...' : '답글 저장'}</button>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && comment.replies.map((reply, index) => (
        <CommentItem key={`${reply.commentId ?? 'reply'}-${index}`} comment={reply} depth={depth + 1} onVote={onVote} onSubmitReply={onSubmitReply} commentLoading={commentLoading} />
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

  const loadData = async () => {
    if (!rqstNo) return;
    try {
      const data = await sermonsApi.getBoardView(rqstNo);
      setBoard(data.board);
      setComments(data.comments);
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
  const fileList: FileDto[] = board?.fileList ?? [];

  return (
    <section>
      <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-6">
        <header className="pb-5 mb-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{resolvedTitle}</h2>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons" style={{ fontSize: '16px' }}>person</span>{resolvedAuthor}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons" style={{ fontSize: '16px' }}>calendar_today</span>{resolvedDateTime}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500"><span className="material-icons" style={{ fontSize: '16px' }}>visibility</span>{resolvedViews}회</div>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${totalCommentCount > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{totalCommentCount > 0 ? '답변 완료' : '답변 대기'}</span>
          </div>
        </header>

        {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</div>}
        {loading && <div className="text-sm text-gray-400 text-center py-8">불러오는 중...</div>}

        <section className="py-4 prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: resolvedContent }} />

        {fileList.length > 0 && (
          <section style={{ margin: '16px 0', padding: '12px 16px', background: '#f8f8f8', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-icons" style={{ fontSize: '18px' }}>attach_file</span>
              첨부파일 ({fileList.length})
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {fileList.map((file, index) => (
                <li key={file.fileId ?? index} style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-icons" style={{ fontSize: '16px', color: '#777' }}>description</span>
                  <a href={file.downloadUrl ?? `/api${SERMONS_LIST_PATH}/download?fileId=${file.fileId}`} download={file.orgFileNm ?? file.filename} style={{ color: '#1976d2', textDecoration: 'none', fontSize: '14px' }}>
                    {file.orgFileNm ?? file.filename ?? `파일 ${index + 1}`}
                  </a>
                  {file.fileSize > 0 && <span style={{ color: '#999', fontSize: '12px' }}>({formatBytes(file.fileSize)})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 pt-6 border-t border-gray-100">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}><span className="material-icons">chat_bubble</span>댓글 {totalCommentCount}</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" onClick={() => setSortType('latest')} style={{ padding: '4px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: sortType === 'latest' ? '#1976d2' : '#fff', color: sortType === 'latest' ? '#fff' : '#333' }}>최신순</button>
              <button type="button" onClick={() => setSortType('popular')} style={{ padding: '4px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: sortType === 'popular' ? '#1976d2' : '#fff', color: sortType === 'popular' ? '#fff' : '#333' }}>인기순</button>
            </div>
          </div>

          <div className="space-y-3">
            {topLevelComments.length === 0 && !loading && <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>등록된 댓글이 없습니다.</div>}
            {topLevelComments.map((comment, index) => (
              <CommentItem key={`${comment.commentId ?? 'comment'}-${index}`} comment={comment} depth={0} onVote={onVote} onSubmitReply={onSubmitReply} commentLoading={commentLoading} />
            ))}
          </div>

          <form className="mt-4 pt-4 border-t border-gray-100" onSubmit={onCommentSubmit}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input className="form-input" type="text" placeholder="작성자" value={commentForm.writer} onChange={(event) => setCommentForm((prev) => ({ ...prev, writer: event.target.value }))} style={{ width: '120px' }} />
              <input className="form-input" type="password" placeholder="비밀번호" value={commentForm.password} onChange={(event) => setCommentForm((prev) => ({ ...prev, password: event.target.value }))} style={{ width: '120px' }} />
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}><input type="checkbox" checked={commentForm.secret} onChange={(event) => setCommentForm((prev) => ({ ...prev, secret: event.target.checked }))} />비밀글</label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}><input type="checkbox" checked={commentForm.spoiler} onChange={(event) => setCommentForm((prev) => ({ ...prev, spoiler: event.target.checked }))} />스포일러</label>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <textarea className="form-textarea" placeholder="댓글을 입력하세요." value={commentForm.content} onChange={(event) => setCommentForm((prev) => ({ ...prev, content: event.target.value }))} rows={3} style={{ flex: 1 }} />
              <button type="submit" className="inline-flex items-center bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4e5caf] transition-colors disabled:opacity-40" disabled={commentLoading} style={{ alignSelf: 'flex-end', marginLeft: '8px' }}>{commentLoading ? '저장 중...' : '댓글 저장'}</button>
            </div>
          </form>
        </section>

        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-gray-100">
          <Link className="inline-flex items-center bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#4e5caf] transition-colors" to={SERMONS_LIST_PATH}>목록</Link>
          {rqstNo && <button type="button" className="inline-flex items-center bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors" onClick={() => navigate(`${SERMONS_LIST_PATH}/write?parentNo=${rqstNo}`)}>답글 작성</button>}
          <button type="button" className="inline-flex items-center bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors" onClick={() => openPasswordModal('edit')}>수정</button>
          <button type="button" className="inline-flex items-center bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-100 transition-colors" onClick={() => openPasswordModal('delete')}>삭제</button>
        </div>
      </article>

      <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${showPasswordModal ? '' : 'hidden'}`}>
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
          <h4 className="text-base font-bold text-brand-dark mb-4">비밀번호 확인</h4>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호를 입력하세요" />
          <div className="flex gap-2 justify-end">
            <button type="button" className="bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-medium" onClick={onConfirm}>확인</button>
            <button type="button" className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium" onClick={() => setShowPasswordModal(false)}>취소</button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
          ? await sermonsApi.getReplyForm(parentNo)
          : await sermonsApi.getWriteForm(rqstNo);
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
        alert('수정할 설교를 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isEdit, isReply, parentNo, rqstNo]);

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
        await sermonsApi.updateBoard(payload, files);
        alert('설교 수정이 완료되었습니다.');
      } else {
        await sermonsApi.saveBoard(payload, files);
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
    <section>
      <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-6">
        <header className="pb-4 mb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-dark">{isReply ? '설교 답글 작성' : '설교 작성'}</h2>
        </header>

        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀글</label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={form.secret} onChange={(event) => setForm((prev) => ({ ...prev, secret: event.target.checked }))} />
                비밀글로 등록
              </label>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">제목 <span className="text-red-500">*</span></label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="제목을 입력해주세요." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">이름 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.author} onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))} placeholder="이름을 입력해주세요." readOnly={isEdit} />
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">내용 <span className="text-red-500">*</span></label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} placeholder="내용을 입력해주세요." />
          </div>

          <div className="space-y-1 mb-4">
            <label className="block text-sm font-medium text-gray-700">첨부파일</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="비밀번호" />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호 확인 <span className="text-red-500">*</span></label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" type="password" value={form.confirmPassword} onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))} placeholder="비밀번호 확인" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-brand-primary text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-40 transition-colors" disabled={loading}>{isEdit ? '수정하기' : '등록하기'}</button>
            <Link to={SERMONS_LIST_PATH} className="bg-gray-100 text-gray-700 rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">취소</Link>
          </div>
        </form>
      </article>
    </section>
  );
}
