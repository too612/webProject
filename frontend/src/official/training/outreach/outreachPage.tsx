import { Fragment, useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Landmark } from "lucide-react";
import { Badge, Button, CountryFlag, PageTitle } from "../../../common/ui";
import { useOutreachContent } from "./outreachHook";
import {
  DEFAULT_OUTREACH_CONTENT,
  OUTREACH_OFFERING_ACCOUNT,
} from "./outreachModel";

export default function OutreachPage() {
  const { outreachContent, loading, error, loadOutreachContent } =
    useOutreachContent();

  useEffect(() => {
    loadOutreachContent();
  }, [loadOutreachContent]);

  const content = outreachContent
    ? { ...DEFAULT_OUTREACH_CONTENT, ...outreachContent }
    : DEFAULT_OUTREACH_CONTENT;

  const activities = useMemo(
    () =>
      (content.activities ?? []).map((activity) => ({
        ...activity,
        country: activity.country ?? "기타",
        countryCode: activity.countryCode ?? "UN",
        organization: activity.organization ?? "",
        missionaryName: activity.missionaryName ?? activity.title,
        sentYear: activity.sentYear ?? 0,
      })),
    [content.activities],
  );

  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    const text = OUTREACH_OFFERING_ACCOUNT.accountNumber.replace(/-/g, "");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const bannerTitleParts = content.bannerTitle.split("선교");

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
          <PageTitle title={content.headline} description={content.summary} />

          <section>
            <div className="relative overflow-hidden border border-slate-200 min-h-[380px] md:min-h-[460px] bg-slate-100">
              <img
                src="/img/official/training/outreach/worldMap.jpg"
                alt="세계 지도"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-5 md:px-8 py-12">
                <h3 className="text-slate-900 text-2xl md:text-4xl font-extrabold leading-tight md:leading-snug max-w-2xl">
                  {bannerTitleParts[0]}
                  <span className="bg-gradient-to-r from-brand-primary via-sky-600 to-sky-800 bg-clip-text text-transparent">
                    선교
                  </span>
                  {bannerTitleParts[1]}
                </h3>
                <p className="mt-4 text-slate-700 text-sm md:text-base leading-loose max-w-2xl">
                  {content.bannerDescription.split("\n").map((line, index, arr) => (
                    <Fragment key={index}>
                      {line}
                      {index < arr.length - 1 ? <br /> : null}
                    </Fragment>
                  ))}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-lg md:text-xl font-extrabold text-brand-dark">
                {content.missionSectionTitle}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                {content.missionSectionDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {activities.map((activity) => (
                <article
                  key={activity.title}
                  className="border border-slate-200 bg-white p-3 md:p-4 shadow-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <CountryFlag
                      code={activity.countryCode}
                      alt={activity.country}
                      className="h-5 w-auto rounded-[2px] shadow-sm"
                    />
                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-brand-dark text-sm md:text-base">
                        {activity.title}
                      </h4>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-xs font-semibold text-slate-700">
                      {activity.missionaryName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {activity.sentYear > 0 ? `파송 ${activity.sentYear}년` : ""}
                    </p>
                    {activity.organization && (
                      <span className="mt-2 inline-flex items-center rounded-full bg-brand-primary/10 px-2.5 py-1 text-[11px] font-semibold text-brand-primary">
                        {activity.organization}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid items-center gap-5 border border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 to-sky-100/60 p-5 md:p-6 lg:grid-cols-[1fr_360px]">
            <div>
              <h3 className="text-lg md:text-xl font-extrabold text-brand-dark">
                {content.offeringSectionTitle}
              </h3>
              <p className="mt-2 text-xs md:text-sm leading-relaxed text-slate-600">
                {OUTREACH_OFFERING_ACCOUNT.description}
              </p>
              <p className="mt-2 text-[11px] md:text-xs text-slate-500">
                {content.offeringSectionDescription}
              </p>
              <Button asChild className="mt-4">
                <a href="#" target="_blank" rel="noreferrer">
                  온라인 헌금 바로가기
                  <ExternalLink />
                </a>
              </Button>
            </div>

            <div className="border border-slate-200 bg-white p-5 shadow-panel">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Landmark className="size-5 text-brand-primary" />
                  <span className="font-bold text-brand-dark text-sm md:text-base">
                    {OUTREACH_OFFERING_ACCOUNT.bankName}
                  </span>
                </div>
                <Badge>선교헌금</Badge>
              </div>
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-400">
                  계좌번호
                </p>
                <p className="font-mono text-lg md:text-xl font-bold tracking-wide text-slate-900">
                  {OUTREACH_OFFERING_ACCOUNT.accountNumber}
                </p>
                <p className="text-xs text-slate-500">
                  예금주 {OUTREACH_OFFERING_ACCOUNT.accountHolder}
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="mt-4 w-full"
                onClick={copyAccount}
              >
                {copied ? <Check /> : <Copy />}
                {copied ? "복사 완료" : "계좌번호 복사"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
