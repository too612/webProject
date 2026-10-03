import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  FileText,
  LockKeyhole,
  MessageSquare,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { LineChart, DonutChart } from "../../common/ui";
import { WorkspaceIndexHeader } from "../../common/ui/WorkspaceIndexHeader";
import { useMenuStore } from "../../common/menu/menuStore";
import { buildMenuLink } from "../../common/menu/menuModel";
import type { MenuItem } from "../../common/menu/menu.types";
import { useMypageIndexPage } from "./mypageIndexHook";
import { MYPAGE_INDEX_LINKS, MYPAGE_INDEX_METRICS } from "./mypageIndexModel";
import type { MypageIndexData } from "./mypageIndexModel";

function findMenu(menus: MenuItem[], path: string): MenuItem | undefined {
  for (const menu of menus) {
    const child = findMenu(menu.subMenus ?? [], path);
    if (child) return child;
    if (menu.path === path && menu.active !== false) return menu;
  }
  return undefined;
}

function countLabel(value: number | string) {
  return `${Number(value).toLocaleString("ko-KR")}건`;
}

function MetricValue({
  loading,
  error,
  value,
}: Readonly<{ loading: boolean; error: string; value?: number }>) {
  if (loading)
    return (
      <span className="inline-block h-8 w-24 animate-pulse rounded bg-slate-100" />
    );
  if (error || value === undefined) return <>—</>;
  return (
    <>
      {value.toLocaleString("ko-KR")}
      <span className="ml-1 text-sm font-normal text-slate-400">건</span>
    </>
  );
}

type RenderLink = (
  path: string,
  content: ReactNode,
  className: string,
) => ReactNode;

