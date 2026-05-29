import { useEffect } from 'react';
import { useBeliefsContent } from './beliefsHook';
import { DEFAULT_BELIEFS_CONTENT } from './beliefsModel';

export default function BeliefsPage() {
  const { beliefsContent, loading, error, loadBeliefsContent } = useBeliefsContent();

  useEffect(() => {
    loadBeliefsContent();
  }, [loadBeliefsContent]);

  const content = beliefsContent ?? DEFAULT_BELIEFS_CONTENT;

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-brand-dark">{content.headline}</h2>
        <p className="text-sm text-gray-500">{content.summary}</p>
      </div>

      {(loading || error) && (
        <div className={`rounded-md px-3 py-2 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {error ?? '신앙고백 정보를 불러오는 중입니다.'}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {content.beliefs.map((belief) => (
          <div key={belief.title} className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
            <h3 className="font-semibold text-brand-dark">{belief.title}</h3>
            <p className="text-sm text-gray-600">{belief.description}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">{content.footerNote}</p>
    </section>
  );
}
