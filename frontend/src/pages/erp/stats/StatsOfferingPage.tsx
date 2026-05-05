import { useEffect, useState } from 'react';
import { erpApi } from '../../../api/erpApi';

type OfferingRow = {
  month: string;
  tithe: number;
  mission: number;
  special: number;
  other: number;
  total: number;
};

export default function StatsOfferingPage() {
  const [rows, setRows] = useState<OfferingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    erpApi.stats.getOffering()
      .then(res => setRows(res as OfferingRow[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">헌금 통계</h2>
        <p className="text-sm text-gray-500 mt-0.5">월별 헌금 현황을 분석합니다.</p>
      </div>
      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead><tr className="bg-brand-primary text-white text-left">
            <th className="px-4 py-3 font-medium">월</th>
            <th className="px-4 py-3 font-medium">십일조</th>
            <th className="px-4 py-3 font-medium">선교헌금</th>
            <th className="px-4 py-3 font-medium">특별헌금</th>
            <th className="px-4 py-3 font-medium">기타</th>
            <th className="px-4 py-3 font-medium">합계</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">데이터를 불러오는 중…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">헌금 통계 데이터가 없습니다.</td></tr>
            ) : rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{r.month}</td>
                <td className="px-4 py-3 text-gray-700">{r.tithe.toLocaleString()}원</td>
                <td className="px-4 py-3 text-gray-700">{r.mission.toLocaleString()}원</td>
                <td className="px-4 py-3 text-gray-700">{r.special.toLocaleString()}원</td>
                <td className="px-4 py-3 text-gray-700">{r.other.toLocaleString()}원</td>
                <td className="px-4 py-3 font-semibold text-brand-dark">{r.total.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
