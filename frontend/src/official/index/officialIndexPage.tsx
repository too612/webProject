import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Droplets,
  Flower2,
  HandHeart,
  Heart,
  HeartHandshake,
  Image as ImageIcon,
  MapPin,
  Moon,
  MoonStar,
  Play,
  Tv,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { useOfficialIndexData } from "./officialIndexHook";
import type { BannerItem } from "./officialIndexModel";
import LiveBanner from "../worship/live/LiveBanner";
import { liveApi } from "../worship/live/liveApi";
import { memberNewsApi } from "../news/member/memberApi";
import { MEMBER_EVENT_TYPE_OPTIONS } from "../news/member/memberModel";

const QUICK_MENUS: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/worship/sermons", icon: Tv, label: "주일설교" },
  { to: "/news/nextsteps", icon: UserPlus, label: "새가족등록" },
  { to: "/news/bulletin", icon: BookOpen, label: "주보" },
  { to: "#", icon: Heart, label: "온라인헌금" },
  { to: "/worship/time", icon: Calendar, label: "예배시간" },
  { to: "/about/location", icon: MapPin, label: "오시는 길" },
];

const WORSHIP_SCHEDULE: { day: string; title: string; time: string }[] = [
  { day: "매일", title: "새벽예배", time: "오전 5:00" },
  { day: "주일", title: "주일낮예배", time: "오전 11:00" },
  { day: "주일", title: "주일저녁예배", time: "오후 7:00" },
  { day: "수요", title: "수요예배", time: "오후 7:30" },
  { day: "금요", title: "금요심야예배", time: "오후 9:30" },
];

const GF = [
  "/img/gallery1.svg",
  "/img/gallery2.svg",
  "/img/gallery3.svg",
  "/img/church-bg.svg",
];

type SermonTabKey = "sunday" | "sunday_evening" | "wednesday" | "friday";

const SERMON_TABS: {
  key: SermonTabKey;
  label: string;
  icon: LucideIcon;
  description: string;
  imageUrl: string;
  category?: string;
}[] = [
  {
    key: "sunday",
    label: "주일낮설교",
    icon: Tv,
    description: "주일 낮 예배 설교 영상이 표시되는 영역입니다.",
    imageUrl: "/img/official/index/sermon_01.png",
    category: "sunday_day",
  },
  {
    key: "sunday_evening",
    label: "주일저녁설교",
    icon: MoonStar,
    description: "주일 저녁 예배 설교 영상이 표시되는 영역입니다.",
    imageUrl: "/img/official/index/sermon_04.png",
    category: "sunday_evening",
  },
  {
    key: "wednesday",
    label: "수요설교",
    icon: Calendar,
    description: "수요 예배 설교 영상이 표시되는 영역입니다.",
    imageUrl: "/img/official/index/sermon_02.png",
    category: "wednesday",
  },
  {
    key: "friday",
    label: "금요설교",
    icon: Moon,
    description: "금요 예배 설교 영상이 표시되는 영역입니다.",
    imageUrl: "/img/official/index/sermon_03.png",
    category: "friday",
  },
];

type SermonMeta = {
  date: string;
  title: string;
  scripture: string;
  preacher: string;
  linkUrl: string;
};

const EMPTY_SERMON_META: SermonMeta = {
  date: "",
  title: "",
  scripture: "",
  preacher: "",
  linkUrl: "",
};

/**
 * 설교 영상 제목을 '/' 기준으로 분리한다.
 * 예) "2026년 8월14일(금) 금요심야기도회 / 누가 내 이웃인가? / 누가복음 10:25-37 / 김형수담임목사#다사랑교회#..."
 * → { date: "2026년 8월14일(금) 금요심야기도회", title: "누가 내 이웃인가?", scripture: "누가복음 10:25-37", preacher: "김형수담임목사" }
 */
function parseSermonTitle(rawTitle: string): Omit<SermonMeta, "linkUrl"> {
  const parts = rawTitle.split("/").map(function (s) {
    return s.trim();
  });
  return {
    date: parts[0] ?? "",
    title: parts[1] ?? "",
    scripture: parts[2] ?? "",
    preacher: parts[3] ? parts[3].split("#")[0].trim() : "",
  };
}

function imgUrl(raw: unknown, fb: string): string {
  if (!raw || typeof raw !== "string") return fb;
  if (raw.startsWith("http") || raw.startsWith("/")) return raw;
  return "/api/common/files/" + raw + "/download";
}
function S(v: unknown): string {
  if (v == null) return "";
  if (typeof v !== "string" && typeof v !== "number") return "";
  return String(v);
}
function toEmbedUrl(url: string): string {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|live\/|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (!m) return url;
  return "https://www.youtube.com/embed/" + m[1] + "?autoplay=1";
}
function firstImg(html: unknown): string {
  if (!html || typeof html !== "string") return "";
  const re = /<img[^>]+src=["']([^"']+)["']/i;
  const m = re.exec(html);
  return m ? m[1] : "";
}

