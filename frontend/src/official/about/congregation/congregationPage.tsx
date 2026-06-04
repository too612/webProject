import { useEffect, useState } from 'react';
import { useCongregationContent } from './congregationHook';
import { DEFAULT_CONGREGATION_CONTENT } from './congregationModel';

type CongregationCard = {
  imageLabel: string;
  accent: string;
  detailAccent: string;
  listImageSrc?: string;
  detailGallerySrcs?: string[];
};

const CARD_DECORATIONS: CongregationCard[] = [
  {
    imageLabel: '주일학교 공동체 이미지',
    accent: 'from-emerald-500 via-teal-500 to-sky-500',
    detailAccent: 'from-emerald-50 via-white to-cyan-50',
    listImageSrc: '/data/congregation/section1_0.jpg',
    detailGallerySrcs: [
      '/data/congregation/section1_0.jpg',
      '/data/congregation/section1_1.jpg',
      '/data/congregation/section1_2.jpg',
      '/data/congregation/section1_3.jpg',
      '/data/congregation/section1_4.jpg',
    ],
  },
  {
    imageLabel: '중고등부 공동체 이미지',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
    detailAccent: 'from-amber-50 via-white to-rose-50',
    listImageSrc: '/data/congregation/section2_0.png',
    detailGallerySrcs: [
      '/data/congregation/section2_0.png',
      '/data/congregation/setcion2_1.jpg',
      '/data/congregation/setcion2_2.jpg',
      '/data/congregation/setcion2_3.jpg',
      '/data/congregation/setcion2_4.jpg',
    ],
  },
  {
    imageLabel: '대학.청년부 공동체 이미지',
    accent: 'from-slate-900 via-slate-700 to-slate-500',
    detailAccent: 'from-slate-50 via-white to-slate-100',
    listImageSrc: '/data/congregation/section3_0.jpg',
    detailGallerySrcs: [
      '/data/congregation/section3_0.jpg',
      '/data/congregation/section3_1.jpg',
      '/data/congregation/setcion3_2.jpg',
      '/data/congregation/setcion3_3.jpg',
      '/data/congregation/setcion3_4.jpg',
    ],
  },
];

