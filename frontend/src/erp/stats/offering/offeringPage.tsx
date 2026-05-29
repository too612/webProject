import { useStatsOffering } from './offeringHook';
import { STATS_OFFERING_COLUMNS } from './offeringModel';

export default function StatsOfferingPage() {
  const { rows, loading, error } = useStatsOffering();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">헌금 통계</h2>
        <p className="text-sm text-gray-500 mt-0.5">월별 헌금 현황을 분석합니다.</p>
      </div>
      {error && <div className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</div>}
      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-primary text-white text-left">
              {STATS_OFFERING_COLUMNS.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={STATS_OFFERING_COLUMNS.length} className="px-4 py-8 text-center text-gray-400">
                  데이터를 불러오는 중…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={STATS_OFFERING_COLUMNS.length} className="px-4 py-8 text-center text-gray-400">
                  헌금 통계 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{row.month}</td>
                  <td className="px-4 py-3 text-gray-700">{row.tithe.toLocaleString()}원</td>
                  <td className="px-4 py-3 text-gray-700">{row.mission.toLocaleString()}원</td>
                  <td className="px-4 py-3 text-gray-700">{row.special.toLocaleString()}원</td>
                  <td className="px-4 py-3 text-gray-700">{row.other.toLocaleString()}원</td>
                  <td className="px-4 py-3 font-semibold text-brand-dark">{row.total.toLocaleString()}원</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
