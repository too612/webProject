import { useEffect, useState } from 'react';
import { erpApi } from '../../../api/erpApi';

type DashboardData = Record<string, number>;

export default function StatsDashboardPage() {
  const [data, setData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    erpApi.stats.getDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { key: 'totalMembers', label: '전체 성도 수', accent: 'border-l-indigo-600' },
    { key: 'newMembers', label: '이번 달 새가족', accent: 'border-l-emerald-600' },
    { key: 'avgAttendance', label: '평균 출석률(%)', accent: 'border-l-amber-600' },
    { key: 'totalOffering', label: '이번 달 헌금', accent: 'border-l-red-600' },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">대시보드</h2>
        <p className="text-sm text-gray-500 mt-0.5">교회 주요 현황을 한눈에 확인합니다.</p>
      </div>
      {loading ? (
        <p className="text-gray-400 text-sm py-8 text-center">데이터를 불러오는 중…</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ key, label, accent }) => (
            <div key={key} className={`bg-white rounded-panel shadow-panel border border-l-4 ${accent} px-5 py-4`}>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-2xl font-bold text-brand-dark">{data[key] ?? 0}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
