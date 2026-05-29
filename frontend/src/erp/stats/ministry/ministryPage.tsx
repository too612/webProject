import { useStatsMinistry } from './ministryHook';
import { STATS_MINISTRY_COLUMNS } from './ministryModel';

export default function StatsMinistryPage() {
  const { rows, loading } = useStatsMinistry();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">사역 통계</h2>
        <p className="text-sm text-gray-500 mt-0.5">사역부서별 활동 현황을 분석합니다.</p>
      </div>
      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-primary text-white text-left">
              {STATS_MINISTRY_COLUMNS.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={STATS_MINISTRY_COLUMNS.length} className="px-4 py-8 text-center text-gray-400">
                  데이터를 불러오는 중…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={STATS_MINISTRY_COLUMNS.length} className="px-4 py-8 text-center text-gray-400">
                  사역 통계 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{row.ministryName}</td>
                  <td className="px-4 py-3 text-gray-700">{row.memberCount}명</td>
                  <td className="px-4 py-3 text-gray-700">{row.activityCount}회</td>
                  <td className="px-4 py-3 text-gray-700">{row.volunteerCount}명</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
