import { useEffect, useMemo, useState } from 'react';
import { useHistoryContent } from './historyHook';
import { DEFAULT_HISTORY_CONTENT } from './historyModel';

type HistoryRange = {
  key: string;
  label: string;
  matchYear: (year: number) => boolean;
};

const toYearNumber = (value: string): number | null => {
  const yearText = value.replace(/[^0-9]/g, '').slice(0, 4);
  const year = Number(yearText);
  return Number.isFinite(year) && year > 0 ? year : null;
};

const RANGE_TABS: HistoryRange[] = [
  { key: 'all', label: '전체', matchYear: () => true },
  { key: '2020-current', label: '2020~현재', matchYear: (year) => year >= 2020 },
  { key: '2010-2019', label: '2010~2019', matchYear: (year) => year >= 2010 && year <= 2019 },
  { key: '2000-2009', label: '2000~2009', matchYear: (year) => year >= 2000 && year <= 2009 },
  { key: '1990-1999', label: '1990~1999', matchYear: (year) => year >= 1990 && year <= 1999 },
  { key: '1987-1989', label: '1987~1989', matchYear: (year) => year >= 1987 && year <= 1989 },
];

export default function HistoryPage() {
  const { historyContent, loading, error, loadHistoryContent } = useHistoryContent();
  const [activeRangeKey, setActiveRangeKey] = useState('all');

  useEffect(() => {
    loadHistoryContent();
  }, [loadHistoryContent]);

  const content = historyContent ?? DEFAULT_HISTORY_CONTENT;
  const activeRange = RANGE_TABS.find((range) => range.key === activeRangeKey) ?? RANGE_TABS[0];

  const filteredTimeline = useMemo(
    () => content.timeline.filter((item) => {
      const year = toYearNumber(item.year);
      return year === null ? activeRange.key === 'all' : activeRange.matchYear(year);
    }),
    [content.timeline, activeRange]
  );

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{content.headline}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{content.summary}</p>
        </div>

        {(loading || error) && (
          <div className={`px-3 py-2 text-sm border ${error ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
            {error ?? '연혁 정보를 불러오는 중입니다.'}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <ul className="grid grid-cols-2 md:grid-cols-6 w-full">
              {RANGE_TABS.map((range) => {
                const isActive = range.key === activeRange.key;
                return (
                  <li key={range.key} className="w-full">
                    <button
                      type="button"
                      onClick={() => setActiveRangeKey(range.key)}
                      className={`w-full px-2 py-3 text-sm border border-slate-200 transition-colors ${isActive
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      {range.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-3">
            {filteredTimeline.map((item) => (
              <div key={item.year} className="border border-slate-200 bg-white p-4 md:p-5">
                <div className="grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] gap-3 md:gap-5">
                  <div className="font-bold text-brand-primary text-lg md:text-xl leading-none">{item.year}</div>
                  <div className="space-y-2">
                    {item.events.map((event, eventIndex) => (
                      <div key={`${item.year}-${event.date}-${eventIndex}`} className="space-y-2 border-t border-slate-100 pt-2 first:border-t-0 first:pt-0">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <strong className="font-bold text-slate-900 mr-2">{event.date}</strong>
                          <span>{event.description}</span>
                        </p>
                        {event.images && event.images.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {event.images.map((imagePath) => (
                              <img
                                key={imagePath}
                                src={imagePath}
                                alt={`${item.year} ${event.date} 연혁 사진`}
                                className="w-full h-40 object-cover border border-slate-200 bg-slate-100"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {filteredTimeline.length === 0 && (
              <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                선택한 기간에 표시할 연혁 데이터가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
