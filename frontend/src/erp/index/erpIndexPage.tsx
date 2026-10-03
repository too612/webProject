import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Gauge,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { BarChart, DonutChart, LineChart } from "../../common/ui";
import { WorkspaceIndexHeader } from "../../common/ui/WorkspaceIndexHeader";
import { useErpIndexData } from "./erpIndexHook";
import { ERP_INDEX_SHORTCUTS } from "./erpIndexModel";

const chartColors = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f472b6",
  "#06b6d4",
  "#8b5cf6",
  "#fb7185",
  "#84cc16",
];

function formatHeadcount(value: number | string): string {
  return `${Number(value).toLocaleString("ko-KR")}명`;
}

function formatMonth(month: string): string {
  const [, monthNumber] = month.split("-");
  return monthNumber ? `${Number(monthNumber)}월` : month;
}

function memberListPath(
  filter?: "deptCd" | "serviceStatusCode" | "employmentTypeCode",
  value?: string,
): string {
  if (!filter || !value) return "/erp/humen/manager";
  const query = new URLSearchParams({ [filter]: value });
  if (filter === "deptCd") query.set("serviceStatusCode", "101-010");
  return `/erp/humen/manager?${query}`;
}

export default function ErpIndexPage() {
  const { indexData, loading, error, loadIndexData } = useErpIndexData();
  const navigate = useNavigate();

  useEffect(() => {
    void loadIndexData();
  }, [loadIndexData]);

  const monthlyRegistrations = indexData.monthlyRegistrations.map((item) => ({
    ...item,
    label: formatMonth(item.month),
  }));

  const metrics = [
    {
      label: "전체 등록 인원",
      value: formatHeadcount(indexData.totalMembers),
      note: "인사 기본정보 전체 기준",
      icon: UsersRound,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "활성 구성원",
      value: formatHeadcount(indexData.activeMemberCount),
      note: "재직구분이 재직인 인원",
      icon: Activity,
      iconClass: "bg-sky-50 text-sky-600",
    },
    {
      label: "이번 달 신규 등록",
      value: formatHeadcount(indexData.newMemberCount),
      note: "시스템 등록일 기준 · 입사일과 다름",
      icon: UserRoundPlus,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "운영 조직",
      value: `${indexData.departmentCount.toLocaleString()}개`,
      note: "사용 중인 조직 기준",
      icon: Building2,
      iconClass: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <section
      className="min-w-0 space-y-6 bg-slate-50/60 pb-8"
      aria-busy={loading}
    >
      <WorkspaceIndexHeader
        icon={Gauge}
        accent="blue"
        eyebrow="ERP"
        title="업무 대시보드"
        description="주요 운영 지표와 최근 업무 현황을 확인합니다."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            {new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" }).format(
              new Date(),
            )}
          </span>
        }
      />

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadIndexData()}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 font-medium text-red-700 hover:bg-red-100"
          >
            다시 불러오기
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {metrics.map(({ label, value, note, icon: Icon, iconClass }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {loading ? (
                    <span className="inline-block h-7 w-24 animate-pulse rounded bg-slate-100" />
                  ) : error ? (
                    "—"
                  ) : (
                    value
                  )}
                </p>
              </div>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-400">{note}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
        <LineChart
          title="구성원 등록 추이"
          description="최근 6개월 시스템 등록일 기준입니다. 점을 선택하면 인사 목록으로 이동합니다."
          data={monthlyRegistrations}
          categoryKey="label"
          series={[{ dataKey: "count", name: "등록 인원", color: "#4f46e5" }]}
          loading={loading}
          error={error}
          valueFormatter={formatHeadcount}
          onDataClick={() => navigate(memberListPath())}
          height={320}
        />

        <DonutChart
          title="재직구분 구성"
          description="전체 등록 인원 기준입니다. 분류를 선택하면 해당 재직구분으로 목록을 엽니다."
          data={indexData.serviceStatusDistribution}
          nameKey="label"
          valueKey="count"
          colors={chartColors}
          loading={loading}
          error={error}
          valueFormatter={formatHeadcount}
          onDataClick={(datum) =>
            navigate(memberListPath("serviceStatusCode", datum.code))
          }
          height={320}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <BarChart
          title="고용형태별 인원"
          description="전체 등록 인원을 고용형태로 집계합니다. 막대를 선택하면 해당 분류로 목록을 엽니다."
          data={indexData.employmentDistribution}
          categoryKey="label"
          series={[{ dataKey: "count", name: "인원", color: "#10b981" }]}
          loading={loading}
          error={error}
          valueFormatter={formatHeadcount}
          onDataClick={(datum) =>
            navigate(memberListPath("employmentTypeCode", datum.code))
          }
          height={280}
        />

        <BarChart
          title="조직별 운영 인력"
          description="활성 구성원 상위 8개 조직입니다. 전체 조직별 인원은 아래 현황에서 확인할 수 있습니다."
          data={indexData.departmentStaff.slice(0, 8)}
          categoryKey="department"
          series={[{ dataKey: "staffCount", name: "인원", color: "#818cf8" }]}
          loading={loading}
          error={error}
          horizontal
          valueFormatter={formatHeadcount}
          onDataClick={(datum) =>
            navigate(memberListPath("deptCd", datum.departmentCode))
          }
          height={280}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                조직별 인원 현황
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                재직 중인 인원을 조직별로 집계합니다. 개인 식별 정보는 표시하지
                않습니다.
              </p>
            </div>
            <Link
              to="/erp/humen/manager"
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
            >
              전체 보기 <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-xl bg-slate-50"
                />
              ))}
            </div>
          ) : error ? (
            <p className="py-8 text-center text-sm text-red-600">
              조직 현황을 불러오지 못했습니다.
            </p>
          ) : indexData.departmentStaff.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
              <Building2 className="mb-2 h-5 w-5 text-slate-300" />
              <p className="text-sm text-slate-500">
                표시할 조직별 인원이 없습니다.
              </p>
            </div>
          ) : (
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">조직</th>
                    <th className="px-3 py-2 text-right font-medium">
                      활성 인원
                    </th>
                    <th className="px-3 py-2 text-right font-medium">조회</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {indexData.departmentStaff.map((item) => (
                    <tr key={item.departmentCode} className="hover:bg-slate-50">
                      <td className="px-3 py-3 text-slate-700">
                        {item.department}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-slate-700">
                        {formatHeadcount(item.staffCount)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Link
                          to={memberListPath("deptCd", item.departmentCode)}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          {item.departmentCode ? "인사 목록" : "전체 목록"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-indigo-50/70 px-3.5 py-3">
            <span className="flex items-center gap-2 text-sm text-indigo-900">
              <UsersRound className="h-4 w-4 text-indigo-500" />
              전체 활성 구성원
            </span>
            <span className="font-semibold tabular-nums text-indigo-700">
              {error ? "—" : formatHeadcount(indexData.activeMemberCount)}
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">빠른 메뉴</h2>
            <p className="mt-1 text-xs text-slate-500">
              자주 사용하는 업무 화면으로 이동합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ERP_INDEX_SHORTCUTS.map((item, index) => {
              const icons = [
                Activity,
                CircleDollarSign,
                UsersRound,
                CalendarDays,
                BriefcaseBusiness,
                ArrowRight,
              ];
              const Icon = icons[index % icons.length];
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                    {item.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