export default function CongregationPage() {
  const { congregationContent, loading, error, loadCongregationContent } = useCongregationContent();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  useEffect(() => {
    loadCongregationContent();
  }, [loadCongregationContent]);

  const content = congregationContent ?? DEFAULT_CONGREGATION_CONTENT;
  const selectedGroup = selectedIndex === null ? null : content.congregations[selectedIndex] ?? null;
  const selectedDecoration = selectedIndex === null ? null : CARD_DECORATIONS[selectedIndex] ?? CARD_DECORATIONS[0];
  const selectedDetail = selectedGroup && selectedDecoration ? { selectedGroup, selectedDecoration } : null;
  const detailGallerySrcs = selectedDetail?.selectedDecoration.detailGallerySrcs ?? [];
  const detailImageSrc = selectedGalleryImage ?? detailGallerySrcs[0] ?? null;

  useEffect(() => {
    setSelectedGalleryImage(detailGallerySrcs[0] ?? null);
  }, [selectedIndex]);

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6 overflow-hidden">
        <div className="space-y-3 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">{content.headline}</h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl">{content.summary}</p>
        </div>

        {error && (
          <div className="px-3 py-2 text-sm border bg-red-50 text-red-700 border-red-100">{error}</div>
        )}

        {loading && !error && (
          <div className="px-3 py-2 text-sm border bg-blue-50 text-blue-700 border-blue-100">공동체 안내 정보를 불러오는 중입니다.</div>
        )}

        {!selectedDetail ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
            {content.congregations.map((group, index) => {
              const decoration = CARD_DECORATIONS[index] ?? CARD_DECORATIONS[0];

              return (
                <article
                  key={group.title}
                  className="group overflow-hidden bg-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="block h-full">
                    <div
                      className={`h-20 bg-gradient-to-br ${decoration.accent} p-4 text-white flex items-center justify-center text-center`}
                    >
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold leading-tight">{group.title}</h3>
                      </div>
                    </div>

                    <div className="border-l border-r border-b border-slate-200 bg-white p-6 md:p-7 space-y-10 min-h-[280px]">
                      <div className="h-24 overflow-hidden border border-slate-200 bg-slate-50 md:h-28">
                        {decoration.listImageSrc ? (
                          <img
                            src={decoration.listImageSrc}
                            alt={`${group.title} 카드 이미지`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            {decoration.imageLabel}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">{group.description}</p>

                      <div className="flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedIndex(index)}
                          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:border-brand-primary hover:text-brand-primary"
                        >
                          상세보기
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <section
            className={`overflow-hidden border border-slate-200 bg-gradient-to-br ${selectedDetail.selectedDecoration.detailAccent} shadow-panel`}
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/70 px-5 py-4 backdrop-blur-sm md:px-6">
              <div>
                <h3 className="mt-1 text-xl font-bold text-brand-dark">{selectedDetail.selectedGroup.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                ← 뒤로 가기
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div className="space-y-4 p-5 md:p-6">
                <div className="overflow-hidden rounded-none border border-white/70 bg-white shadow-sm">
                  <div className="aspect-[16/10] bg-slate-50 p-4">
                    <div className="flex h-full items-stretch justify-stretch overflow-hidden rounded-none border border-slate-200 bg-white">
                      {detailImageSrc ? (
                        <img
                          src={detailImageSrc}
                          alt={`${selectedDetail.selectedGroup.title} 대표 이미지`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className={`flex h-full w-full items-end justify-start rounded-none bg-gradient-to-br ${selectedDetail.selectedDecoration.accent} p-4 text-white`}>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">대표 이미지</p>
                            <p className="mt-1 text-lg font-bold">{selectedDetail.selectedDecoration.imageLabel}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {detailGallerySrcs.map((thumbSrc, index) => (
                    <div
                      key={thumbSrc}
                      className={`aspect-[4/3] overflow-hidden rounded-none border p-2 shadow-sm transition-colors ${
                        detailImageSrc === thumbSrc ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 bg-white/80'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedGalleryImage(thumbSrc)}
                        className="block h-full w-full"
                        aria-label={`${selectedDetail.selectedGroup.title} 썸네일 ${index + 1}`}
                      >
                        <img
                          src={thumbSrc}
                          alt={`${selectedDetail.selectedGroup.title} 썸네일 ${index + 1}`}
                          className="h-full w-full rounded-none object-cover"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-none border border-slate-200 bg-white/90 p-5 md:p-6">
                  <p className="text-sm leading-7 text-gray-700">{selectedDetail.selectedGroup.description}</p>
                </div>
              </div>

              <aside className="border-t border-slate-200/80 bg-white/75 p-5 md:border-l md:border-t-0 md:p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-brand-primary">{selectedDetail.selectedGroup.title}</p>
                    <p className="text-base leading-7 text-gray-700">{selectedDetail.selectedGroup.description}</p>
                  </div>

                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-2 items-start">
                      <span className="mt-[7px] inline-block h-1.5 w-1.5 flex-none bg-brand-primary" aria-hidden="true" />
                      <span>공동체의 현재 소개 문구를 기반으로 상세 페이지를 확장할 수 있습니다.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-[7px] inline-block h-1.5 w-1.5 flex-none bg-brand-primary" aria-hidden="true" />
                      <span>이미지와 일정, 안내 문구를 나중에 더 촘촘하게 붙이기 쉬운 구조입니다.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="mt-[7px] inline-block h-1.5 w-1.5 flex-none bg-brand-primary" aria-hidden="true" />
                      <span>상세보기 후 바로 목록으로 복귀할 수 있도록 뒤로 가기 버튼을 배치했습니다.</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
