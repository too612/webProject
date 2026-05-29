import { useEventCalendar } from './calendarHook';
import { EVENT_CALENDAR_CURRENT_YEAR, EVENT_CALENDAR_YEAR_OFFSETS } from './calendarModel';

export default function EventCalendarPage() {
  const { year, month, events, loading, error, handleYearChange, handleMonthChange } = useEventCalendar();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-dark">행사 달력</h2>
        <p className="text-sm text-gray-500 mt-0.5">월별 교회 행사 일정을 조회합니다.</p>
      </div>

      <div className="flex gap-2">
        <select
          value={year}
          onChange={(event) => handleYearChange(event.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          {EVENT_CALENDAR_YEAR_OFFSETS.map((offset) => {
            const optionYear = String(Number(EVENT_CALENDAR_CURRENT_YEAR) - offset);
            return (
              <option key={optionYear} value={optionYear}>
                {optionYear}년
              </option>
            );
          })}
        </select>
        <select
          value={month}
          onChange={(event) => handleMonthChange(event.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          {Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')).map((optionMonth) => (
            <option key={optionMonth} value={optionMonth}>
              {Number(optionMonth)}월
            </option>
          ))}
        </select>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</div>}

      <div className="overflow-x-auto rounded-panel shadow-panel border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-primary text-white text-left">
              <th className="px-4 py-3 font-medium w-12">No.</th>
              <th className="px-4 py-3 font-medium">행사명</th>
              <th className="px-4 py-3 font-medium">일자</th>
              <th className="px-4 py-3 font-medium">장소</th>
              <th className="px-4 py-3 font-medium">담당자</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  불러오는 중...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  등록된 행사가 없습니다.
                </td>
              </tr>
            ) : (
              events.map((eventItem, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 text-center">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{String(eventItem.title ?? '-')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(eventItem.eventDate ?? '-')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(eventItem.location ?? '-')}</td>
                  <td className="px-4 py-3 text-gray-700">{String(eventItem.manager ?? '-')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}