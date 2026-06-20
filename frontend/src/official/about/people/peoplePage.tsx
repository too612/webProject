import { useEffect } from 'react';
import { usePeopleContent } from './peopleHook';
import { DEFAULT_PEOPLE_CONTENT } from './peopleModel';

export default function PeoplePage() {
  const { peopleContent, loading, error, loadPeopleContent } = usePeopleContent();

  useEffect(() => {
    loadPeopleContent();
  }, [loadPeopleContent]);

  const content = peopleContent ?? DEFAULT_PEOPLE_CONTENT;

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{content.headline}</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{content.summary}</p>
        </div>

        {(loading || error) && (
          <div className={`px-3 py-2 text-sm border ${error ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
            {error ?? '비전 정보를 불러오는 중입니다.'}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5">
          <div className="space-y-4">
            <h3 className="font-bold text-brand-dark">핵심 비전</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.coreVisions.map((item) => (
                <article key={item.title} className="border border-slate-200 bg-white p-5 space-y-2">
                  <h4 className="font-semibold text-brand-dark">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-brand-dark">사역 방향</h3>
            <aside className="border border-slate-200 bg-slate-50/70 p-5">
              <ul className="space-y-2 text-sm text-gray-700">
                {content.ministryDirections.map((direction) => (
                  <li key={direction} className="flex gap-2 items-start">
                    <span className="mt-[7px] inline-block h-1.5 w-1.5 bg-brand-primary" aria-hidden="true" />
                    <span>{direction}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>

        <blockquote className="border-l-4 border-brand-primary bg-white px-4 py-3 italic text-sm text-gray-600">
          {content.bibleVerse}
        </blockquote>
      </div>
    </section>
  );
}