import { useEffect } from 'react';
import { useHistoryContent } from './historyHook';
import { DEFAULT_HISTORY_CONTENT } from './historyModel';

export default function HistoryPage() {
  const { historyContent, loading, error, loadHistoryContent } = useHistoryContent();

  useEffect(() => {
    loadHistoryContent();
  }, [loadHistoryContent]);

  const content = historyContent ?? DEFAULT_HISTORY_CONTENT;

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">{content.headline}</h2>
        <p className="text-sm text-gray-500">{content.summary}</p>
      </div>

      {(loading || error) && (
        <div className={`rounded-md px-3 py-2 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {error ?? '연혁 정보를 불러오는 중입니다.'}
        </div>
      )}

      <div className="space-y-4">
        {content.timeline.map((item) => (
          <div key={item.year} className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 flex gap-5">
            <div className="shrink-0 font-bold text-brand-primary text-sm w-16">{item.year}</div>
            <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
              {item.events.map((event) => (
                <li key={event}>{event}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
