import { useEffect, useMemo } from 'react';
import { useWorshipTimeItems } from './worshipTimeHook';

export default function WorshipTimePage() {
  const { items, loading, error, loadWorshipTimeItems } = useWorshipTimeItems();

  useEffect(() => {
    loadWorshipTimeItems();
  }, [loadWorshipTimeItems]);

  const schedules = useMemo(
    () => [...items].sort((left, right) => (left.orderNo ?? 999) - (right.orderNo ?? 999)),
    [items]
  );

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">예배 시간 안내</h2>
        <p className="text-sm text-gray-500">정기 예배 및 모임 일정을 안내드립니다.</p>
        {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && schedules.length === 0 && (
          <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 text-sm text-gray-500">
            등록된 예배 시간이 없습니다.
          </article>
        )}
        {schedules.map((item) => (
          <article className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2" key={`${item.orderNo ?? 0}-${item.time ?? ''}-${item.title ?? ''}`}>
            <span className="text-xs text-brand-primary font-medium">{item.time ?? '-'}</span>
            <h3 className="font-semibold text-brand-dark">{item.title ?? item.category ?? '예배'}</h3>
            <p className="text-sm text-gray-500">{item.note ?? ''}</p>
          </article>
        ))}
      </div>

      <div className="bg-white rounded-panel shadow-panel border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">구분</th>
              <th className="px-4 py-3 text-left font-medium">시간</th>
              <th className="px-4 py-3 text-left font-medium">비고</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedules.map((item) => (
              <tr key={`table-${item.orderNo ?? 0}-${item.title ?? ''}`}>
                <td className="px-4 py-3 text-gray-700">{item.category ?? item.title ?? '-'}</td>
                <td className="px-4 py-3 text-gray-700">{item.time ?? '-'}</td>
                <td className="px-4 py-3 text-gray-500">{item.location ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center">예배 시간은 교회 일정에 따라 변경될 수 있습니다. 변경 시 공지사항을 확인해 주세요.</p>
    </section>
  );
}
