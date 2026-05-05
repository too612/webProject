import { useEffect, useState } from 'react';
import { erpApi } from '../../../api/erpApi';

type MinistryStatRow = {
  ministryName: string;
  memberCount: number;
  activityCount: number;
  volunteerCount: number;
};

export default function StatsMinistryPage() {
  const [rows, setRows] = useState<MinistryStatRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    erpApi.stats.getMinistry()
      .then(res => setRows(res as MinistryStatRow[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">사역 통계</h2>
        <p className="text-sm text-gray-500 mt-0.5">사역부서별 활동 현황을 분석합니다.</p>
      </div>
      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead><tr className="bg-brand-primary text-white text-left">
            <th className="px-4 py-3 font-medium">사역부서</th>
            <th className="px-4 py-3 font-medium">인원 수</th>
            <th className="px-4 py-3 font-medium">활동 횟수</th>
            <th className="px-4 py-3 font-medium">봉사자 수</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">데이터를 불러오는 중…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">사역 통계 데이터가 없습니다.</td></tr>
            ) : rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{r.ministryName}</td>
                <td className="px-4 py-3 text-gray-700">{r.memberCount}명</td>
                <td className="px-4 py-3 text-gray-700">{r.activityCount}회</td>
                <td className="px-4 py-3 text-gray-700">{r.volunteerCount}명</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
