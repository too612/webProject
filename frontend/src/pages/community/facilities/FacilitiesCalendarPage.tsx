import { useState, useEffect } from 'react';
import { communityApi } from '../../../api/communityApi';

interface CalendarEvent {
  day: string;
  label: string;
  tone: string;
}

const toneClass: Record<string, string> = {
  primary: 'bg-brand-primary/10 text-brand-primary',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
};

export default function FacilitiesCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    communityApi.facilities.getCalendar(String(year), String(month))
      .then((items) => setEvents((items ?? []) as CalendarEvent[]))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-brand-dark">시설 일정표</h2>
          <p className="text-sm text-gray-500">예배당, 교육관, 모임 공간 사용 일정을 확인합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={prevMonth}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            이전달
          </button>
          <span className="font-semibold text-brand-dark min-w-[7rem] text-center">{year}년 {month}월</span>
          <button type="button" onClick={nextMonth}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            다음달
          </button>
          <button type="button"
            className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">
            일정 등록
          </button>
        </div>
      </div>

      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg px-4 py-3 text-sm text-brand-dark">
        <strong>안내</strong> 예약 전 담당자 또는 사전에 시설 정보를 확인하고 방문 전 예약 상태를 확인하십시오.
      </div>

      {loading ? (
        <p className="px-4 py-8 text-center text-gray-400">데이터를 불러오는 중...</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = String(index + 1).padStart(2, '0');
            const event = events.find((item) => item.day === day);
            return (
              <article key={day}
                className="bg-white rounded-card shadow-card border border-gray-100 px-2 py-2 min-h-[4.5rem] flex flex-col">
                <div className="text-xs font-semibold text-gray-400 mb-1">{day}</div>
                {event ? (
                  <div className={`text-xs rounded px-1.5 py-0.5 font-medium ${toneClass[event.tone] ?? 'bg-gray-100 text-gray-600'}`}>
                    {event.label}
                  </div>
                ) : (
                  <div className="text-xs text-gray-300">일정 없음</div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
