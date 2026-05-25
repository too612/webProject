import { useEffect, useState } from 'react';
import { systemApi } from '../../../api/systemApi';
import type { SystemListQuery, SystemListResult } from '../../../api/systemApi';

type HistoryRow = {
  backupId: string;
  target: string;
  startTime: string;
  endTime: string;
  size: string;
  result: string;
  [key: string]: unknown;
};

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export default function BackupHistoryPage() {
  const [items, setItems] = useState<HistoryRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    const query: SystemListQuery = { page };
    ((systemApi.backup.getHistory(query) as unknown) as Promise<SystemListResult<HistoryRow>>)
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
  }, [page]);

  function getCellValue(row: HistoryRow, col: Column<HistoryRow>): React.ReactNode {
    if (col.render) return col.render(row);
    const key = col.key as string;
    const value = row[key];
    return value === null || value === undefined ? '-' : String(value);
  }

  const columns: Column<HistoryRow>[] = [
    { key: 'backupId', label: '백업 ID', render: (row: HistoryRow) => <code>{row.backupId}</code> },
    { key: 'target', label: '대상' },
    { key: 'startTime', label: '시작시간' },
    { key: 'endTime', label: '종료시간' },
    { key: 'size', label: '크기' },
    {
      key: 'result',
      label: '결과',
      render: (row: HistoryRow) => (
        <span className={`community-badge ${row.result === '성공' ? 'badge-active' : 'badge-danger'}`}>{row.result}</span>
      ),
    },
    {
      key: 'actions',
      label: '관리',
      render: (row: HistoryRow) =>
        row.result === '성공' ? <button type="button" className="btn btn-sm btn-secondary">복구</button> : '-',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">복구 이력 관리</h2>
          <p className="text-sm text-gray-500 mt-0.5">백업 파일의 복구 요청 이력을 조회하고 상태를 관리합니다.</p>
        </div>
      </div>

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