/* ============================================================
   SermonTabSection — 방송설교 세그먼트 탭 섹션
   - 상단 세그먼트 컨트롤 4개(주일낮설교 | 주일저녁설교 | 수요설교 | 금요설교)
   - 하단 메인 영상에 탭별 이미지 + 최신 설교 텍스트 오버레이, 클릭 시 모달 재생
   - 주일/수요/금요 최신 영상 1개씩 조회 → 제목을 '/' 기준으로 분리하여 표시
   ============================================================ */
function SermonTabSection() {
  const [tab, setTab] = useState<SermonTabKey>("sunday");
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  const [sermonMeta, setSermonMeta] = useState<
    Record<SermonTabKey, SermonMeta>
  >({
    sunday: EMPTY_SERMON_META,
    sunday_evening: EMPTY_SERMON_META,
    wednesday: EMPTY_SERMON_META,
    friday: EMPTY_SERMON_META,
  });

  const activeTab =
    SERMON_TABS.find(function (t) {
      return t.key === tab;
    }) ?? SERMON_TABS[0];

  // 주일/수요/금요 예배의 가장 최근 영상 1개씩을 조회해 제목을 '/' 기준으로 파싱한다.
  useEffect(function () {
    let cancelled = false;

    SERMON_TABS.forEach(function (t) {
      if (!t.category) return;
      liveApi
        .getLiveItems(t.category)
        .then(function (items) {
          if (cancelled) return;
          const latest = items && items[0] ? items[0] : null;
          if (latest && latest.title) {
            const title = latest.title;
            const linkUrl = latest.linkUrl ?? "";
            setSermonMeta(function (prev) {
              return {
                ...prev,
                [t.key]: { ...parseSermonTitle(title), linkUrl },
              };
            });
          }
        })
        .catch(function () {
          // 조회 실패 시 이미지만 노출 (텍스트 오버레이 없음)
        });
    });

    return function () {
      cancelled = true;
    };
  }, []);

  const activeMeta = sermonMeta[activeTab.key];

  // 메인 영상 공통 스타일 (세그먼트 컨트롤 하단, 16:9)
  const mainBoxClass =
    "relative block aspect-video w-full overflow-hidden border border-slate-200";

  // 이미지 위 텍스트 오버레이 (LEFT 5% / TOP 10%)
  const overlayContent =
    activeMeta &&
    (activeMeta.title || activeMeta.scripture || activeMeta.preacher) ? (
      <div className="absolute left-[5%] top-[10%] px-3 py-2.5 text-left text-brand-dark drop-shadow-sm sm:px-5 sm:py-4">
        {/* 라벨: 주일설교메시지 / 수요설교메시지 / 금요설교메시지 */}
        <p className="whitespace-nowrap text-[10px] font-semibold text-brand-primary sm:text-xs">
          {activeTab.label}메시지
        </p>
        {/* 설교 제목 (1.5배 확대) */}
        {activeMeta.title && (
          <p className="mt-1 text-[21px] font-bold leading-snug sm:text-[27px]">
            {activeMeta.title}
          </p>
        )}
        {/* 성경본문 / 설교자 */}
        {(activeMeta.scripture || activeMeta.preacher) && (
          <div className="mt-2 space-y-0.5 border-t border-brand-primary/30 pt-1.5 sm:mt-4 sm:pt-2">
            {activeMeta.scripture && (
              <p className="text-[10px] text-brand-muted sm:text-sm">
                {activeMeta.scripture}
              </p>
            )}
            {activeMeta.preacher && (
              <p className="text-[10px] text-brand-muted sm:text-sm">
                {activeMeta.preacher}
              </p>
            )}
          </div>
        )}
      </div>
    ) : null;

  // 메인 네모 내부 콘텐츠 (이미지 + 오버레이)
  const mainBoxContent = (
    <>
      <img
        src={activeTab.imageUrl}
        alt={activeTab.label}
        className="h-full w-full object-contain"
        onError={function (e) {
          e.currentTarget.src = "/img/church-bg.svg";
        }}
      />
      {overlayContent}
      {/* 유튜브 재생 버튼 오버레이 */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
        </span>
      </span>
    </>
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {/* 세그먼트 컨트롤 탭 (PC·모바일 공통 상단 배치) */}
      <div
        className="flex w-full gap-1 rounded-lg bg-slate-100 p-1"
        role="tablist"
        aria-label="방송설교 탭"
      >
        {SERMON_TABS.map(function (t) {
          const selected = tab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={function () {
                setTab(t.key);
              }}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                selected
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-slate-500 hover:text-brand-dark"
              }`}
            >
              <Icon className="hidden h-4 w-4 sm:block" />
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 큰 메인 영상 — 클릭 시 모달 플레이어(라이트박스)로 재생 */}
      <div className="relative min-w-0">
        {activeMeta.linkUrl ? (
          <button
            type="button"
            onClick={function () {
              setPlayerUrl(toEmbedUrl(activeMeta.linkUrl));
            }}
            className={mainBoxClass}
            aria-label={(activeMeta.title || activeTab.label) + " 영상 재생"}
          >
            {mainBoxContent}
          </button>
        ) : (
          <div className={mainBoxClass}>{mainBoxContent}</div>
        )}
      </div>

      {/* 유튜브 모달 플레이어 (라이트박스) */}
      {playerUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={function () {
            setPlayerUrl(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="설교 영상 플레이어"
        >
          <div
            className="relative w-full max-w-4xl bg-black shadow-2xl"
            onClick={function (e) {
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              onClick={function () {
                setPlayerUrl(null);
              }}
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={playerUrl}
                title="설교 영상"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PopupLayer — 개별 dismiss
   ============================================================ */
function PopupLayer({ popups }: Readonly<{ popups: BannerItem[] }>) {
  const raw = Array.isArray(popups) ? popups : [];
  const valid = raw.filter(function (p) {
    if (!p.startDt && !p.endDt) return true;
    const now = Date.now();
    if (p.startDt) {
      const sd = Date.parse(p.startDt);
      if (!Number.isNaN(sd) && now < sd) return false;
    }
    if (p.endDt) {
      const ed = Date.parse(p.endDt);
      if (!Number.isNaN(ed) && now > ed) return false;
    }
    return true;
  });
  const [hidden, setHidden] = useState<Set<number>>(function () {
    return new Set();
  });
  const todayKey = new Date().toDateString();

  const dismissOne = useCallback(
    function (i: number, opt: string) {
      setHidden(function (prev) {
        const next = new Set(prev);
        next.add(i);
        if (opt === "today")
          sessionStorage.setItem("popup_dismissed_" + i, todayKey);
        return next;
      });
    },
    [todayKey],
  );

  const dismissAll = useCallback(
    function (opt: string) {
      setHidden(function () {
        const all = new Set<number>();
        for (let i = 0; i < valid.length; i++) all.add(i);
        return all;
      });
      if (opt === "today") sessionStorage.setItem("popup_dismissed", todayKey);
    },
    [valid.length, todayKey],
  );

  const visible = valid.filter(function (_, i) {
    return (
      !hidden.has(i) &&
      sessionStorage.getItem("popup_dismissed_" + i) !== todayKey
    );
  });
  if (visible.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-3 sm:p-4">
      <div className="relative w-full sm:w-auto max-w-[420px] sm:max-w-none border-2 border-white/30 pt-10 bg-white/5">
        <button
          type="button"
          onClick={function () {
            dismissAll("close");
          }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-600 rounded-full text-sm font-bold shadow"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto max-h-[82vh] sm:max-h-none max-w-full px-1 sm:px-2 pb-2 gap-2 snap-y sm:snap-x">
          {visible.map(function (p, vi) {
            const origIdx = valid.indexOf(p);
            const isLast = vi === visible.length - 1;
            return (
              <div
                key={origIdx}
                className="snap-start shrink-0 w-full sm:w-[360px] bg-white overflow-hidden shadow-2xl border-2 border-gray-200 flex flex-col"
              >
                <a
                  href={
                    p.linkUrl
                      ? S(p.linkUrl)
                      : "/news/banner/view?rqstNo=" + S(p.id)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={imgUrl(p.imageUrl, "/img/church-bg.svg")}
                    alt={S(p.title)}
                    className="w-full aspect-[3/4] object-contain"
                  />
                </a>
                <div className="flex border-t border-gray-100 text-xs">
                  <button
                    type="button"
                    onClick={function () {
                      dismissOne(origIdx, "today");
                    }}
                    className="flex-1 py-2.5 text-gray-500 hover:bg-gray-50"
                  >
                    {isLast ? "일주일 안보기" : "오늘 안보기"}
                  </button>
                  <div className="w-px bg-gray-100" />
                  <button
                    type="button"
                    onClick={function () {
                      dismissOne(origIdx, "close");
                    }}
                    className="flex-1 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    닫기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NewBelieverSection — 새가족 안내 6단계 프로세스 섹션
   - PC·모바일 동일: 가로 6단계 프로세스(아이콘 + 하단 텍스트 + 화살표)
   - 모바일: 가로 스크롤이 발생하는 폭 미만이면 3개씩 2줄로 전환(줄 내부 화살표 유지)
   - 섹션 진입 시 단계별 순차 페이드인(스태거 160ms)
   ============================================================ */
const NEW_BELIEVER_STEPS: { icon: LucideIcon; title: string }[] = [
  { icon: ClipboardList, title: "새가족등록" },
  { icon: Flower2, title: "환영·영접" },
  { icon: HandHeart, title: "1:1 섬김이" },
  { icon: Award, title: "새가족수료" },
  { icon: HeartHandshake, title: "사랑방 모임" },
  { icon: Droplets, title: "세례식" },
];

const STEP_COUNT = NEW_BELIEVER_STEPS.length;

function NewBelieverSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [wrapped, setWrapped] = useState(false);
  const naturalWidthRef = useRef(0);
  const wrappedRef = useRef(false);

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
        if (
          entries.some(function (e) {
            return e.isIntersecting;
          })
        ) {
          NEW_BELIEVER_STEPS.forEach(function (_, i) {
            window.setTimeout(function () {
              if (!cancelled) {
                setVisibleCount(function (v) {
                  return Math.max(v, i + 1);
                });
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

  // 가로 스크롤 발생 기준 감지: 한 줄 폭이 컨테이너 폭을 넘어서면 3x2 그리드로 전환
  useEffect(function () {
    const el = rootRef.current;
    if (!el) return;
    const measure = function () {
      if (wrappedRef.current) {
        const next = el.clientWidth + 1 < naturalWidthRef.current;
        wrappedRef.current = next;
        setWrapped(next);
      } else {
        naturalWidthRef.current = el.scrollWidth;
        const next = el.scrollWidth > el.clientWidth + 1;
        wrappedRef.current = next;
        setWrapped(next);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return function () {
      ro.disconnect();
    };
  }, []);

  function stepClass(i: number): string {
    return (
      "transition-all duration-500 " +
      (i < visibleCount
        ? "translate-y-0 opacity-100"
        : "translate-y-2 opacity-0")
    );
  }

  return (
    <section className="bg-slate-50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(280px,360px)_1fr]">
          {/* 좌측 안내 */}
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-brand-dark">
              처음오셨나요?
            </h2>
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

          {/* 가로 6단계 프로세스 (PC·모바일 동일, 좁은 모바일은 3개씩 2줄 + 줄 내부 화살표) */}
          <div
            ref={rootRef}
            className={
              wrapped
                ? "grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-2"
                : "flex items-stretch gap-1 overflow-x-auto pb-2 lg:gap-0"
            }
          >
            {NEW_BELIEVER_STEPS.map(function (step, i) {
              const Icon = step.icon;
              const isLast = i === STEP_COUNT - 1;
              const showArrow = wrapped ? i % 3 !== 2 : !isLast;
              return (
                <Fragment key={step.title}>
                  <div
                    className={
                      "flex flex-col items-center gap-2 text-center " +
                      (wrapped ? "" : "min-w-[78px] flex-1 ") +
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
                  {showArrow && (
                    <ChevronRight className="h-8 w-8 shrink-0 self-center text-slate-300 lg:h-10 lg:w-10" />
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

/* ============================================================
   ChurchNewsCarousel — 공지사항 카드 그리드
   - 이미지(있을 경우) 상단 + 제목/날짜 하단 카드 형태
   - PC 최대 4개 / 모바일 최대 2개 노출
   - 3일 이내 게시글은 NEW 태그 표시
   ============================================================ */
interface ChurchNewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
}

type MemberNewsItem = {
  articleId: number;
  title: string;
  metadata: Record<string, unknown> | string;
  createdAt: string;
};

const MEMBER_EVENT_LABELS = Object.fromEntries(
  MEMBER_EVENT_TYPE_OPTIONS.map(function (option) {
    return [option.value, option.label];
  }),
);

function getMemberNewsMetadata(
  metadata: MemberNewsItem["metadata"],
): Record<string, unknown> {
  if (typeof metadata === "string") {
    try {
      const parsed: unknown = JSON.parse(metadata);
      return parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
  return metadata ?? {};
}

function getMemberEventType(metadata: Record<string, unknown>): string {
  return typeof metadata.eventType === "string" ? metadata.eventType : "";
}

function formatMemberNewsDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toLocaleDateString("ko-KR");
}

function MemberNewsWidget() {
  const [items, setItems] = useState<MemberNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    let cancelled = false;
    setLoading(true);

    memberNewsApi
      .getList(0)
      .then(function (page) {
        if (!cancelled) {
          setItems((page.content ?? []).slice(0, 4) as MemberNewsItem[]);
        }
      })
      .catch(function () {
        if (!cancelled) setItems([]);
      })
      .finally(function () {
        if (!cancelled) setLoading(false);
      });

    return function () {
      cancelled = true;
    };
  }, []);

  let content: JSX.Element;
  if (loading) {
    content = (
      <p className="py-8 text-center text-sm text-gray-400">
        성도소식을 불러오는 중입니다.
      </p>
    );
  } else if (items.length === 0) {
    content = (
      <p className="py-8 text-center text-sm text-gray-400">
        등록된 성도소식이 없습니다.
      </p>
    );
  } else {
    content = (
      <ul className="divide-y divide-gray-100">
        {items.map(function (item) {
          const metadata = getMemberNewsMetadata(item.metadata);
          const eventType = getMemberEventType(metadata);
          const eventLabel = MEMBER_EVENT_LABELS[eventType] ?? "성도소식";

          return (
            <li key={item.articleId} className="py-3 first:pt-0 last:pb-0">
              <Link
                to={`/news/member/view?rqstNo=${item.articleId}`}
                className="group flex items-center gap-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="shrink-0 rounded-full bg-brand-primary/10 px-2 py-1 text-[11px] font-bold text-brand-primary">
                    {eventLabel}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-700 group-hover:text-brand-primary">
                    {item.title}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {formatMemberNewsDate(item.createdAt)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-dark">
          <Heart className="h-4 w-4 text-brand-primary" /> 성도소식
        </h3>
        <Link
          to="/news/member"
          className="text-base font-bold text-brand-primary hover:underline"
        >
          + 더보기
        </Link>
      </div>
      <div className="mt-3 flex-1 rounded-lg border border-slate-200 bg-white p-4">
        {content}
      </div>
    </div>
  );
}

function isNewDate(dateStr: string): boolean {
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 3 * 86400000;
}

function ChurchNewsCarousel({ items }: Readonly<{ items: ChurchNewsItem[] }>) {
  const list = (items || []).slice(0, 4);

  return (
    <section className="bg-white py-14">
      <div className="container mx-auto space-y-8 px-6">
        <div className="relative space-y-2 text-center">
          <h2 className="text-2xl font-bold text-brand-dark lg:text-3xl">
            공지사항
          </h2>
          <p className="text-base text-gray-500">
            다사랑교회의 공지사항을 전합니다.
          </p>
          <Link
            to="/news/notice"
            className="absolute right-0 top-1 text-base font-bold text-brand-primary hover:underline"
          >
            + 더보기
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            등록된 공지사항이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {list.map(function (n) {
              return (
                <Link
                  key={n.id || n.title}
                  to={
                    n.id ? "/news/notice/view?rqstNo=" + n.id : "/news/notice"
                  }
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:border-brand-primary/40 hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    {n.imageUrl ? (
                      <img
                        src={n.imageUrl}
                        alt={n.title}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    {isNewDate(n.date) && (
                      <span className="absolute left-2 top-2 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm font-semibold text-brand-dark group-hover:text-brand-primary">
                      {n.title}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">{n.date}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   GalleryAsymmetricGrid — 다사랑앨범 PC 비대칭 그리드 렌더러 (상당교회 갤러리 벤치마킹)
   - PC(lg 이상): 좌측 대형 1장 + 우측 2x2 소형 4장 비대칭 그리드
   - 모바일: React 상태 기반 드래그 캐러셀(클릭 유지 후 좌우 이동 시 인덱스 갱신)
   ============================================================ */
interface GalleryGridItem {
  id: string | number;
  title: string;
  imageUrl?: string;
  date?: string;
}

interface GalleryAsymmetricGridProps {
  items: GalleryGridItem[];
  onItemClick?: (item: GalleryGridItem) => void;
  emptyText?: string;
}

function MobileGalleryCarousel({
  items,
  onItemClick,
}: Readonly<{
  items: GalleryGridItem[];
  onItemClick?: (item: GalleryGridItem) => void;
}>) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [viewWidth, setViewWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const indexRef = useRef(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const dragXRef = useRef(0);
  const pressedIdxRef = useRef(-1);
  const len = items.length;
  const cardW = viewWidth > 0 ? viewWidth * 0.78 + 12 : 300;
  const clamped = Math.max(0, Math.min(index, len - 1));
  indexRef.current = clamped;
  const trackX = -clamped * cardW + (dragging ? dragX : 0);

  useEffect(function () {
    const el = viewRef.current;
    if (!el) return;
    const measure = function () {
      setViewWidth(el.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return function () {
      ro.disconnect();
    };
  }, []);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const btn = (e.target as HTMLElement).closest("[data-idx]");
    const idx = btn ? Number(btn.getAttribute("data-idx")) : -1;
    pressedIdxRef.current = idx;
    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    dragXRef.current = 0;
    setDragging(true);
    setDragX(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    dragXRef.current = dx;
    if (Math.abs(dx) > 5) movedRef.current = true;
    setDragX(dx);
  }

  function onPointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const dx = dragXRef.current;
    if (!movedRef.current) {
      // 클릭으로 판정 → 해당 앨범 열기
      if (pressedIdxRef.current >= 0) {
        const item = items[pressedIdxRef.current];
        if (item) onItemClick?.(item);
      }
    } else {
      // 드래그 → 다음/이전으로 이동
      const cur = indexRef.current;
      let next = cur;
      if (dx < -50) {
        next = Math.min(len - 1, cur + 1);
      } else if (dx > 50) {
        next = Math.max(0, cur - 1);
      }
      setIndex(next);
    }
    setDragging(false);
    setDragX(0);
    dragXRef.current = 0;
  }

  return (
    <div>
      <div
        ref={viewRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="touch-none select-none overflow-hidden"
      >
        <div
          className="flex gap-3 transition-transform duration-300"
          style={{
            transform: "translateX(" + trackX + "px)",
            transitionDuration: dragging ? "0ms" : "300ms",
          }}
        >
          {items.map(function (item, i) {
            return (
              <div
                key={String(item.id) + i}
                data-idx={i}
                className="relative w-[78%] shrink-0 overflow-hidden rounded-lg bg-slate-100 text-left"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  {item.date && (
                    <p className="text-xs text-white/80">{item.date}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {len > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map(function (_, i) {
            return (
              <button
                key={i}
                type="button"
                aria-label={i + 1 + "번째 앨범"}
                onClick={function () {
                  setIndex(i);
                }}
                className={
                  "h-2 rounded-full transition-all " +
                  (i === clamped ? "w-5 bg-brand-primary" : "w-2 bg-slate-300")
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function GalleryAsymmetricGrid({
  items,
  onItemClick,
  emptyText = "등록된 앨범이 없습니다.",
}: Readonly<GalleryAsymmetricGridProps>) {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">{emptyText}</p>
    );
  }

  const main = items[0];
  const subItems = items.slice(1, 5);

  return (
    <div>
      {/* PC: 비대칭 그리드 */}
      <div className="hidden gap-4 lg:flex">
        <button
          type="button"
          onClick={function () {
            onItemClick?.(main);
          }}
          className="group relative w-1/2 overflow-hidden rounded-lg bg-slate-100 text-left"
        >
          <img
            src={main.imageUrl}
            alt={main.title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-lg font-bold text-white drop-shadow">
              {main.title}
            </p>
            {main.date && <p className="text-xs text-white/80">{main.date}</p>}
          </div>
        </button>
        <div className="grid w-1/2 grid-cols-2 gap-4">
          {subItems.map(function (item, i) {
            return (
              <button
                key={String(item.id) + i}
                type="button"
                onClick={function () {
                  onItemClick?.(item);
                }}
                className="group relative overflow-hidden rounded-lg bg-slate-100 text-left"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-bold text-white drop-shadow">
                    {item.title}
                  </p>
                  {item.date && (
                    <p className="text-xs text-white/80">{item.date}</p>
                  )}
                </div>
              </button>
            );
          })}
          {subItems.length < 4 &&
            Array.from({ length: 4 - subItems.length }).map(function (_, i) {
              return (
                <div
                  key={"ph" + i}
                  className="aspect-[4/3] rounded-lg bg-slate-100"
                />
              );
            })}
        </div>
      </div>

      {/* 모바일: 드래그 캐러셀 */}
      <div className="lg:hidden">
        <MobileGalleryCarousel items={items} onItemClick={onItemClick} />
      </div>
    </div>
  );
}

export default function OfficialIndexPage() {
  const { indexData, loadIndexData } = useOfficialIndexData();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const slides = Array.isArray(indexData.slideBanners)
    ? indexData.slideBanners
    : [];
  const sLen = slides.length;

  useEffect(
    function () {
      loadIndexData();
    },
    [loadIndexData],
  );

  useEffect(
    function () {
      if (sLen === 0) return;
      const t = globalThis.setInterval(function () {
        setCurrent(function (p) {
          return (p + 1) % sLen;
        });
      }, 5000);
      return function () {
        globalThis.clearInterval(t);
      };
    },
    [sLen],
  );

  const dragX = useRef<number | null>(null);
  function prev() {
    setCurrent(function (p) {
      return (p - 1 + sLen) % sLen;
    });
  }
  function next() {
    setCurrent(function (p) {
      return (p + 1) % sLen;
    });
  }
  function onMD(e: React.MouseEvent) {
    if (e.button === 0) dragX.current = e.clientX;
  }
  function onMM(e: React.MouseEvent) {
    if (dragX.current === null) return;
    if ((e.buttons & 1) !== 1) {
      dragX.current = null;
      return;
    }
    const d = e.clientX - dragX.current;
    if (Math.abs(d) < 40) return;
    d > 0 ? prev() : next();
    dragX.current = null;
  }
  function onTS(e: React.TouchEvent) {
    dragX.current = e.touches[0]?.clientX ?? null;
  }
  function onTM(e: React.TouchEvent) {
    const cx = e.touches[0]?.clientX;
    if (dragX.current === null || cx === undefined) return;
    const d = cx - dragX.current;
    if (Math.abs(d) < 40) return;
    d > 0 ? prev() : next();
    dragX.current = null;
  }

  return (
    <>
      <PopupLayer popups={indexData.popupBanners} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[260px] md:min-h-[360px] lg:min-h-[480px] bg-[#0f1c3f]">
        {sLen === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
            등록된 슬라이드 배너가 없습니다.
          </div>
        )}
        {sLen > 0 && (
          <section
            className="relative h-[260px] md:h-[360px] lg:h-[480px] w-full select-none"
            style={{ touchAction: "pan-y" }}
            aria-label="슬라이드 배너"
            aria-roledescription="carousel"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") prev();
              if (e.key === "ArrowRight") next();
            }}
            onMouseDown={onMD}
            onMouseMove={onMM}
            onMouseUp={function () {
              dragX.current = null;
            }}
            onMouseLeave={function () {
              dragX.current = null;
            }}
            onTouchStart={onTS}
            onTouchMove={onTM}
            onTouchEnd={function () {
              dragX.current = null;
            }}
          >
            {slides.map(function (b) {
              const act =
                b.id === slides[current].id ? "opacity-100" : "opacity-0";
              return (
                <div
                  key={b.id}
                  className={
                    "absolute inset-0 transition-opacity duration-700 " + act
                  }
                >
                  <img
                    src={imgUrl(b.imageUrl, "/img/church-bg.svg")}
                    alt={S(b.title)}
                    className="h-full w-full object-contain"
                  />
                  {/* 하단 그라데이션 마스크 (버튼 가독성) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                    <Link
                      to={"/news/banner/view?rqstNo=" + S(b.id)}
                      className="inline-block border-2 border-white/70 px-6 py-2 text-base text-white transition-colors hover:bg-white/20"
                    >
                      자세히보기
                    </Link>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center sm:flex"
            >
              <ChevronLeft
                className="h-20 w-20 text-white drop-shadow-md"
                strokeWidth={2.5}
              />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center sm:flex"
            >
              <ChevronRight
                className="h-20 w-20 text-white drop-shadow-md"
                strokeWidth={2.5}
              />
            </button>
            {sLen > 1 && (
              <div
                className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
                role="tablist"
                aria-label="슬라이드 인디케이터"
              >
                {slides.map(function (b, i) {
                  return (
                    <button
                      type="button"
                      key={b.id}
                      role="tab"
                      aria-selected={i === current}
                      aria-label={i + 1 + "번째 슬라이드"}
                      onClick={function () {
                        setCurrent(i);
                      }}
                      className={
                        "h-2.5 w-6 rounded-[3px] border transition-colors " +
                        (i === current
                          ? "border-white bg-white"
                          : "border-white/70 bg-transparent hover:bg-white/30")
                      }
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}
      </section>

      {/* 실시간 방송 중일 때만 노출되는 라이브 배너 (퀵메뉴 상단) */}
      <LiveBanner />

      {/* Quick Menu */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="container mx-auto px-6 space-y-8">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold tracking-[0.3em] text-gray-400">
              OSAN DASARANG CHURCH
            </p>
            <h2 className="text-2xl font-bold text-brand-dark lg:text-3xl">
              오산 다사랑교회
            </h2>
            <p className="font-semibold text-brand-dark">
              예배와 찬양이 중심이 된 교회입니다.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:grid-cols-6">
            {QUICK_MENUS.map(function (m) {
              const Icon = m.icon;
              return (
                <Link
                  to={m.to}
                  key={m.label}
                  className="group flex flex-col items-center gap-2.5 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-primary">
                    {m.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 새가족 안내 6단계 프로세스 (상당교회 '처음오셨나요?' 벤치마킹) */}
      <NewBelieverSection />

      {/* 방송설교 탭 섹션 + 교회소개 (참고이미지 BROADCAST 구조) */}
      <section className="py-7 bg-white">
        <div className="container mx-auto px-6 space-y-6">
          {/* 환영합니다 섹션 헤더 (가운데 정렬) */}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-brand-dark lg:text-3xl">
              환영합니다
            </h2>
            <p className="text-base text-gray-500">
              다사랑교회에 오신 모든 분들을 주님의 이름으로 진심으로 환영합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SermonTabSection />
            {/* 예배시간 안내 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-brand-dark text-lg">
                  <Clock className="h-4 w-4 text-brand-primary" />
                  예배시간
                </h3>
                <Link
                  to="/worship/time"
                  className="text-base font-bold text-brand-primary hover:underline"
                >
                  + 더보기
                </Link>
              </div>
              <ul className="flex flex-1 flex-col divide-y divide-slate-200 border border-slate-200 px-4">
                {WORSHIP_SCHEDULE.map(function (w) {
                  return (
                    <li
                      key={w.title}
                      className="flex flex-1 items-center gap-3 py-3.5"
                    >
                      <span className="w-11 shrink-0 rounded bg-brand-primary/10 px-1.5 py-1 text-center text-[11px] font-bold text-brand-primary">
                        {w.day}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-800">
                        {w.title}
                      </span>
                      <span className="mx-1 flex-1 border-b border-slate-300" />
                      <span className="shrink-0 text-sm text-slate-500">
                        {w.time}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 공지사항 카드 그리드 */}
      <ChurchNewsCarousel
        items={indexData.recentAnnouncements.map(function (n) {
          const img = n.imageUrl
            ? imgUrl(n.imageUrl, "")
            : firstImg(n.contentHtml);
          return {
            id: n.id,
            title: n.title,
            date: n.date,
            imageUrl: img || undefined,
          };
        })}
      />

      {/* 교회소식 (주보 + 성도소식) */}
      <section className="py-14 bg-slate-50">
        <div className="container mx-auto space-y-8 px-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-brand-dark lg:text-3xl">
              교회소식
            </h2>
            <p className="text-base text-gray-500">
              다사랑교회의 주요소식을 전합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 items-start gap-4 lg:gap-8">
            {/* 주보 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-brand-dark text-lg">
                  <BookOpen className="h-4 w-4 text-brand-primary" />
                  주보
                </h3>
                <Link
                  to="/news/bulletin"
                  className="text-base font-bold text-brand-primary hover:underline"
                >
                  + 더보기
                </Link>
              </div>
              <div className="bg-white border border-slate-200 p-4 flex-1 min-h-0 overflow-y-auto">
                <ul className="divide-y divide-gray-100">
                  {(indexData.recentBulletins.length > 0
                    ? indexData.recentBulletins
                    : [{ id: "", title: "등록된 주보가 없습니다.", date: "" }]
                  ).map(function (n, i) {
                    return (
                      <li
                        key={S(n.id) || i}
                        className="py-2.5 flex items-center justify-between gap-4"
                      >
                        <Link
                          to={
                            n.id
                              ? "/news/bulletin/view?rqstNo=" + S(n.id)
                              : "/news/bulletin"
                          }
                          className="text-sm text-gray-700 hover:text-brand-primary truncate"
                        >
                          {S(n.title)}
                        </Link>
                        <span className="text-xs text-gray-400 shrink-0">
                          {S(n.date)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* 성도소식 */}
            <MemberNewsWidget />
          </div>
        </div>
      </section>

      {/* 다사랑앨범 */}
      <section className="bg-white py-14">
        <div className="container mx-auto space-y-8 px-6">
          <div className="relative space-y-2 text-center">
            <h2 className="text-2xl font-bold text-brand-dark lg:text-3xl">
              다사랑앨범
            </h2>
            <p className="text-base text-gray-500">
              다사랑교회의 주요 활동소식을 전합니다.
            </p>
            <Link
              to="/news/gallery"
              className="absolute right-0 top-1 text-base font-bold text-brand-primary hover:underline"
            >
              + 더보기
            </Link>
          </div>
          <GalleryAsymmetricGrid
            items={indexData.recentGalleries.map(function (g, i) {
              return {
                id: S(g.id),
                title: S(g.title),
                imageUrl: imgUrl(
                  g.imageUrl || firstImg(g.contentHtml),
                  GF[i % GF.length],
                ),
                date: S(g.date),
              };
            })}
            onItemClick={function (item) {
              navigate("/news/gallery/view?rqstNo=" + S(item.id));
            }}
            emptyText="앨범 준비 중"
          />
        </div>
      </section>
    </>
  );
}
