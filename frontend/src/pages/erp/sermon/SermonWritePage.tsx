import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../../api/client';

export default function SermonWritePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', preacher: '', scripture: '', content: '', sermonDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await client.post('/erp/sermon/write', form);
      navigate('/erp/sermon/manager');
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">설교 등록</h2>
        <p className="text-sm text-gray-500 mt-0.5">새로운 설교를 등록합니다.</p>
      </div>
      {error && <div className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</div>}
      <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">설교 제목</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">설교자</label>
          <input name="preacher" value={form.preacher} onChange={handleChange} required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">본문</label>
          <input name="scripture" value={form.scripture} onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">설교일</label>
          <input type="date" name="sermonDate" value={form.sermonDate} onChange={handleChange} required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">내용</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={6}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            취소
          </button>
          <button type="submit" disabled={submitting}
            className="px-4 py-2 rounded bg-brand-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-colors">
            {submitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </section>
  );
}
