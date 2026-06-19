import { useEffect, useState } from 'react';
import { useCongregationContent } from './congregationHook';
import { DEFAULT_CONGREGATION_CONTENT } from './congregationModel';

type CardDecoration = {
  cardBg: string;
  accent: string;
  icon: string;
};

const CARD_DECORATIONS: CardDecoration[] = [
  {
    cardBg: 'from-emerald-50 to-white',
    accent: 'border-l-emerald-400',
    icon: '🌱',
  },
  {
    cardBg: 'from-amber-50 to-white',
    accent: 'border-l-amber-400',
    icon: '🔥',
  },
  {
    cardBg: 'from-sky-50 to-white',
    accent: 'border-l-sky-400',
    icon: '💡',
  },
];

export default function CongregationPage() {
  const { congregationContent, loading, error, loadCongregationContent } = useCongregationContent();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadCongregationContent();
  }, [loadCongregationContent]);

  const content = congregationContent ?? DEFAULT_CONGREGATION_CONTENT;
  const selectedGroup = selectedIndex === null ? null : content.congregations[selectedIndex] ?? null;
  const selectedDecoration = selectedIndex === null ? null : CARD_DECORATIONS[selectedIndex] ?? CARD_DECORATIONS[0];

  return (
    <section className="space-y-6">
      {/* 헤더 */}
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">{content.headline}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{content.summary}</p>
        </div>

        {loading && <div className="text-sm text-slate-500 py-6 text-center">공동체 정보를 불러오는 중입니다.</div>}
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">{error}</div>}

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.congregations.map((group, index) => {
            const decoration = CARD_DECORATIONS[index] ?? CARD_DECORATIONS[0];
            return (
              <button
                key={group.title}
                type="button"
                onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                className={`text-left bg-gradient-to-br ${decoration.cardBg} border border-slate-200 rounded-none p-5 transition-all duration-200 hover:shadow-md group ${selectedIndex === index ? 'ring-2 ring-brand-primary shadow-md' : ''}`}
              >
                <div className="text-2xl mb-2">{decoration.icon}</div>
                <h3 className="font-bold text-brand-dark text-base mb-1">{group.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{group.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}