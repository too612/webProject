import { useEffect } from 'react';
import { useOutreachContent } from './outreachHook';
import { DEFAULT_OUTREACH_CONTENT } from './outreachModel';

export default function OutreachPage() {
  const { outreachContent, loading, error, loadOutreachContent } = useOutreachContent();

  useEffect(() => {
    loadOutreachContent();
  }, [loadOutreachContent]);

  const content = outreachContent ?? DEFAULT_OUTREACH_CONTENT;

  return (
    <section className="space-y-5">
      {/* 상단: 배경이미지 + 설명 */}
      <div className="relative rounded-none overflow-hidden bg-slate-800 min-h-[260px] flex items-center">
        {content.backgroundImageUrl && (
          <img
            src={content.backgroundImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div className="relative z-10 w-full p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{content.headline}</h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-3xl">{content.summary}</p>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-500 py-4 text-center">선교 정보를 불러오는 중입니다.</div>}
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">{error}</div>}

      {/* 하단: 주요 활동 이미지 카드뉴스 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {content.activities.map((activity, index) => (
          <article key={activity.title} className="border border-slate-200 bg-white overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
              {activity.imageUrl ? (
                <img
                  src={activity.imageUrl}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-4xl text-slate-300">🌍</div>';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl text-slate-300">🌍</div>
              )}
              <span className="absolute top-3 left-3 bg-white/90 text-brand-dark text-xs font-bold px-2.5 py-1 rounded">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="p-4 space-y-1.5">
              <h3 className="font-bold text-brand-dark text-sm">{activity.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{activity.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}