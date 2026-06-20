import { useEffect } from 'react';
import { useNextstepsContent } from './nextstepsHook';
import { DEFAULT_NEXTSTEPS_CONTENT } from './nextstepsModel';

export default function NextstepsPage() {
  const { nextstepsContent, loading, error, loadNextstepsContent } = useNextstepsContent();

  useEffect(() => { loadNextstepsContent(); }, [loadNextstepsContent]);

  const content = nextstepsContent ?? DEFAULT_NEXTSTEPS_CONTENT;

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{content.headline}</h2>
        </div>
        {loading && <div className="text-sm text-slate-500 py-4">불러오는 중...</div>}
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">{error}</div>}
      </div>
    </section>
  );
}