import { useEffect, useState } from 'react';
import { erpApi } from '../../../api/erpApi';

const CURRENT_YEAR = String(new Date().getFullYear());
const CURRENT_MONTH = String(new Date().getMonth() + 1).padStart(2, '0');

export default function EventCalendarPage() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    erpApi.event.getCalendar(year, month)
      .then((result) => { if (mounted) setEvents(result as Record<string, unknown>[]); })
      .catch(() => { if (mounted) setError('데이터를 불러오지 못했습니다.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [year, month]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">행사 달력</h2>
        <p className="text-sm text-gray-500 mt-0.5">월별 교회 행사 일정을 조회합니다.</p>
      </div>

      <div className="flex gap-2">
        <select value={year} onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
          {[0, 1, 2].map((offset) => {
            const y = String(Number(CURRENT_YEAR) - offset);
            return <option key={y} value={y}>{y}년</option>;
          })}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
            <option key={m} value={m}>{Number(m)}월</option>
          ))}
        </select>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</div>}

      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead><tr className="bg-brand-primary text-white text-left">
            <th className="px-4 py-3 font-medium w-12">No.</th>
            <th className="px-4 py-3 font-medium">행사명</th>
            <th className="px-4 py-3 font-medium">일자</th>
            <th className="px-4 py-3 font-medium">장소</th>
            <th className="px-4 py-3 font-medium">담당자</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">불러오는 중...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">등록된 행사가 없습니다.</td></tr>
            ) : (
              events.map((ev, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 text-center">{idx + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{String(ev.title ?? '-')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(ev.eventDate ?? '-')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(ev.location ?? '-')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(ev.manager ?? '-')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
