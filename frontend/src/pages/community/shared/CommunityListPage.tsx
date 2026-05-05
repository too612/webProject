import { FormEvent, useEffect, useState } from 'react';
import type { CommunityListResult, CommunityListQuery } from '../../../api/communityApi';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type CommunityListPageProps<T extends Record<string, unknown>> = {
  title: string;
  description: string;
  columns: Column<T>[];
  fetchFn: (q: CommunityListQuery) => Promise<CommunityListResult<T>>;
  searchable?: boolean;
  onAdd?: () => void;
  addLabel?: string;
};

export default function CommunityListPage<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  fetchFn,
  searchable = false,
  onAdd,
  addLabel = '+ 추가',
}: CommunityListPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const safeColumns = columns ?? [];
  const safeItems = items ?? [];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    fetchFn({ page, keyword: keyword || undefined })
      .then((result) => {
        if (!mounted) return;
        setItems((result.items ?? []) as T[]);
        setTotalPages(result.totalPages ?? 0);
        setTotalElements(result.totalElements ?? 0);
      })
      .catch(() => { if (!mounted) return; setError('데이터를 불러오지 못했습니다.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [page, keyword, fetchFn]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setPage(0);
    setKeyword(inputKeyword);
  }

  function getCellValue(row: T, col: Column<T>): React.ReactNode {
    if (col.render) return col.render(row);
    const key = col.key as string;
    const value = row[key];
    return value === null || value === undefined ? '-' : String(value);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-brand-dark">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {onAdd && (
          <button type="button" onClick={onAdd}
            className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">
            {addLabel}
          </button>
        )}
      </div>

      {searchable && (
        <form className="flex gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
          <button type="submit"
            className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-primary/90 transition-colors">
            검색
          </button>
        </form>
      )}

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>}

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium w-12">No.</th>
              {safeColumns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3 text-left font-medium">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={safeColumns.length + 1} className="px-4 py-8 text-center text-gray-400">불러오는 중...</td>
              </tr>
            ) : safeItems.length === 0 ? (
              <tr>
                <td colSpan={safeColumns.length + 1} className="px-4 py-8 text-center text-gray-400">등록된 항목이 없습니다.</td>
              </tr>
            ) : (
              safeItems.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{page * 10 + idx + 1}</td>
                  {safeColumns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-700">{getCellValue(row, col)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>전체 {totalElements}건</span>
        <div className="flex items-center gap-2">
          <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            이전
          </button>
          <span>{page + 1} / {Math.max(totalPages, 1)}</span>
          <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            다음
          </button>
        </div>
      </div>
    </section>
  );
}
