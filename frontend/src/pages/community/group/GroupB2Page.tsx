import { useState, useEffect } from 'react';
import { communityApi } from '../../../api/communityApi';
import type { CommunityListResult } from '../../../api/communityApi';

export default function GroupB2Page() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [result, setResult] = useState<Omit<CommunityListResult<Record<string, unknown>>, 'items'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    communityApi.group.getB2({ page: 0, size: 20 })
      .then((res) => {
        setRows(res.items);
        setResult({ page: res.page, size: res.size, totalElements: res.totalElements, totalPages: res.totalPages });
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const totalMembers = result?.totalElements ?? rows.length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-brand-dark">B2 구역</h2>
          <p className="text-sm text-gray-500">B2 구역의 예배와 활동 현황을 확인합니다.</p>
        </div>
        <button type="button"
          className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">
          구역원 등록
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 px-5 py-4 text-center">
          <p className="text-xs text-gray-500 mb-1">전체인원</p>
          <strong className="text-2xl font-bold text-brand-dark">{totalMembers}명</strong>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 px-5 py-4 text-center">
          <p className="text-xs text-gray-500 mb-1">평균 출석률</p>
          <strong className="text-2xl font-bold text-brand-dark">89%</strong>
        </div>
        <div className="bg-white rounded-panel shadow-panel border border-gray-100 px-5 py-4 text-center">
          <p className="text-xs text-gray-500 mb-1">이번 달 기도제목</p>
          <strong className="text-2xl font-bold text-brand-dark">5개</strong>
        </div>
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-x-auto">
        {loading ? (
          <p className="px-4 py-8 text-center text-gray-400">데이터를 불러오는 중...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brand-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">이름</th>
                <th className="px-4 py-3 text-left font-medium">역할</th>
                <th className="px-4 py-3 text-left font-medium">나이</th>
                <th className="px-4 py-3 text-left font-medium">전화번호</th>
                <th className="px-4 py-3 text-left font-medium">출석률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">데이터가 없습니다.</td></tr>
              ) : rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{String(row.name ?? '')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(row.role ?? '')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(row.age ?? '')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(row.phone ?? '')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(row.attendance ?? '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
