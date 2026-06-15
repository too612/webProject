import { useState, useCallback } from 'react';
import { commentApi } from './CommentApi';
import type { CommentItem, CommentFormState } from './CommentModel';

export function useComment(pgmId: string, refId: string | number) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, string | undefined>>({});

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await commentApi.getList(pgmId, refId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }, [pgmId, refId]);

  const submitComment = async (form: CommentFormState) => {
    await commentApi.save({
      pgmId,
      refId: String(refId),
      ...form,
      secret: form.secret ? 'Y' : 'N',
      spoiler: form.spoiler ? 'Y' : 'N',
    });
    await loadComments();
  };

  const handleVote = async (commentId: number | string, action: 'like' | 'dislike') => {
    const result = await commentApi.vote(commentId, action);
    if (result) {
      setUserVotes(prev => ({ ...prev, [String(commentId)]: result.userVote }));
      setComments(prev => updateVotes(prev, commentId, result.likes, result.dislikes));
    }
  };

  return { comments, loading, userVotes, loadComments, submitComment, handleVote };
}

function updateVotes(list: CommentItem[], id: number | string, likes: number, dislikes: number): CommentItem[] {
  return list.map(item => {
    if (String(item.commentId) === String(id)) return { ...item, likes, dislikes };
    if (item.replies) return { ...item, replies: updateVotes(item.replies, id, likes, dislikes) };
    return item;
  });
}

export function countComments(list: CommentItem[]): number {
  return (list || []).reduce((sum, c) => sum + 1 + countComments(c.replies ?? []), 0);
}