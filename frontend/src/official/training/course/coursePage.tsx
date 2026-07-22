import { useEffect, useState } from "react";
import { useCourseContent } from "./courseHook";
import { DEFAULT_COURSE_CONTENT } from "./courseModel";

const COURSE_GALLERY_IMAGES = [
  "/img/official/training/course/course_01.jpg",
  "/img/official/training/course/course_02.jpg",
  "/img/official/training/course/course_03.jpg",
  "/img/official/training/course/course_04.jpg",
  "/img/official/training/course/course_05.jpg",
];

export default function CoursePage() {
  const { courseContent, loading, error, loadCourseContent } =
    useCourseContent();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  useEffect(() => {
    loadCourseContent();
  }, [loadCourseContent]);

  const content = courseContent
    ? { ...DEFAULT_COURSE_CONTENT, ...courseContent }
    : DEFAULT_COURSE_CONTENT;

  const toggleStep = (step: number) => {
    setExpandedStep((prev) => (prev === step ? null : step));
  };

  const renderStepDetail = (step: (typeof content.steps)[number]) => (
    <div
      key={step.step}
      className="border border-slate-200 p-6 space-y-4 bg-white"
      style={{
        borderLeftColor: step.color,
        borderLeftWidth: 4,
      }}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="inline-flex w-8 h-8 rounded-sm items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: step.color }}
        >
          {step.step}
        </span>
        <h3 className="text-lg font-bold text-brand-dark">{step.title}</h3>
        <span className="text-xs text-slate-500">{step.subtitle}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">
            교육 목적
          </span>
          <p className="text-gray-700 mt-1">{step.purpose}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">
            대상
          </span>
          <p className="text-gray-700 mt-1">{step.target}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">
            기간
          </span>
          <p className="text-gray-700 mt-1">{step.duration}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">
            핵심 가치
          </span>
          <p
            className="text-gray-700 mt-1 font-semibold"
            style={{ color: step.color }}
          >
            {step.coreValue}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-5">
      <div className="rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-6">
        <div className="space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5">
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
            {content.headline}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
            {content.summary}
          </p>
        </div>

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
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-0 gap-y-3">
              {COURSE_GALLERY_IMAGES.map((src, idx) => (
                <div
                  key={src}
                  className="aspect-[4/3] overflow-hidden bg-white"
                >
                  <img
                    src={src}
                    alt={`양육과정 이미지 ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>

            <div className="px-0 py-1">
              <h3 className="text-lg md:text-xl font-extrabold text-brand-dark">
                두날개 양육 로드맵
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {`세계비전두날개프로세스는 건강한 성도, 건강한 교회를 세우는 탁월한 양육 과정입니다.
회복 캠프, 리더 캠프, 양육반, 제자학교, 세계비전제자대학으로 영적 성장을 이루고,
행복모임리더, 셀리더·셀교사를 세워 세계를 복음화하는 것이 목적입니다.
세계비전두날개프로세스는 성도들의 가치관을 변화시키는 성경적 원리로
복음의 절대 능력, 제자 삼는 세계 비전, 두날개로 날아오르는 건강한 교회를 세우는
두날개의 독창적 메커니즘입니다. 어린이두날개프로세스, 청소년두날개프로세스, 청·장년두날개프로세스가 있습니다.`}
              </p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                {content.steps.map((step, idx) => (
                  <div
                    key={step.step}
                    className="relative flex flex-col items-center"
                  >
                    {idx < content.steps.length - 1 && (
                      <div
                        className="hidden md:block absolute top-10 left-[calc(50%+26px)] w-[calc(100%-52px)] h-[2px] -z-0"
                        style={{ backgroundColor: step.color }}
                      />
                    )}
                    {idx < content.steps.length - 1 && (
                      <div
                        className="md:hidden w-[2px] h-8 mx-auto"
                        style={{ backgroundColor: step.color }}
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => toggleStep(step.step)}
                      className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer border-0 bg-transparent p-0 w-full"
                    >
                      <div
                        className="w-[52px] h-[52px] rounded-sm flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.step}
                      </div>
                      <div className="text-center px-2">
                        <h3 className="font-bold text-brand-dark text-sm leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {step.subtitle}
                        </p>
                      </div>
                    </button>

                    {expandedStep === step.step && (
                      <div className="md:hidden mt-4 w-full">
                        {renderStepDetail(step)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {expandedStep !== null &&
              (() => {
                const step = content.steps.find((s) => s.step === expandedStep);
                if (!step) return null;
                return (
                  <div className="hidden md:block">
                    {renderStepDetail(step)}
                  </div>
                );
              })()}
          </div>
        )}
      </div>
    </section>
  );
}
