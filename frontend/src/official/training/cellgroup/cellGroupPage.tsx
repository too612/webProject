import { useEffect } from 'react';
import { useCellGroupContent } from './cellGroupHook';
import { DEFAULT_CELL_GROUP_CONTENT } from './cellGroupModel';

export default function CellGroupPage() {
  const { cellGroupContent, loading, error, loadCellGroupContent } = useCellGroupContent();

  useEffect(() => {
    loadCellGroupContent();
  }, [loadCellGroupContent]);

  const content = cellGroupContent ?? DEFAULT_CELL_GROUP_CONTENT;

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{content.headline}</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{content.summary}</p>
        </div>

        {loading && <div className="text-sm text-slate-500 py-4 text-center">셀 정보를 불러오는 중입니다.</div>}
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {content.groups.map((group) => (
            <article key={group.title} className="border border-slate-200 bg-white overflow-hidden space-y-0">
              {group.imageUrl && (
                <div className="w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={group.imageUrl}
                    alt={`${group.title} 활동사진`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-3xl">📸</span>';
                    }}
                  />
                </div>
              )}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-brand-dark text-base">{group.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{group.description}</p>
                </div>
                {group.members.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">셀원</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((member) => (
                        <span key={member.name} className="inline-flex items-center gap-1 rounded-full bg-brand-primary/5 px-3 py-1 text-xs text-brand-dark">
                          <span className="inline-block h-4 w-4 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold flex items-center justify-center">
                            {member.name.charAt(0)}
                          </span>
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}