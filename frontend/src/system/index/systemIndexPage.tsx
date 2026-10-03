import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Boxes,
  GitBranch,
  KeyRound,
  LayoutGrid,
  RefreshCw,
  Settings2,
  Users,
} from "lucide-react";
import { BarChart, DonutChart, LineChart } from "../../common/ui/chart";
import { WorkspaceIndexHeader } from "../../common/ui/WorkspaceIndexHeader";
import { buildMenuLink } from "../../common/menu/menuModel";
import { useMenuStore } from "../../common/menu/menuStore";
import type { MenuItem } from "../../common/menu/menu.types";
import { useSystemIndexPage } from "./systemIndexHook";
import {
  SYSTEM_CHANGE_KINDS,
  SYSTEM_INDEX_QUICK_LINKS,
  type SystemIndexData,
} from "./systemIndexModel";

const cardClass =
  "min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const formatCount = (value: number | string) =>
  `${Number(value).toLocaleString("ko-KR")}건`;

function flattenMenus(menus: MenuItem[]): MenuItem[] {
  return menus.flatMap((menu) => [menu, ...flattenMenus(menu.subMenus ?? [])]);
}

function getStateMessage(error: string, loading: boolean): string {
  if (error) return "조회에 실패했습니다. 다시 불러오기를 눌러주세요.";
  if (loading) return "현황을 불러오는 중입니다.";
  return "표시할 데이터가 없습니다.";
}

function MetricValue({
  loading,
  value,
  unit,
}: Readonly<{ loading: boolean; value?: number; unit: string }>) {
  if (loading)
    return (
      <span className="inline-block h-9 w-24 animate-pulse rounded bg-slate-100" />
    );
  if (value === undefined) return <>—</>;
  return (
    <>
      {value.toLocaleString("ko-KR")}
      <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>
    </>
  );
}

function getMetrics(data: SystemIndexData | null) {
  return [
    {
      label: "등록 메뉴",
      value: data?.menuCount,
      unit: "개",
      icon: LayoutGrid,
      note: data
        ? `경로가 지정된 메뉴 ${data.routedMenuCount.toLocaleString("ko-KR")}개 · 그룹 포함`
        : "전체 메뉴 행 기준 · 그룹 포함",
    },
    {
      label: "관리 프로그램",
      value: data?.programCount,
      unit: "개",
      icon: Boxes,
      note: data
        ? `사용 ${data.activeProgramCount.toLocaleString("ko-KR")}개 · 미사용 포함 전체`
        : "프로그램 전체 기준",
    },
    {
      label: "사용 중인 역할",
      value: data?.activeRoleCount,
      unit: "개",
      icon: KeyRound,
      note: data
        ? `전체 ${data.roleCount.toLocaleString("ko-KR")}개 중 사용 설정된 역할`
        : "is_active = true 기준",
    },
    {
      label: "사용 중인 코드",
      value: data?.activeCodeCount,
      unit: "개",
      icon: GitBranch,
      note: data
        ? `전체 ${data.codeCount.toLocaleString("ko-KR")}개 중 사용 코드 · 루트 포함`
        : "use_yn = Y 기준 · 루트 포함",
    },
  ];
}

