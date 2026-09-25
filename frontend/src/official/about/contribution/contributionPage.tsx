import { useEffect, useState } from "react";
import { Check, Copy, Landmark } from "lucide-react";
import { Badge, Button, DetailPageShell } from "../../../common/ui";
import { useContributionInfo } from "./contributionHook";

export default function ContributionPage() {
  const { info, loading, error, loadInfo } = useContributionInfo();
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const copyAccount = async (accountNumber: string, accountType: string) => {
    if (accountNumber === "등록 필요") return;
    await navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountType);
    window.setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <DetailPageShell>
      {loading && (
        <p className="py-8 text-center text-sm text-slate-500">
          헌금 안내를 불러오는 중입니다.
        </p>
      )}
      {error && (
        <p className="border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {info && !loading && !error && (
        <div className="space-y-6">
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-brand-dark">
                  헌금 계좌 안내
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  계좌 정보는 송금 전 다시 확인해 주세요.
                </p>
              </div>
              <Landmark className="size-6 text-brand-primary" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {info.accounts.map((account) => (
                <article
                  key={account.accountType}
                  className="border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-brand-dark">
                      {account.accountLabel}
                    </h3>
                    <Badge>
                      {account.accountType === "mission" ? "선교" : "일반"}
                    </Badge>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">은행</dt>
                      <dd className="font-semibold text-slate-900">
                        {account.bankName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">계좌번호</dt>
                      <dd className="font-mono font-semibold text-slate-900">
                        {account.accountNumber}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">예금주</dt>
                      <dd className="font-semibold text-slate-900">
                        {account.accountHolder}
                      </dd>
                    </div>
                  </dl>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-4 w-full"
                    disabled={account.accountNumber === "등록 필요"}
                    onClick={() =>
                      copyAccount(account.accountNumber, account.accountType)
                    }
                  >
                    {copiedAccount === account.accountType ? (
                      <Check />
                    ) : (
                      <Copy />
                    )}
                    {copiedAccount === account.accountType
                      ? "복사 완료"
                      : "계좌번호 복사"}
                  </Button>
                </article>
              ))}
            </div>
          </section>

          <section className="border border-brand-primary/20 bg-brand-primary/5 p-5 md:p-6">
            <h2 className="text-lg font-extrabold text-brand-dark">
              송금자명 작성 규칙
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {info.namingGuide}
            </p>
            <p className="mt-3 border-l-4 border-brand-primary bg-white px-4 py-3 text-sm font-semibold text-slate-900">
              기재 예: {info.namingExample}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-brand-dark">
              헌금 목적 약자
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {info.rules.map((rule) => (
                <div
                  key={rule.purpose}
                  className="flex items-center justify-between border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <span className="text-slate-700">{rule.purpose}</span>
                  <strong className="text-brand-primary">
                    {rule.abbreviation}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </DetailPageShell>
  );
}
