import { Fragment, useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Landmark } from "lucide-react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  CountryFlag,
  DetailPageShell,
} from "../../../common/ui";
import { useOutreachContent } from "./outreachHook";
import {
  DEFAULT_OUTREACH_CONTENT,
  OUTREACH_OFFERING_ACCOUNT,
  hasOutreachCoordinates,
} from "./outreachModel";
import { OutreachMap } from "./OutreachMap";

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
        employeeNo: activity.employeeNo,
        country: activity.country ?? "기타",
        countryCode: activity.countryCode ?? "UN",
        city: activity.city ?? "",
        region: activity.region ?? "",
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
      toast.error("계좌번호 복사에 실패했습니다.");
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const bannerTitleParts = content.bannerTitle.split("선교");

  return (
    <DetailPageShell>
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
        <div className="space-y-5">
          <section>
            <OutreachMap activities={activities} />
            <p className="px-1 pt-2 text-xs text-slate-600">
              {content.missionSectionDescription}
            </p>
            <p className="px-1 pt-1 text-[11px] text-slate-500">
              국가 대표 좌표 출처:{" "}
              <a href="https://developers.google.com/public-data/docs/canonical/countries_csv"
                target="_blank" rel="noopener noreferrer" className="underline">
                Google Public Data
              </a>
              {" / "}
              <a href="https://www.geonames.org/" target="_blank"
                rel="noopener noreferrer" className="underline">
                GeoNames
              </a>
              {" (CC BY 4.0)"}
            </p>
            {activities.some((activity) => !hasOutreachCoordinates(activity)) && (
              <p role="status" className="px-1 pt-1 text-xs text-amber-700">
                국가 대표 좌표가 없거나 올바르지 않은 항목은 지도에 표시되지 않습니다.
                선교사 목록에서는 확인할 수 있습니다.
              </p>
            )}
            <div className="px-1 pt-4">
              <h3 className="text-slate-900 text-2xl md:text-4xl font-extrabold leading-tight md:leading-snug max-w-2xl">
                {bannerTitleParts[0]}
                <span className="bg-gradient-to-r from-brand-primary via-sky-600 to-sky-800 bg-clip-text text-transparent">
                  선교
                </span>
                {bannerTitleParts[1]}
              </h3>
              <p className="mt-3 text-slate-700 text-sm md:text-base leading-loose max-w-2xl">
                {content.bannerDescription
                  .split("\n")
                  .map((line, index, arr) => (
                    <Fragment key={line}>
                      {line}
                      {index < arr.length - 1 ? <br /> : null}
                    </Fragment>
                  ))}
              </p>
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
                  key={
                    activity.employeeNo ??
                    `${activity.countryCode}-${activity.title}-${activity.missionaryName}`
                  }
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
                      {activity.sentYear > 0
                        ? `파송 ${activity.sentYear}년`
                        : ""}
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
                <a href="/about/contribution">
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
    </DetailPageShell>
  );
}
