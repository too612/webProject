import { FormEvent, useState } from 'react';
import type { BoardDto } from '../../types';

type BoardFormProps = {
  initialValue?: Partial<BoardDto>;
  onSubmit: (value: { title: string; content: string }) => Promise<void> | void;
  submitText?: string;
};

export default function BoardForm({
  initialValue,
  onSubmit,
  submitText = '저장',
}: BoardFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [content, setContent] = useState(initialValue?.content ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label htmlFor="board-title" className="text-sm font-medium text-gray-700">제목</label>
        <input
          id="board-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="board-content" className="text-sm font-medium text-gray-700">내용</label>
        <textarea
          id="board-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={8}
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1 bg-brand-primary text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-[#4e5caf] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '저장 중...' : submitText}
        </button>
      </div>
    </form>
  );
}