function RoleTable({
  roles,
  activeProgramCount,
  stateMessage,
}: Readonly<{
  roles: SystemIndexData["roleCoverage"];
  activeProgramCount: number;
  stateMessage: string;
}>) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          역할별 조회와 등록이 허용된 사용 프로그램 수
        </caption>
        <thead className="border-b border-slate-200 text-xs text-slate-400">
          <tr>
            <th scope="col" className="py-3 font-medium">
              역할
            </th>
            <th scope="col" className="px-2 py-3 text-right font-medium">
              조회 허용
            </th>
            <th scope="col" className="px-2 py-3 text-right font-medium">
              등록 허용
            </th>
            <th scope="col" className="py-3 text-right font-medium">
              등록 권한 비율
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {roles.length ? (
            roles.map((role, index) => (
              <tr key={`${role.label}-${index}`}>
                <th scope="row" className="py-3 font-medium text-slate-700">
                  {role.label}
                </th>
                <td className="px-2 py-3 text-right tabular-nums text-slate-500">
                  {formatCount(role.readCount)}
                </td>
                <td className="px-2 py-3 text-right tabular-nums text-slate-500">
                  {formatCount(role.writeCount)}
                </td>
                <td className="py-3 text-right tabular-nums text-indigo-600">
                  {activeProgramCount
                    ? `${((role.writeCount / activeProgramCount) * 100).toFixed(1)}%`
                    : "—"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-12 text-center text-slate-400">
                {stateMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function RecentChanges({
  items,
  menus,
  stateMessage,
}: Readonly<{
  items: SystemIndexData["recentChanges"];
  menus: MenuItem[];
  stateMessage: string;
}>) {
  if (!items.length)
    return (
      <p className="py-16 text-center text-sm text-slate-400">{stateMessage}</p>
    );
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item, index) => {
        const kind = SYSTEM_CHANGE_KINDS[item.kind];
        const menu = menus.find((entry) => entry.path === kind.path);
        const content = (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {kind.label} · {item.changedAt}
              </p>
            </div>
            {menu && (
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
            )}
          </>
        );
        return (
          <li key={`${item.kind}-${index}`}>
            {menu ? (
              <Link
                to={buildMenuLink(menu)}
                title="상세가 아닌 관리 화면 전체 목록으로 이동"
                className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-slate-50"
              >
                {content}
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-2 py-3">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function QuickLinks({ menus }: Readonly<{ menus: MenuItem[] }>) {
  const icons = [LayoutGrid, KeyRound, GitBranch, Users];
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SYSTEM_INDEX_QUICK_LINKS.map((item, index) => {
        const menu = menus.find((entry) => entry.path === item.path);
        if (!menu) return null;
        const Icon = icons[index];
        return (
          <Link
            key={item.path}
            to={buildMenuLink(menu)}
            className="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
          >
            <div className="mb-3 flex items-center justify-between text-indigo-500">
              <Icon className="h-5 w-5" />
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {menu.menuName}
            </p>
            <p className="mt-1 text-xs text-slate-400">{item.note}</p>
          </Link>
        );
      })}
    </div>
  );
}

export default function SystemIndexPage() {
  const { indexData, loading, error, reload } = useSystemIndexPage();
  const navigate = useNavigate();
  const menuList = useMenuStore((state) => state.menuList);
  const systemType = useMenuStore((state) => state.systemType);
  const currentMenu = useMenuStore((state) => state.currentMenu);
  const menus = flattenMenus(systemType === "system" ? menuList : []).sort(
    (a, b) => b.level - a.level,
  );
  const menuForPath = (path: string) =>
    menus.find((menu) => menu.path === path);
  const goToList = (path: string) => {
    const menu = menuForPath(path);
    if (menu) navigate(buildMenuLink(menu));
  };
  const data = loading || error ? null : indexData;
  const period = data
    ? `${data.periodStart.slice(0, 7)} ~ ${data.asOf.slice(0, 7)}`
    : "최근 6개월";
  const metrics = getMetrics(data);
  const months = (data?.monthlyRegistrations ?? []).map((item) => ({
    ...item,
    label: item.month.slice(2).replace("-", "."),
  }));
  const roles = data?.roleCoverage ?? [];
  const stateMessage = getStateMessage(error, loading);

  return (
    <section
      className="min-w-0 space-y-6 bg-slate-50/60 pb-8"
      aria-busy={loading}
    >
      <WorkspaceIndexHeader
        icon={Settings2}
        accent="indigo"
        eyebrow="SYSTEM"
        title={currentMenu?.menuName || "시스템 운영 현황"}
        description="설정 자산과 접근 권한을 살펴보고, 필요한 관리 작업으로 이어가세요."
        actions={
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
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
        {data && (
          <>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              시스템 설정
            </span>
            <span>{data.asOf} · DB 시간 기준</span>
          </>
        )}
        <span>
          전체 시스템 설정 기준입니다. 서버 상태·백업 성공률·실사용 계정 수를
          의미하지 않습니다.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, unit, icon: Icon, note }) => (
          <article key={label} className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  <MetricValue loading={loading} value={value} unit={unit} />
                </p>
              </div>
              <span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              {note}
            </p>
          </article>
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <LineChart
          title="설정 자산 등록 추이"
          description={`${period} · 등록일 기준, 미사용 포함. 코드 ${data?.periodCodeCount ?? "—"}건 / 프로그램 ${data?.periodProgramCount ?? "—"}건. 점 선택 시 기간 필터 없이 해당 관리 화면 전체 목록으로 이동합니다.`}
          data={
            data && data.periodCodeCount + data.periodProgramCount > 0
              ? months
              : []
          }
          categoryKey="label"
          series={[
            { dataKey: "codeCount", name: "공통코드", color: "#4f46e5" },
            { dataKey: "programCount", name: "프로그램", color: "#14b8a6" },
          ]}
          loading={loading}
          error={error}
          valueFormatter={formatCount}
          height={300}
          onDataClick={
            menuForPath("/system/config/code") &&
            menuForPath("/system/config/menu")
              ? (_, key) =>
                  goToList(
                    key === "codeCount"
                      ? "/system/config/code"
                      : "/system/config/menu",
                  )
              : undefined
          }
        />
        <DonutChart
          title="프로그램 사용 구성"
          description="전체 프로그램의 사용 설정 비율입니다. 항목 선택 시 상태 필터 없이 메뉴권한 관리 화면으로 이동합니다."
          data={data?.programStatus ?? []}
          nameKey="label"
          valueKey="count"
          colors={["#4f46e5", "#cbd5e1"]}
          loading={loading}
          error={error}
          height={300}
          valueFormatter={formatCount}
          detailFormatter={(item) =>
            `전체의 ${((item.count / (data?.programCount || 1)) * 100).toFixed(1)}% · 서비스 정상 여부와 다름`
          }
          onDataClick={
            menuForPath("/system/config/menu")
              ? () => goToList("/system/config/menu")
              : undefined
          }
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
        <BarChart
          title="역할별 프로그램 권한 비교"
          description="사용 역할 · 사용 프로그램 · 열린 권한 기준. 조회/등록 권한을 각각 집계하며 역할 간 중복 프로그램이 포함됩니다. 정렬순 앞 8개 · 선택 시 역할 필터 없이 전체 관리 화면으로 이동합니다."
          data={roles.slice(0, 8)}
          categoryKey="label"
          horizontal
          series={[
            { dataKey: "readCount", name: "조회 허용", color: "#6366f1" },
            { dataKey: "writeCount", name: "등록 허용", color: "#14b8a6" },
          ]}
          loading={loading}
          error={error}
          height={300}
          valueFormatter={formatCount}
          onDataClick={
            menuForPath("/system/user/role")
              ? () => goToList("/system/user/role")
              : undefined
          }
        />
        <article className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                최근 설정 등록·변경
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                메뉴·코드·역할·프로그램의 최종 수정일 또는 등록일 · 최근 8건
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
              설정 기록
            </span>
          </div>
          <RecentChanges
            items={data?.recentChanges ?? []}
            menus={menus}
            stateMessage={stateMessage}
          />
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            감사 로그가 아닌 설정별 최신 기록입니다. 항목 선택은 상세 조회가
            아닌 전체 관리 화면 이동입니다.
          </p>
        </article>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <article className={cardClass}>
          <h2 className="text-sm font-semibold text-slate-900">
            역할 권한 현황
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            사용 중인 모든 역할 · 프로그램 수 기준, 사용자 수가 아닙니다.
          </p>
          <RoleTable
            roles={roles}
            activeProgramCount={data?.activeProgramCount ?? 0}
            stateMessage={stateMessage}
          />
          <p className="mt-3 text-xs text-slate-400">
            비율의 분모는 사용 프로그램 전체입니다. 권한이 없는 역할도 0건으로
            표시합니다.
          </p>
        </article>
        <article className={cardClass}>
          <h2 className="text-sm font-semibold text-slate-900">
            관리 작업 바로가기
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            현재 시스템 메뉴에 등록된 화면으로 이동합니다.
          </p>
          <QuickLinks menus={menus} />
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            관리 화면은 기존 참조 목록이며 대시보드의 실제 설정 집계와 원천이
            다를 수 있습니다. 지원하지 않는 기간·역할·상태 필터는 전달하지
            않습니다.
          </p>
        </article>
      </div>
    </section>
  );
}
