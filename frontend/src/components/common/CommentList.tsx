import type { CommentDto } from '../../types';

type CommentListProps = {
  comments: CommentDto[];
};

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p>등록된 댓글이 없습니다.</p>;
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <li key={comment.commentId} className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-800">{comment.content}</p>
          <small className="text-xs text-gray-400 mt-1 block">
            {comment.author} · {comment.createdAt}
          </small>
        </li>
      ))}
    </ul>
  );
}