function RecentRecords({
  loading,
  error,
  data,
  renderLink,
}: Readonly<{
  loading: boolean;
  error: string;
  data: MypageIndexData | null;
  renderLink: RenderLink;
}>) {
  if (loading)
    return (
      <output className="block py-12 text-center text-sm text-slate-400">
        작성 기록을 불러오는 중입니다.
      </output>
    );
  if (error)
    return (
      <p className="py-12 text-center text-sm text-red-600">
        기록을 확인하지 못했습니다. 다시 불러오기를 이용하세요.
      </p>
    );
  if (!data?.recentActivities.length)
    return (
      <div className="rounded-xl bg-slate-50 px-4 py-12 text-center">
        <FileText className="mx-auto mb-3 h-7 w-7 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">
          아직 작성한 기록이 없습니다.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          내가 작성한 게시글과 문의가 이곳에 표시됩니다.
        </p>
      </div>
    );
  return (
    <ul className="divide-y divide-slate-100">
      {data.recentActivities.map((item, index) => (
        <li
          key={`${item.date}-${index}`}
          className="flex items-center gap-3 py-3.5"
        >
          <span
            className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-medium ${item.type === "문의" ? "bg-sky-50 text-sky-700" : "bg-emerald-50 text-emerald-700"}`}
          >
            {item.type}
          </span>
          <div className="min-w-0 flex-1">
            {renderLink(
              item.type === "문의"
                ? "/mypage/user/inquiry"
                : "/mypage/user/activity",
              item.title,
              "block truncate text-sm font-medium text-slate-700 hover:text-emerald-700",
            )}
          </div>
          <time
            className="shrink-0 text-[11px] text-slate-400"
            dateTime={item.date}
          >
            {item.date.replace(/-/g, ".")}
          </time>
        </li>
      ))}
    </ul>
  );
}

export default function MypageIndexPage() {
  const { indexData, loading, error, retry } = useMypageIndexPage();
  const navigate = useNavigate();
  const menus = useMenuStore((state) => state.menuList);
  const systemType = useMenuStore((state) => state.systemType);
  const stats = indexData?.stats;
  const linkFor = (path: string) => {
    const menu = systemType === "mypage" ? findMenu(menus, path) : undefined;
    return menu ? buildMenuLink(menu) : undefined;
  };
  const renderLink = (path: string, content: ReactNode, className: string) => {
    const to = linkFor(path);
    return to ? (
      <Link to={to} className={className}>
        {content}
      </Link>
    ) : (
      <span
        className={`${className} opacity-50`}
        aria-disabled="true"
        title="이동할 메뉴가 없습니다."
      >
        {content}
      </span>
    );
  };
  const metricIcons = {
    records: FileText,
    activity: Activity,
    calendar: CalendarDays,
    inquiry: MessageSquare,
  };
  const accountIcons = {
    profile: UserRound,
    password: LockKeyhole,
    notifications: Bell,
  };
  const chartError = error || null;
  const monthlyData = (indexData?.monthlyActivities ?? []).map((item) => ({
    ...item,
    label: item.month.replace("-", "."),
  }));
  const period = indexData
    ? `${indexData.periodStart.slice(0, 7).replace("-", ".")} – ${indexData.asOf.slice(0, 7).replace("-", ".")}`
    : "최근 6개월";
  let asOfLabel = loading ? "데이터 확인 중" : "조회 실패";
  if (indexData) asOfLabel = `${indexData.asOf.replace(/-/g, ".")} · DB 기준`;
  const activityLink = linkFor("/mypage/user/activity");

  if (error) {
    return (
      <section
        className="min-w-0 space-y-6 bg-slate-50/60 pb-8"
        aria-busy={loading}
      >
        <WorkspaceIndexHeader
          icon={UserRound}
          accent="emerald"
          eyebrow="MY PAGE"
          title="내 기록을 한눈에"
          description="나의 작성 활동을 살펴보고, 필요한 화면으로 바로 이동하세요."
          actions={
            <>
              <button
                type="button"
                onClick={retry}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />{" "}
                다시 불러오기
              </button>
              <Link
                to="/auth/login"
                state={{ from: "/mypage" }}
                className="inline-flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:underline"
              >
                로그인 확인
              </Link>
            </>
          }
        />
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <h2 className="font-semibold">마이페이지를 불러오지 못했습니다.</h2>
          <p className="mt-1">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-w-0 space-y-6 bg-slate-50/60 pb-8"
      aria-busy={loading}
    >
      <WorkspaceIndexHeader
        icon={UserRound}
        accent="emerald"
        eyebrow="MY WORKSPACE"
        title="내 기록을 한눈에"
        description="나의 작성 활동을 살펴보고, 필요한 화면으로 바로 이동하세요."
        actions={
          <>
            <span className="text-xs text-slate-500">{asOfLabel}</span>
            {renderLink(
              "/mypage/user/activity",
              <>
                내 활동 보기 <ArrowRight className="h-4 w-4" />
              </>,
              "inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800",
            )}
            <button
              type="button"
              onClick={retry}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />{" "}
              다시 불러오기
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MYPAGE_INDEX_METRICS.map(({ key, label, note, icon, color }) => {
          const Icon = metricIcons[icon];
          return (
            <article
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                <MetricValue
                  loading={loading}
                  error={error}
                  value={stats?.[key]}
                />
              </p>
              <p className="mt-3 text-[11px] text-slate-400">{note}</p>
            </article>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <LineChart
          title="나의 작성 흐름"
          description={`${period} · 작성이 없는 월은 0건. 점 클릭은 기간 필터 없이 내 전체 활동 목록으로 이동합니다.`}
          data={stats?.periodActivities ? monthlyData : []}
          categoryKey="label"
          series={[{ dataKey: "count", name: "작성 기록", color: "#059669" }]}
          loading={loading}
          error={chartError}
          height={280}
          valueFormatter={countLabel}
          onDataClick={activityLink ? () => navigate(activityLink) : undefined}
        />
        <DonutChart
          title="활동 구성"
          description="전체 기간 · 문의(QNA)와 그 외 게시글. 항목 클릭은 분류 필터 없이 해당 전체 목록으로 이동합니다."
          data={indexData?.categories ?? []}
          nameKey="label"
          valueKey="count"
          colors={["#059669", "#38bdf8"]}
          loading={loading}
          error={chartError}
          height={280}
          valueFormatter={countLabel}
          detailFormatter={(item) =>
            stats?.totalActivities
              ? `전체의 ${((item.count / stats.totalActivities) * 100).toFixed(1)}%`
              : undefined
          }
          onDataClick={(item) => {
            const to = linkFor(
              item.label === "문의"
                ? "/mypage/user/inquiry"
                : "/mypage/user/activity",
            );
            if (to) navigate(to);
          }}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">
              최근 작성 기록
            </h2>
            {renderLink(
              "/mypage/user/activity",
              <>
                전체 목록 <ArrowUpRight className="h-3.5 w-3.5" />
              </>,
              "inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline",
            )}
          </div>
          <p className="mb-3 text-xs text-slate-400">
            최근 5건 · 제목을 선택하면 해당 전체 목록으로 이동합니다.
          </p>
          <RecentRecords
            loading={loading}
            error={error}
            data={indexData}
            renderLink={renderLink}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            나의 바로가기
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            활동 조회와 계정 입력 화면을 빠르게 엽니다.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {renderLink(
              "/mypage/user/activity",
              <>
                <FileText className="mb-2 h-5 w-5" />내 활동 내역
              </>,
              "rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 hover:bg-emerald-100",
            )}
            {renderLink(
              "/mypage/user/inquiry",
              <>
                <MessageSquare className="mb-2 h-5 w-5" />내 문의 내역
              </>,
              "rounded-xl bg-sky-50 p-3 text-xs font-semibold text-sky-800 hover:bg-sky-100",
            )}
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {MYPAGE_INDEX_LINKS.map((item) => {
              const Icon = accountIcons[item.icon];
              return (
                <div key={item.to}>
                  {renderLink(
                    item.to,
                    <>
                      <Icon className="h-4 w-4 text-slate-400" />
                      <span className="flex-1">
                        <span className="block text-xs font-medium text-slate-700">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-slate-400">
                          {item.desc} · 서버 저장 미연결
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                    </>,
                    "flex items-center gap-3 py-3 hover:text-emerald-700",
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
