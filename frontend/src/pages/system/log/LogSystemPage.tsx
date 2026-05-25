import { FormEvent, useEffect, useState } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';

type LogRow = {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  ip: string;
  [key: string]: unknown;
};

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

const LEVEL_CLASS: Record<string, string> = {
  INFO: 'badge-active',
  WARN: 'badge-warning',
  ERROR: 'badge-danger',
};

export default function LogSystemPage() {
  const [items, setItems] = useState<LogRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    const query: SystemListQuery = { page, keyword: keyword || undefined };
    ((systemApi.log.getSystem(query) as unknown) as Promise<SystemListResult<LogRow>>)
      .then((result) => {
        if (!mounted) return;
        setItems(result.items ?? []);
        setTotalPages(result.totalPages ?? 0);
        setTotalElements(result.totalElements ?? 0);
      })
      .catch(() => {
        if (!mounted) return;
        setError('데이터를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, keyword]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setPage(0);
    setKeyword(inputKeyword);
  }

  function getCellValue(row: LogRow, col: Column<LogRow>): React.ReactNode {
    if (col.render) return col.render(row);
    const key = col.key as string;
    const value = row[key];
    return value === null || value === undefined ? '-' : String(value);
  }

  const columns: Column<LogRow>[] = [
    { key: 'timestamp', label: '시간' },
    {
      key: 'level',
      label: '레벨',
      render: (row: LogRow) => <span className={`community-badge ${LEVEL_CLASS[row.level] ?? ''}`}>{row.level}</span>,
    },
    { key: 'category', label: '분류' },
    { key: 'message', label: '메시지' },
    { key: 'ip', label: 'IP' },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">시스템 로그 조회</h2>
          <p className="text-sm text-gray-500 mt-0.5">시스템 각 모듈에서 발생한 이벤트 로그를 확인하고 이상을 분석합니다.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1 bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4e5caf] transition-colors">
          로그 내보내기
        </button>
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="메시지 검색"
          value={inputKeyword}
          onChange={(event) => setInputKeyword(event.target.value)}
        />
        <button type="submit" className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
          검색
        </button>
      </form>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 font-medium">
              <th className="px-4 py-3 w-12 text-center">No.</th>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">불러오는 중...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">데이터가 없습니다.</td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-gray-400">{page * 10 + idx + 1}</td>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-700">{getCellValue(row, col)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">전체 {totalElements}건</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            이전
          </button>
          <span className="px-3 text-gray-600">{page + 1} / {Math.max(totalPages, 1)}</span>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            다음
          </button>
        </div>
      </div>
    </section>
  );
}