/**
 * File Name   : NewBelieverSection
 * Description : 새가족 안내 프로세스 섹션 (상당교회 '처음오셨나요?' 벤치마킹)
 * - PC·모바일 동일: 가로 6단계 프로세스(아이콘 + 하단 텍스트 + 화살표)
 * - 모바일은 가로 스크롤 허용하여 좁은 폭 대응
 * - 섹션 진입 시 단계별 순차 페이드인(스태거 160ms)
 */
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

const NEW_BELIEVER_STEPS: { icon: LucideIcon; title: string }[] = [
  { icon: ClipboardList, title: "새가족등록" },
  { icon: Flower2, title: "환영·영접" },
  { icon: HandHeart, title: "1:1 섬김이" },
  { icon: Award, title: "새가족수료" },
  { icon: HeartHandshake, title: "사랑방 모임" },
  { icon: Droplets, title: "세례식" },
];

const STEP_COUNT = NEW_BELIEVER_STEPS.length;

export default function NewBelieverSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(function () {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisibleCount(STEP_COUNT);
      return;
    }
    let cancelled = false;
    const obs = new IntersectionObserver(
      function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          NEW_BELIEVER_STEPS.forEach(function (_, i) {
            window.setTimeout(function () {
              if (!cancelled) {
                setVisibleCount(function (v) { return Math.max(v, i + 1); });
              }
            }, 160 * i);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return function () {
      cancelled = true;
      obs.disconnect();
    };
  }, []);

  function stepClass(i: number): string {
    return (
      "transition-all duration-500 " +
      (i < visibleCount
        ? "translate-y-0 opacity-100"
        : "translate-y-4 opacity-0")
    );
  }

  return (
    <section className="bg-slate-50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(280px,360px)_1fr]">
          {/* 좌측 안내 */}
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-brand-dark">처음오셨나요?</h2>
            <p className="text-sm leading-relaxed text-gray-500">
              새가족 여러분을 주님의 이름으로 환영합니다. 첫 방문부터 새가족
              등록까지 다사랑교회가 자세히 안내해 드립니다.
            </p>
            <Link
              to="/news/nextsteps"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4e5caf] lg:w-auto"
            >
              새가족 안내 자세히 보기 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 가로 6단계 프로세스 (PC·모바일 동일, 모바일은 가로 스크롤 허용) */}
          <div
            ref={rootRef}
            className="flex items-stretch gap-1 overflow-x-auto pb-2 lg:gap-0"
          >
            {NEW_BELIEVER_STEPS.map(function (step, i) {
              const Icon = step.icon;
              const isLast = i === STEP_COUNT - 1;
              return (
                <Fragment key={step.title}>
                  <div
                    className={
                      "flex min-w-[78px] flex-1 flex-col items-center gap-2 text-center " +
                      stepClass(i)
                    }
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-primary/30 bg-white text-brand-primary lg:h-14 lg:w-14">
                      <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                    </div>
                    <p className="text-xs font-bold text-brand-dark lg:text-sm">
                      {step.title}
                    </p>
                  </div>
                  {!isLast && (
                    <ChevronRight className="h-4 w-4 shrink-0 self-center text-slate-300 lg:h-5 lg:w-5" />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
