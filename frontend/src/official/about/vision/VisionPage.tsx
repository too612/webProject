import { useEffect } from 'react';
import { useVisionContent } from './visionHook';
import { DEFAULT_VISION_CONTENT } from './visionModel';

export default function VisionPage() {
  const { visionContent, loading, error, loadVisionContent } = useVisionContent();

  useEffect(() => {
    loadVisionContent();
  }, [loadVisionContent]);

  const content = visionContent ?? DEFAULT_VISION_CONTENT;

  return (
    <section className="space-y-6">
      <div className="bg-brand-primary text-white rounded-panel p-6 text-center space-y-2">
        <h2 className="text-2xl font-bold">{content.headline}</h2>
        <p className="text-sm text-white/80">{content.summary}</p>
      </div>

      {(loading || error) && (
        <div className={`rounded-md px-3 py-2 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {error ?? '비전 정보를 불러오는 중입니다.'}
        </div>
      )}

      <div>
        <h3 className="font-bold text-brand-dark mb-3">핵심 비전</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.coreVisions.map((item) => (
            <div key={item.title} className="bg-white rounded-panel shadow-panel border border-gray-100 p-5 space-y-2">
              <h4 className="font-semibold text-brand-dark">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-brand-dark mb-3">사역 방향</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {content.ministryDirections.map((direction) => (
            <li key={direction} className="flex gap-2 items-start">
              <span className="text-brand-primary mt-0.5">•</span>
              <span>{direction}</span>
            </li>
          ))}
        </ul>
      </div>

      <blockquote className="border-l-4 border-brand-primary pl-4 italic text-sm text-gray-500">
        {content.bibleVerse}
      </blockquote>
    </section>
  );
}
