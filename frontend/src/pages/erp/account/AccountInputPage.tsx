import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../../api/client';

export default function AccountInputPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ transDate: '', category: '', transType: 'income', amount: '', memo: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await client.post('/erp/account/input', form);
      navigate('/erp/account/manager');
    } catch {
      setError('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">수입 및 지출 내역을 입력합니다.</p>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>}
      <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">거래일</label>
          <input type="date" name="transDate" value={form.transDate} onChange={handleChange} required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">유형</label>
          <select name="transType" value={form.transType} onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
            <option value="income">수입</option>
            <option value="expense">지출</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">항목</label>
          <input name="category" value={form.category} onChange={handleChange} required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">금액</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">비고</label>
          <textarea name="memo" value={form.memo} onChange={handleChange} rows={3}
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
