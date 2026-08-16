import { Fragment } from "react";
import {
  Award,
  ChevronRight,
  ClipboardList,
  Droplets,
  Flower2,
  HandHeart,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { PageTitle } from "../../../common/ui";
import { DEFAULT_NEXTSTEPS_CONTENT } from "./nextstepsModel";

/* 메인화면 새가족안내 섹션과 동일한 단계 아이콘 (순서 대응) */
const STEP_ICONS: LucideIcon[] = [
  ClipboardList,
  Flower2,
  HandHeart,
  Award,
  HeartHandshake,
  Droplets,
];

export default function NextstepsPage() {
  const content = DEFAULT_NEXTSTEPS_CONTENT;

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-8">
        <header className="space-y-6">
          <PageTitle title={content.headline} description={content.summary} />
        </header>

        <article className="overflow-hidden">
          <div className="relative">
            <img
              src={content.mainImageUrl}
              alt={content.mainImageAlt}
              className="w-full min-h-[300px] md:min-h-[420px] object-cover"
            />
          </div>
        </article>

        <article className="space-y-10">
          {/* INTRO (WELCOME) */}
          <section className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="text-2xl font-extrabold leading-snug text-brand-dark md:text-3xl">
              {content.welcomeTitle}
            </h2>
            <p className="text-base text-gray-500 md:text-lg">
              {content.welcomeSubtitle}
            </p>
            <div className="mx-auto h-1 w-12 bg-brand-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-gray-600 md:text-base">
              {content.welcomeDefinition}
            </p>
          </section>

          {/* PC: 6단계 가로 개요 (메인화면 새가족안내 디자인 적용) */}
          <section className="hidden lg:block">
            <ol className="flex items-center gap-2">
              {content.steps.map(function (s, i) {
                const Icon = STEP_ICONS[i];
                return (
                  <Fragment key={s.step}>
                    <li className="flex flex-1 flex-col items-center gap-2 text-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-primary/30 bg-white text-brand-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-semibold text-brand-dark">
                        {s.title}
                      </span>
                    </li>
                    {i < content.steps.length - 1 && (
                      <ChevronRight
                        className="h-5 w-5 shrink-0 text-slate-300"
                        aria-hidden="true"
                      />
                    )}
                  </Fragment>
                );
              })}
            </ol>
          </section>

          {/* STEP 1~6 상세 (PC: 카드 / 모바일: 세로 타임라인) */}
          <ol className="relative space-y-10">
            {content.steps.map(function (s, idx) {
              const isLast = idx === content.steps.length - 1;
              const Icon = STEP_ICONS[idx];
              return (
                <li key={s.step} className="relative">
                  {/* 모바일 세로 타임라인 노드 */}
                  <div className="absolute left-5 top-1 -translate-x-1/2 lg:hidden" aria-hidden="true">
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-primary/30 bg-white text-brand-primary ring-4 ring-white">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  {!isLast && (
                    <div className="absolute left-5 top-11 bottom-[-40px] w-0.5 -translate-x-1/2 bg-brand-primary/20 lg:hidden" aria-hidden="true" />
                  )}

                  <div className="ml-14 space-y-4 border border-slate-200 bg-white p-5 md:p-6 lg:ml-0">
                    <div className="flex items-center gap-3">
                      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-primary/30 bg-white text-brand-primary lg:inline-flex">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-brand-dark md:text-2xl">
                        {s.title}
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                      {s.detail}
                    </p>

                    {s.images.length > 0 ? (
                      <div className={"grid gap-3 " + (s.columns === 3 ? "grid-cols-3" : "grid-cols-2")}>
                        {s.images.map(function (img) {
                          return (
                            <img
                              key={img.src}
                              src={img.src}
                              alt={img.alt}
                              loading="lazy"
                              className="aspect-[4/3] w-full object-cover"
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className={"grid gap-3 " + (s.columns === 3 ? "grid-cols-3" : "grid-cols-2")}>
                        {Array.from({ length: s.columns }).map(function (_, i) {
                          return (
                            <div
                              key={i}
                              className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-xs text-slate-400"
                            >
                              사진 준비 중
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </article>
      </div>
    </section>
  );
}
