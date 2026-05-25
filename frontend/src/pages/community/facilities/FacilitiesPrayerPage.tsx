import { FormEvent, useEffect, useMemo, useState } from 'react';
import { communityApi } from '../../../api/communityApi';

type PrayerRow = {
  date: string;
  task: string;
  owner: string;
  status: string;
  [key: string]: unknown;
};

export default function FacilitiesPrayerPage() {
  const [allRows, setAllRows] = useState<PrayerRow[]>([]);
  const [page, setPage] = useState(0);
  const [inputKeyword, setInputKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    communityApi.facilities.getPrayer()
      .then((rooms) => {
        if (!mounted) return;
        setAllRows((rooms as unknown as PrayerRow[]) ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setAllRows([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredRows = useMemo(() => {
    if (!keyword) return allRows;
    const kw = keyword.toLowerCase();
    return allRows.filter((row) =>
      [row.date, row.task, row.owner, row.status]
        .map((v) => String(v ?? '').toLowerCase())
        .some((v) => v.includes(kw))
    );
  }, [allRows, keyword]);

  const pagedRows = useMemo(() => {
    const start = page * 10;
    return filteredRows.slice(start, start + 10);
  }, [filteredRows, page]);

  const totalElements = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / 10));

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setKeyword(inputKeyword.trim());
  };

  return (
    <section className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-lg font-bold text-brand-dark">기도실 예약</h2>
        <p className="text-sm text-gray-500">기도 공간 예약 및 새벽기도 일정을 관리합니다.</p>
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
            <th className="px-4 py-3 text-left font-medium">일정</th>
            <th className="px-4 py-3 text-left font-medium">업무</th>
            <th className="px-4 py-3 text-left font-medium">담당자</th>
            <th className="px-4 py-3 text-left font-medium">상태</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">불러오는 중...</td></tr>
              : pagedRows.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">등록된 항목이 없습니다.</td></tr>
                : pagedRows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{totalElements - (page * 10) - i}</td>
                    <td className="px-4 py-3 text-gray-700">{String(row.date ?? '-')}</td>
                    <td className="px-4 py-3 text-gray-700">{String(row.task ?? '-')}</td>
                    <td className="px-4 py-3 text-gray-700">{String(row.owner ?? '-')}</td>
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
          <span>{page + 1} / {totalPages}</span>
          <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">다음</button>
        </div>
      </div>
    </section>
  );
}
