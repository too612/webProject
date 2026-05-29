import { useStatsDashboard } from './dashboardHook';
import { STATS_DASHBOARD_CARDS } from './dashboardModel';

export default function StatsDashboardPage() {
    const { data, loading, error } = useStatsDashboard();

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-xl font-bold text-brand-dark">대시보드</h2>
                <p className="text-sm text-gray-500 mt-0.5">교회 주요 현황을 한눈에 확인합니다.</p>
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</div>}
            {loading ? (
                <p className="text-gray-400 text-sm py-8 text-center">데이터를 불러오는 중…</p>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS_DASHBOARD_CARDS.map(({ key, label, accent }) => (
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
