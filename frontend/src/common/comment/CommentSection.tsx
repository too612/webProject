import React, { FormEvent, useEffect, useState } from 'react';
import { useComment, countComments } from './CommentHook';
import CommentItem from './CommentItem';
import type { CommentFormState } from './CommentModel';

interface CommentSectionProps {
  pgmId: string;
  refId: string | number;
}

export default function CommentSection({ pgmId, refId }: CommentSectionProps) {
  const { comments, loading, userVotes, loadComments, submitComment, handleVote } = useComment(pgmId, refId);
  const [sortType, setSortType] = useState<'latest' | 'popular'>('latest');
  const [commentForm, setCommentForm] = useState<CommentFormState>({
    writer: '', content: '', secret: false, spoiler: false, password: '', parentCommentId: undefined,
  });
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const onCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isInvalid = !commentForm.writer.trim() || !commentForm.content.trim() || !(commentForm.password ?? '').trim();
    if (isInvalid) {
      alert('작성자, 내용, 비밀번호는 필수입니다.');
      return;
    }
    setCommentLoading(true);
    try {
      await submitComment(commentForm);
      setCommentForm({ writer: '', content: '', secret: false, spoiler: false, password: '', parentCommentId: undefined });
    } catch {
      alert('댓글 저장 중 오류가 발생했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplySubmit = async (parentCommentId: number | undefined, form: CommentFormState) => {
    setCommentLoading(true);
    try {
      await submitComment(form);
    } catch {
      alert('답글 저장 중 오류가 발생했습니다.');
    } finally {
      setCommentLoading(false);
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortType === 'popular') {
      return ((b.likes ?? 0) - (b.dislikes ?? 0)) - ((a.likes ?? 0) - (a.dislikes ?? 0));
    }
    return String(b.insDt ?? '').localeCompare(String(a.insDt ?? ''));
  });

  const totalCount = countComments(comments);

  return (
    <section className="mt-6 pt-6 border-t border-gray-100">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 flex items-center gap-1 text-lg font-bold">
          <span className="material-icons">chat_bubble</span>댓글 {totalCount}
        </h3>
        <div className="flex gap-1.5">
          {(['latest', 'popular'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSortType(type)}
              className={`cursor-pointer rounded-md border px-2.5 py-1 text-[13px] transition-colors ${
                sortType === type ? 'border-slate-500 bg-slate-200 text-slate-800' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type === 'latest' ? '최신순' : '인기순'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {sortedComments.length === 0 && !loading && (
          <div className="py-6 text-center text-gray-400">등록된 댓글이 없습니다.</div>
        )}
        {sortedComments.map((comment, i) => (
          <CommentItem
            key={`${comment.commentId}-${i}`}
            comment={comment}
            depth={0}
            onVote={handleVote}
            onSubmitReply={handleReplySubmit}
            commentLoading={commentLoading}
            voteMap={userVotes}
          />
        ))}
      </div>

      {/* 댓글 작성 폼 — 스포일러 체크박스 추가 */}
      <form className="mt-4 pt-4 border-t border-gray-100" onSubmit={onCommentSubmit}>
        <textarea
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[56px]"
          placeholder="댓글을 입력하세요."
          value={commentForm.content}
          onChange={(e) => setCommentForm((prev) => ({ ...prev, content: e.target.value }))}
          rows={2}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <input
            className="border border-slate-200 rounded-md px-3 py-2 w-[104px]"
            type="text" placeholder="작성자"
            value={commentForm.writer}
            onChange={(e) => setCommentForm((prev) => ({ ...prev, writer: e.target.value }))}
          />
          <input
            className="border border-slate-200 rounded-md px-3 py-2 w-[104px]"
            type="password" placeholder="비밀번호"
            value={commentForm.password}
            onChange={(e) => setCommentForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <label htmlFor="comment-secret-main" className="inline-flex items-center gap-1 cursor-pointer">
            <input
              id="comment-secret-main"
              type="checkbox"
              checked={commentForm.secret}
              onChange={(e) => setCommentForm((prev) => ({ ...prev, secret: e.target.checked }))}
            />
            비밀글
          </label>
          {/* ★ 스포일러 체크박스 추가 */}
          <label htmlFor="comment-spoiler-main" className="inline-flex items-center gap-1 cursor-pointer">
            <input
              id="comment-spoiler-main"
              type="checkbox"
              checked={commentForm.spoiler}
              onChange={(e) => setCommentForm((prev) => ({ ...prev, spoiler: e.target.checked }))}
            />
            스포일러
          </label>
          <button
            type="submit"
            className="ml-auto bg-brand-primary text-white rounded-md px-4 py-2 font-medium hover:bg-[#4e5caf] disabled:opacity-40"
            disabled={commentLoading}
          >
            {commentLoading ? '저장 중...' : '댓글 저장'}
          </button>
        </div>
      </form>
    </section>
  );
}
