import { useEffect } from 'react';
import { useServiceGroupContent } from './serviceGroupHook';
import { DEFAULT_SERVICE_GROUP_CONTENT } from './serviceGroupModel';

export default function ServiceGroupPage() {
  const { serviceGroupContent, loading, error, loadServiceGroupContent } = useServiceGroupContent();

  useEffect(() => {
    loadServiceGroupContent();
  }, [loadServiceGroupContent]);

  const content = serviceGroupContent ?? DEFAULT_SERVICE_GROUP_CONTENT;

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{content.headline}</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{content.summary}</p>
        </div>

        {loading && <div className="text-sm text-slate-500 py-4 text-center">섬기는 공동체 정보를 불러오는 중입니다.</div>}
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {content.groups.map((group) => (
            <article key={group.title} className="border border-slate-200 bg-white p-5 space-y-3">
              <div>
                <h3 className="font-bold text-brand-dark text-base">{group.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{group.description}</p>
              </div>
              {group.members.length > 0 && (
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">섬기는 이</h4>
                  <ul className="space-y-1.5">
                    {group.members.map((member) => (
                      <li key={member.name} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="inline-block h-6 w-6 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold flex items-center justify-center">
                          {member.name.charAt(0)}
                        </span>
                        <span>{member.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">{member.phone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}