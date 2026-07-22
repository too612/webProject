import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArticleList } from "../../../common/article";
import { useOutreachContent } from "./outreachHook";
import { DEFAULT_OUTREACH_CONTENT } from "./outreachModel";

export default function OutreachPage() {
  const { outreachContent, loading, error, loadOutreachContent } =
    useOutreachContent();

  useEffect(() => {
    loadOutreachContent();
  }, [loadOutreachContent]);

  const content = outreachContent
    ? { ...DEFAULT_OUTREACH_CONTENT, ...outreachContent }
    : DEFAULT_OUTREACH_CONTENT;

  const missionCards = useMemo(
    () => content.activities.slice(0, 4),
    [content.activities],
  );

  return (
    <section className="space-y-5">
      {loading && (
        <div className="text-sm text-slate-500 py-4 text-center">
          불러오는 중입니다.
        </div>
      )}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5">
          <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
              {content.headline}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              {content.summary}
            </p>
          </div>

          <section className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 min-h-[420px] md:min-h-[520px] bg-slate-900">
              <img
                src="/img/official/training/outreach/worldMap.jpg"
                alt="세계 지도"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/35 to-slate-900/70" />

              <div className="relative z-10 p-5 md:p-8 flex flex-col h-full">
                <div className="mx-auto text-center space-y-3">
                  <img
                    src="/img/logo.png"
                    alt="교회 로고"
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto object-contain"
                  />
                  <h3 className="text-white text-lg md:text-2xl font-extrabold">
                    열방을 향한 선교 비전
                  </h3>
                  <p className="text-slate-100/90 text-xs md:text-sm max-w-2xl leading-relaxed">
                    하나님의 사랑을 전 세계에 전하는 다사랑교회의 선교
                    사역입니다. 각 지역의 필요를 섬기며 복음의 통로를
                    세워갑니다.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {missionCards.map((activity) => (
                    <article
                      key={activity.title}
                      className="rounded-md border border-white/20 bg-white/10 backdrop-blur-sm p-3 md:p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex w-2 h-2 rounded-full bg-brand-primary" />
                        <p className="text-[11px] md:text-xs font-semibold text-slate-100">
                          {activity.region}
                        </p>
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-white">
                        {activity.title}
                      </h4>
                      <p className="text-[12px] leading-relaxed text-slate-100/90">
                        {activity.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-lg md:text-xl font-extrabold text-brand-dark">
                  선교 사진 아카이브
                </h3>
                <p className="text-xs md:text-sm text-slate-600 mt-1">
                  선교 활동 이미지를 등록하고 모아볼 수 있습니다.
                </p>
              </div>
              <Link
                to="/training/outreach/write"
                className="inline-flex items-center rounded-md bg-brand-primary !text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
              >
                이미지 등록
              </Link>
            </div>
            <div className="border border-slate-200 bg-white p-5 md:p-6">
              <ArticleList
                menuKey="OUTREACH_GALLERY"
                templateCode="OUTREACH_GALLERY"
                basePath="/training/outreach"
                embedded
              />
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
