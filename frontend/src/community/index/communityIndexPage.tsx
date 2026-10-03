import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Eye,
  FileText,
  RefreshCw,
  Users,
  UsersRound,
} from "lucide-react";
import { BarChart, DonutChart, LineChart } from "../../common/ui/chart";
import { WorkspaceIndexHeader } from "../../common/ui/WorkspaceIndexHeader";
import { buildMenuLink } from "../../common/menu/menuModel";
import type { MenuItem } from "../../common/menu/menu.types";
import { useCommunityIndex } from "./communityIndexHook";
import { COMMUNITY_INDEX_METRICS } from "./communityIndexModel";

const colors = [
  "#4f46e5",
  "#14b8a6",
  "#38bdf8",
  "#a78bfa",
  "#fbbf24",
  "#fb7185",
  "#94a3b8",
];
const metricIcons = [FileText, CalendarDays, Users, Eye];
const cardClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const formatCount = (value: number | string) =>
  `${Number(value).toLocaleString("ko-KR")}건`;

function getStateMessage(error: string, loading: boolean): string {
  if (error) return "조회에 실패했습니다. 다시 불러오기를 눌러주세요.";
  if (loading) return "현황을 불러오는 중입니다.";
  return "등록된 공개 콘텐츠가 없습니다.";
}

function MetricValue({
  loading,
  value,
  unit,
}: Readonly<{ loading: boolean; value?: number; unit: string }>) {
  if (loading)
    return (
      <span className="inline-block h-8 w-24 animate-pulse rounded bg-slate-100" />
    );
  if (value === undefined) return <>—</>;
  return (
    <>
      {value.toLocaleString("ko-KR")}
      <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>
    </>
  );
}

function listLink(item: { path: string; param: string }): string {
  const menu: MenuItem = {
    menuId: item.path,
    menuName: "",
    path: item.path,
    param: item.param,
    level: 2,
    orderNo: 0,
  };
  return buildMenuLink(menu);
}

