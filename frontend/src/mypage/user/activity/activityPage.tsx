import { useMypageActivityPage } from './activityHook';

export default function ActivityPage() {
  const { items, loading, error } = useMypageActivityPage();

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-brand-dark">내 활동 내역</h2>
        <p className="text-sm text-gray-500">나의 활동 기록을 확인하세요</p>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</div>}

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-6 space-y-3">
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-8">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">활동 내역이 없습니다.</p>
        ) : (
          items.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
              <span className="shrink-0 bg-brand-primary/10 text-brand-primary text-xs font-medium px-2.5 py-1 rounded-full">{activity.type}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{activity.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
