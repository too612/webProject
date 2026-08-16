import type { LucideIcon } from "lucide-react";
import { Calendar, Scroll, Sparkles, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ArticleList } from "../../../common/article";
import { Button, PageTitle } from "../../../common/ui";
import { DEFAULT_SCHOOL_PAGE_CONTENT } from "./schoolModel";

const SCHOOL_GALLERY_BASE = "/nextgen/school";

type GuidelineSectionType = {
  icon: "scroll" | "target" | "sparkles";
  label: string[];
  kind: "verse" | "list";
  verse?: { text: string; reference: string };
  items?: string[];
};

const GUIDELINE_ICONS: Record<GuidelineSectionType["icon"], LucideIcon> = {
  scroll: Scroll,
  target: Target,
  sparkles: Sparkles,
};

function SectionIconLine({ icon: Icon }: Readonly<{ icon: LucideIcon }>) {
  return (
    <div className="flex items-center">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-brand-primary/10">
        <Icon className="h-6 w-6 text-brand-primary" />
      </span>
      <span className="ml-5 h-px flex-1 bg-slate-200" />
    </div>
  );
}

function SectionLabel({ label }: Readonly<{ label: string[] }>) {
  return (
    <p className="text-center text-sm font-bold leading-relaxed text-slate-700 md:pr-2">
      {label.map(function (line, i) {
        return (
          <span key={i} className="block">
            {line}
          </span>
        );
      })}
    </p>
  );
}

function GuidelineSection({
  section,
}: Readonly<{ section: GuidelineSectionType }>) {
  const Icon = GUIDELINE_ICONS[section.icon];
  return (
    <div className="py-6">
      <SectionIconLine icon={Icon} />
      <div className="mt-4 grid grid-cols-1 items-start gap-x-3 gap-y-4 md:grid-cols-[56px_1fr]">
        <SectionLabel label={section.label} />
        <div className="min-w-0">
          {section.kind === "verse" ? (
            <div>
              <p className="text-base leading-8 text-slate-800">
                {section.verse?.text}
              </p>
              <p className="mt-4 text-sm font-medium text-slate-400">
                ({section.verse?.reference})
              </p>
            </div>
          ) : (
            <ol className="space-y-4">
              {section.items?.map(function (item, i) {
                return (
                  <li key={item} className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand-primary text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-base text-slate-800">
                      {item}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function InstagramIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <span
      className={
        "inline-flex items-center justify-center rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 " +
        (className ?? "")
      }
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-full w-full p-[3px]"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
      >
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="16.5" cy="7.5" r="0.6" fill="white" stroke="none" />
      </svg>
    </span>
  );
}

function YoutubeIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <span
      className={
        "inline-flex items-center justify-center rounded-[5px] bg-red-600 " +
        (className ?? "")
      }
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-full w-full p-[3px]" fill="none">
        <rect
          x="2.8"
          y="5.2"
          width="18.4"
          height="13.6"
          rx="3.8"
          stroke="white"
          strokeWidth="1.7"
        />
        <path d="M10.2 8.9v6.2l5.4-3.1z" fill="white" />
      </svg>
    </span>
  );
}

export default function SchoolPromoPage() {
  const content = DEFAULT_SCHOOL_PAGE_CONTENT;

  return (
    <article className="border border-slate-200 bg-white shadow-panel overflow-hidden">
      <header className="p-6">
        <PageTitle title={content.headline} description={content.summary} />
      </header>

      {/* 참고1: 부서 소개 + 활동 갤러리 슬라이드 */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,340px)_minmax(0,640px)]">
          <div className="grid h-[150px] grid-cols-2 lg:h-[292px] lg:grid-cols-1 lg:grid-rows-2">
            <div className="relative min-h-0 overflow-hidden bg-brand-primary">
              <div className="absolute inset-2 md:inset-3 flex flex-col items-center justify-center gap-4 border border-white/40 p-3 md:p-4 lg:gap-5">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  {content.departmentName}
                </h3>
                <div className="flex items-center gap-3">
                  <a
                    href={content.sns.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="인스타그램"
                    className="p-1 text-white transition-opacity hover:opacity-80"
                  >
                    <InstagramIcon className="h-6 w-6" />
                  </a>
                  <a
                    href={content.sns.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="유튜브"
                    className="p-1 text-white transition-opacity hover:opacity-80"
                  >
                    <YoutubeIcon className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex min-h-0 flex-col items-center justify-center overflow-hidden bg-white p-4 text-center lg:p-6">
              <p className="text-sm font-medium text-slate-500">
                {content.motto.label}
              </p>
              <div className="mx-auto mt-2 h-px w-10 bg-slate-300" />
              <p className="mt-4 text-xl font-bold text-slate-800 md:text-2xl">
                <span className="mr-2 align-top font-serif text-3xl text-brand-primary">
                  “
                </span>
                {content.motto.text}
                <span className="ml-2 align-top font-serif text-3xl text-brand-primary">
                  ”
                </span>
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
                <h3 className="text-lg font-bold text-brand-dark">활동 갤러리</h3>
                <Button asChild size="sm">
                  <Link to={SCHOOL_GALLERY_BASE + "/write"}>글 등록</Link>
                </Button>
              </div>
            <div className="relative min-h-[200px] flex-1">
              <ArticleList
                menuKey="SCHOOL_GALLERY"
                templateCode="SCHOOL_GALLERY"
                basePath={SCHOOL_GALLERY_BASE}
                embedded
                galleryVariant="slide"
                gallerySlideWidth="100%"
                gallerySlideHeight="100%"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 참고2: 교육지침 */}
      <section>
        <div className="px-6 py-6 md:px-8 md:py-8">
          <h3 className="text-center text-xl font-bold text-brand-primary md:text-2xl">
            {content.guidelines.title}
          </h3>
          <div className="mt-5 h-px w-full bg-slate-200" />
          <div className="mt-3">
            {content.guidelines.sections.map(function (section, i) {
              return <GuidelineSection key={i} section={section} />;
            })}
          </div>
        </div>
      </section>

      {/* 참고3: 예배안내 + 섬김이 */}
      <section>
        <div className="px-6 py-6 md:px-8 md:py-8">
          <div className="py-3">
            <SectionIconLine icon={Calendar} />
            <div className="mt-4 grid grid-cols-1 items-start gap-x-3 gap-y-4 md:grid-cols-[56px_1fr]">
              <SectionLabel label={["예배", "안내"]} />
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                {content.worship.cards.map(function (card) {
                  return (
                    <div
                      key={card.label}
                      className="bg-brand-primary/10 px-6 py-6 text-center"
                    >
                      <p className="text-sm font-bold text-brand-primary">
                        {card.label}
                      </p>
                      <p className="mt-2 whitespace-pre-line text-slate-700">
                        {card.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="py-3">
            <SectionIconLine icon={Users} />
            <div className="mt-4 grid grid-cols-1 items-start gap-x-3 gap-y-4 md:grid-cols-[56px_1fr]">
              <SectionLabel label={["소년부", "섬김이"]} />
              <div className="min-w-0">
                <div className="border border-slate-200">
                  {content.servingTeam.rows.map(function (row) {
                    return (
                      <div
                        key={row.role}
                        className="grid grid-cols-[120px_1fr] border-b border-slate-200 last:border-b-0"
                      >
                        <div className="flex items-center justify-center bg-brand-primary px-4 py-3.5 text-sm font-bold text-white">
                          {row.role}
                        </div>
                        <div className="bg-brand-primary/5 px-4 py-3.5 text-sm leading-7 text-slate-700">
                          {row.members}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
