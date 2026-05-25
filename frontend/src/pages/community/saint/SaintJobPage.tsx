import { FormEvent, useEffect, useState } from 'react';
import { communityApi } from '../../../api/communityApi';

export default function SaintJobPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [inputKeyword, setInputKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    communityApi.saint.getJob({ page, size: 10, keyword: keyword || undefined })
      .then((res) => {
        if (!mounted) return;
        setRows(res.items ?? []);
        setTotalPages(res.totalPages ?? 0);
        setTotalElements(res.totalElements ?? 0);
      })
      .catch(() => {
        if (!mounted) return;
        setRows([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [page, keyword]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
  };

  return (
    <section className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-lg font-bold text-brand-dark">성도 일자리</h2>
        <p className="text-sm text-gray-500">채용/구직 정보를 커뮤니티 내에서 공유합니다.</p>
      </div>
      <form className="flex gap-2" onSubmit={onSearch}>
        <input className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          placeholder="검색어를 입력하세요" value={inputKeyword} onChange={(e) => setInputKeyword(e.target.value)} />
        <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">검색</button>
      </form>
      <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary text-white"><tr>
            <th className="px-4 py-3 text-left font-medium">No.</th>
            <th className="px-4 py-3 text-left font-medium">제목</th>
            <th className="px-4 py-3 text-left font-medium">업체/개인</th>
            <th className="px-4 py-3 text-left font-medium">유형</th>
            <th className="px-4 py-3 text-left font-medium">등록일</th>
            <th className="px-4 py-3 text-left font-medium">상태</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">불러오는 중...</td></tr>
              : rows.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">등록된 항목이 없습니다.</td></tr>
                : rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{totalElements - (page * 10) - i}</td>
                    <td className="px-4 py-3 text-gray-700">{String(row.title ?? '-')}</td>
                    <td className="px-4 py-3 text-gray-700">{String(row.company ?? '-')}</td>
                    <td className="px-4 py-3 text-gray-700">{String(row.type ?? '-')}</td>
                    <td className="px-4 py-3 text-gray-700">{String(row.date ?? '-')}</td>
                    <td className="px-4 py-3 text-gray-700">{String(row.status ?? '-')}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>전체 {totalElements}건</span>
        <div className="flex items-center gap-2">
          <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">이전</button>
          <span>{page + 1} / {Math.max(totalPages, 1)}</span>
          <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">다음</button>
        </div>
      </div>
    </section>
  );
}