export default function CommunityIndexPage() {
  const { indexData, loading, error, reload } = useCommunityIndex();
  const navigate = useNavigate();
  const categories = indexData?.categories ?? [];
  const distribution = categories.filter((item) => item.count > 0);
  const monthlyPosts = (indexData?.monthlyPosts ?? []).map((item) => ({
    ...item,
    label: `${item.month.slice(2, 4)}.${item.month.slice(5)}`,
  }));
  const period = indexData
    ? `${indexData.periodStart.slice(0, 7)} ~ ${indexData.asOf.slice(0, 7)}`
    : "최근 6개월";
  const stateMessage = getStateMessage(error, loading);
  const recentPosts = indexData?.recentPosts ?? [];

  return (
    <section
      className="min-w-0 space-y-6 bg-slate-50/60 pb-8"
      aria-busy={loading}
    >
      <WorkspaceIndexHeader
        icon={UsersRound}
        accent="teal"
        eyebrow="COMMUNITY"
        title="공동체 활동 대시보드"
        description="새로운 이야기와 참여 흐름을 한눈에 확인하고, 관심 있는 공간으로 이동하세요."
        actions={
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />{" "}
            다시 불러오기
          </button>
        }
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div
        className="flex flex-wrap items-center gap-2 text-xs text-slate-500"
        aria-live="polite"
      >
        {indexData && !loading && !error && (
          <>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
              실데이터 · 공개 게시판
            </span>
            <span>{indexData.asOf} 기준</span>
          </>
        )}
        <span>
          공개 표시(N) · 비밀번호 없는 글만 집계합니다. 작성자 정보와 비공개
          글은 표시하지 않습니다.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COMMUNITY_INDEX_METRICS.map((metric, index) => {
          const Icon = metricIcons[index];
          return (
            <article key={metric.key} className={cardClass}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    <MetricValue
                      loading={loading}
                      value={error ? undefined : indexData?.stats[metric.key]}
                      unit={metric.unit}
                    />
                  </p>
                </div>
                <span className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-400">{metric.note}</p>
            </article>
          );
        })}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <LineChart
          title="이야기가 쌓이는 흐름"
          description={`${period} · 등록일 기준 공개 글 ${indexData?.stats.periodPosts.toLocaleString("ko-KR") ?? "—"}건. 기간 필터는 지원하지 않아 점 선택 시 가장 최근 글의 분류 전체 목록으로 이동합니다.`}
          data={indexData?.stats.periodPosts ? monthlyPosts : []}
          categoryKey="label"
          series={[{ dataKey: "count", name: "새 게시글", color: "#4f46e5" }]}
          loading={loading}
          error={error}
          height={300}
          valueFormatter={formatCount}
          onDataClick={
            recentPosts[0]
              ? () => navigate(listLink(recentPosts[0]))
              : undefined
          }
        />
        <DonutChart
          title="공개 콘텐츠 구성"
          description="전체 공개 게시글 기준 · 분류 선택 시 해당 전체 목록으로 이동합니다."
          data={distribution}
          nameKey="label"
          valueKey="count"
          colors={colors}
          loading={loading}
          error={error}
          height={300}
          valueFormatter={formatCount}
          detailFormatter={(item) =>
            `전체의 ${((item.count / (indexData?.stats.totalPosts || 1)) * 100).toFixed(1)}%`
          }
          onDataClick={(item) => navigate(listLink(item))}
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
        <section className={cardClass}>
          <header className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                최근 공개 이야기
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                최근 등록된 글 6건 · 제목 선택 시 해당 분류 전체 목록으로
                이동합니다.
              </p>
            </div>
            <Activity className="h-5 w-5 shrink-0 text-indigo-500" />
          </header>
          {loading || error || !recentPosts.length ? (
            <p
              className={`rounded-xl px-4 py-12 text-center text-sm ${error ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-400"}`}
            >
              {stateMessage}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentPosts.map((post, index) => (
                <li
                  key={`${post.path}-${index}`}
                  className="py-3 first:pt-0 last:pb-0"
                >
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="rounded-md bg-indigo-50 px-2 py-1 font-medium text-indigo-600">
                      {post.category}
                    </span>
                    <span className="text-slate-400">
                      {post.date || "등록일 미입력"}
                    </span>
                  </div>
                  <Link
                    to={listLink(post)}
                    className="group flex items-center justify-between gap-3 text-sm font-medium text-slate-800 hover:text-indigo-600"
                  >
                    <span className="min-w-0 truncate">{post.title}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-600" />
                  </Link>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views.toLocaleString("ko-KR")}회
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="min-w-0 space-y-5">
          <BarChart
            title="최근 참여가 활발한 공간"
            description={`${period} · 공개 글 등록 상위 6개 분류. 막대 선택 시 기간 제한 없는 해당 전체 목록으로 이동합니다.`}
            data={categories
              .filter((item) => item.periodCount > 0)
              .sort((a, b) => b.periodCount - a.periodCount)
              .slice(0, 6)}
            categoryKey="label"
            series={[
              {
                dataKey: "periodCount",
                name: "최근 6개월 게시글",
                color: "#14b8a6",
              },
            ]}
            horizontal
            loading={loading}
            error={error}
            height={240}
            valueFormatter={formatCount}
            onDataClick={(item) => navigate(listLink(item))}
          />
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-900">
              관심 있는 공간으로
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              게시판별 전체 목록 · 메뉴에 설정된 기본 조건을 유지합니다.
            </p>
            {loading || error || !categories.length ? (
              <p className="mt-4 text-sm text-slate-400">{stateMessage}</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {categories.map((item) => (
                  <Link
                    key={item.code}
                    to={listLink(item)}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-xs text-slate-600 hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <span className="min-w-0 truncate">{item.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <section className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900">
          공간별 콘텐츠 현황
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          전체와 최근 6개월의 공개 게시글을 같은 기준으로 비교합니다. 분류명을
          선택하면 전체 목록으로 이동합니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th scope="col" className="px-3 py-3 text-left font-medium">
                  공간
                </th>
                <th scope="col" className="px-3 py-3 text-right font-medium">
                  전체 게시글
                </th>
                <th scope="col" className="px-3 py-3 text-right font-medium">
                  최근 6개월
                </th>
                <th scope="col" className="px-3 py-3 text-right font-medium">
                  구성비
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading || error || !categories.length ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-10 text-center text-slate-400"
                  >
                    {stateMessage}
                  </td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr key={item.code} className="hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <Link
                        to={listLink(item)}
                        className="font-medium text-slate-700 hover:text-indigo-600"
                      >
                        {item.label}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">
                      {formatCount(item.count)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">
                      {formatCount(item.periodCount)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-400">
                      {(
                        (item.count / (indexData?.stats.totalPosts || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {indexData && !loading && !error && (
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-700">
                  <td className="px-3 py-3">합계</td>
                  <td className="px-3 py-3 text-right">
                    {formatCount(indexData.stats.totalPosts)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {formatCount(indexData.stats.periodPosts)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {indexData.stats.totalPosts ? "100%" : "—"}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>
    </section>
  );
}
