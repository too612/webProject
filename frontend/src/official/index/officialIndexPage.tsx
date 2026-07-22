import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useOfficialIndexData } from "./officialIndexHook";
import type { BannerItem, GalleryItem } from "./officialIndexModel";
import client from "../../common/api/api.client";
import type { ApiResponse } from "../../common/api/api.types";

const QUICK_MENUS = [
  { to: "/worship/sermons", icon: "live_tv", label: "주일설교" },
  { to: "/news/nextsteps", icon: "person_add", label: "새가족등록" },
  { to: "/news/bulletin", icon: "menu_book", label: "주보" },
  { to: "#", icon: "volunteer_activism", label: "온라인헌금" },
  { to: "/worship/time", icon: "calendar_today", label: "예배시간" },
  { to: "/about/location", icon: "place", label: "오시는 길" },
];

const WORSHIP_SCHEDULE = [
  { icon: "wb_twilight", title: "새벽예배", time: "매일 오전 5:00" },
  { icon: "wb_sunny", title: "주일낮예배", time: "주일 오전 11:00" },
  { icon: "nights_stay", title: "주일저녁예배", time: "주일 오후 7:00" },
  { icon: "brightness_3", title: "금요심야예배", time: "금요일 오후 9:30" },
];

const GF = [
  "/img/gallery1.svg",
  "/img/gallery2.svg",
  "/img/gallery3.svg",
  "/img/church-bg.svg",
];

type LiveItem = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  linkUrl: string;
  publishedAt?: string;
};

function imgUrl(raw: unknown, fb: string): string {
  if (!raw || typeof raw !== "string") return fb;
  if (raw.startsWith("http") || raw.startsWith("/")) return raw;
  return "/api/common/files/" + raw + "/download";
}
function S(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object") return "";
  return String(v);
}
function firstImg(html: unknown): string {
  if (!html || typeof html !== "string") return "";
  const re = /<img[^>]+src=["']([^"']+)["']/i;
  const m = re.exec(html);
  return m ? m[1] : "";
}

function SecH(
  p: Readonly<{
    icon: string;
    title: string;
    desc?: string;
    rightExtra?: React.ReactNode;
  }>,
) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-brand-dark">
          <i className="material-icons text-brand-primary">{p.icon}</i>
          {p.title}
        </h2>
        {p.rightExtra}
      </div>
      {p.desc && <p className="text-sm text-gray-500">{p.desc}</p>}
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
          onClick={function () {
            dismissAll("close");
          }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-600 rounded-full text-sm font-bold shadow"
        >
          <i className="material-icons text-base">close</i>
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
                    className="w-full aspect-[3/4] object-cover"
                  />
                </a>
                <div className="flex border-t border-gray-100 text-xs">
                  <button
                    onClick={function () {
                      dismissOne(origIdx, "today");
                    }}
                    className="flex-1 py-2.5 text-gray-500 hover:bg-gray-50"
                  >
                    {isLast ? "일주일 안보기" : "오늘 안보기"}
                  </button>
                  <div className="w-px bg-gray-100" />
                  <button
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

export default function OfficialIndexPage() {
  const { indexData, loadIndexData } = useOfficialIndexData();
  const [current, setCurrent] = useState(0);
  const slides = Array.isArray(indexData.slideBanners)
    ? indexData.slideBanners
    : [];
  const sLen = slides.length;

  // worship/live 주일낮예배 데이터
  const [sermons, setSermons] = useState<LiveItem[]>([]);

  useEffect(
    function () {
      loadIndexData();
    },
    [loadIndexData],
  );

  useEffect(function () {
    client
      .get<ApiResponse<LiveItem[]>>("/official/worship/live", {
        params: { category: "sunday_day" },
      })
      .then(function (r) {
        setSermons(Array.isArray(r.data.data) ? r.data.data : []);
      })
      .catch(function () {});
  }, []);

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
      <section className="relative overflow-hidden min-h-[260px] md:min-h-[320px] lg:min-h-[360px] bg-[#0f1c3f]">
        {sLen === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
            등록된 슬라이드 배너가 없습니다.
          </div>
        )}
        {sLen > 0 && (
          <div
            className="relative h-[260px] md:h-[320px] lg:h-[360px] w-full select-none"
            style={{ touchAction: "pan-y" }}
            role="region"
            aria-roledescription="carousel"
            aria-label="슬라이드 배너"
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
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-16 left-6 right-6 md:left-10 md:right-10">
                    <p className="text-white text-lg md:text-2xl font-bold drop-shadow-lg line-clamp-2">
                      {S(b.title)}
                    </p>
                  </div>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                    <Link
                      to={"/news/banner/view?rqstNo=" + S(b.id)}
                      className="inline-block px-6 py-2 border-2 border-white/70 text-white text-base hover:bg-white/20 transition-colors"
                    >
                      자세히보기
                    </Link>
                  </div>
                </div>
              );
            })}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white hover:bg-black/55 z-10"
            >
              <i className="material-icons text-lg">chevron_left</i>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white hover:bg-black/55 z-10"
            >
              <i className="material-icons text-lg">chevron_right</i>
            </button>
            {sLen > 1 && (
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10"
                role="tablist"
                aria-label="슬라이드 인디케이터"
              >
                {slides.map(function (b, i) {
                  return (
                    <button
                      key={b.id}
                      role="tab"
                      aria-selected={i === current}
                      aria-label={i + 1 + "번째 슬라이드"}
                      onClick={function () {
                        setCurrent(i);
                      }}
                      className={
                        "h-2.5 rounded-full " +
                        (i === current ? "bg-white w-6" : "bg-white/50 w-2.5")
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick Menu */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_MENUS.map(function (m) {
              return (
                <Link
                  to={m.to}
                  key={m.label}
                  className="flex items-center gap-3 p-4 border border-slate-200 hover:border-brand-primary/30 hover:bg-brand-primary/[0.03] transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors shrink-0">
                    <i className="material-icons text-brand-primary group-hover:text-white">
                      {m.icon}
                    </i>
                  </div>
                  <span className="text-sm text-gray-700 font-semibold">
                    {m.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-14 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white shadow-panel border border-gray-100 p-7 space-y-3">
              <div className="flex items-center gap-2 text-brand-primary">
                <i className="material-icons">waving_hand</i>
                <h3 className="font-bold text-brand-dark text-lg">환영인사</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                다사랑교회는 두날개로 날아오르는 건강한 교회입니다. 교회는 예수
                그리스도를 나의 주, 나의 하나님으로 고백하는 성도들의
                모임입니다.
              </p>
              <Link
                to="/about/pastor"
                className="text-sm text-brand-primary hover:underline inline-flex items-center gap-1 font-medium"
              >
                자세히 보기{" "}
                <i className="material-icons text-sm">arrow_forward</i>
              </Link>
            </div>
            <div className="bg-brand-primary text-white shadow-panel p-7 space-y-3">
              <div className="flex items-center gap-2">
                <i className="material-icons">church</i>
                <h3 className="font-bold text-lg">교회 소개</h3>
              </div>
              <p className="text-sm text-white/85 leading-relaxed">
                세상에서 가장 건강한 교회, 세상에서 가장 아름답고 행복한 교회에
                오신 여러분을 환영합니다.
              </p>
              <Link
                to="/about/pastor"
                className="text-sm text-white/90 hover:text-white hover:underline inline-flex items-center gap-1 font-medium"
              >
                자세히 보기{" "}
                <i className="material-icons text-sm">arrow_forward</i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons from worship/live */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6 space-y-6">
          <SecH
            icon="live_tv"
            title="주일설교"
            desc="주일낮예배 설교 영상을 확인하세요."
            rightExtra={
              <Link
                to="/worship/live"
                className="text-s text-brand-primary hover:underline"
              >
                + 더보기
              </Link>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(sermons.length > 0
              ? sermons.slice(0, 5)
              : ([
                  {
                    videoId: "",
                    title: "설교 준비 중",
                    thumbnailUrl: "",
                    linkUrl: "",
                  },
                ] as LiveItem[])
            ).map(function (item, i) {
              return (
                <a
                  key={item.videoId || i}
                  href={item.linkUrl || "/worship/live"}
                  target={item.linkUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group bg-white border border-slate-200 overflow-hidden hover:border-brand-primary/30 hover:shadow-md transition-all"
                >
                  <div className="relative bg-slate-100 aspect-video flex items-center justify-center">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={S(item.title)}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <i className="material-icons text-4xl text-slate-300 group-hover:text-brand-primary/70 transition-colors">
                        video_library
                      </i>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="text-sm font-semibold text-brand-dark line-clamp-2">
                      {S(item.title)}
                    </h4>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6 space-y-6">
          <SecH
            icon="photo_library"
            title="다사랑앨범"
            desc="최근 앨범을 확인해 보세요."
            rightExtra={
              <Link
                to="/news/gallery"
                className="text-s text-brand-primary hover:underline"
              >
                + 더보기
              </Link>
            }
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(indexData.recentGalleries.length > 0
              ? indexData.recentGalleries
              : [
                  {
                    id: "m1",
                    title: "앨범 준비 중",
                    date: "",
                    imageUrl: "",
                  } as GalleryItem,
                ]
            ).map(function (item, i) {
              return (
                <Link
                  key={S(item.id) || i}
                  to={
                    item.id
                      ? "/news/gallery/view?rqstNo=" + S(item.id)
                      : "/news/gallery"
                  }
                  className="group overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={imgUrl(
                      item.imageUrl || firstImg(item.contentHtml),
                      GF[i % GF.length],
                    )}
                    alt={S(item.title)}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1.5 p-4">
                    <p className="text-xs font-medium text-brand-primary">
                      최근 앨범
                    </p>
                    <h3 className="text-sm font-semibold text-brand-dark line-clamp-2">
                      {S(item.title)}
                    </h3>
                    <p className="text-xs text-gray-400">{S(item.date)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Worship Time */}
      <section className="py-14 bg-brand-primary/[0.05]">
        <div className="container mx-auto px-6 space-y-6">
          <SecH
            icon="schedule"
            title="예배 시간 안내"
            desc="처음 오시는 분도 쉽게 확인할 수 있도록 안내합니다."
            rightExtra={
              <Link
                to="/worship/time"
                className="text-s text-brand-primary hover:underline"
              >
                + 더보기
              </Link>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORSHIP_SCHEDULE.map(function (w) {
              return (
                <div
                  key={w.title}
                  className="bg-white shadow-panel border border-gray-100 p-5 text-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto">
                    <i className="material-icons text-brand-primary">
                      {w.icon}
                    </i>
                  </div>
                  <h4 className="font-semibold text-brand-dark text-sm">
                    {w.title}
                  </h4>
                  <p className="text-brand-primary font-medium text-sm">
                    {w.time}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notice & Bulletin */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-brand-dark text-lg">
                  <i className="material-icons text-brand-primary text-base">
                    campaign
                  </i>
                  공지사항
                </h3>
                <Link
                  to="/news/notice"
                  className="text-s text-brand-primary hover:underline"
                >
                  + 더보기
                </Link>
              </div>
              <div className="bg-white border border-slate-200 p-5 max-h-[240px] overflow-y-auto">
                <ul className="divide-y divide-gray-100">
                  {(indexData.recentAnnouncements.length > 0
                    ? indexData.recentAnnouncements
                    : [
                        {
                          id: "",
                          title: "등록된 공지사항이 없습니다.",
                          date: "",
                        },
                      ]
                  ).map(function (n, i) {
                    return (
                      <li
                        key={S(n.id) || i}
                        className="py-2.5 flex items-center justify-between gap-4"
                      >
                        <Link
                          to={
                            n.id
                              ? "/news/notice/view?rqstNo=" + S(n.id)
                              : "/news/notice"
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-brand-dark text-lg">
                  <i className="material-icons text-brand-primary text-base">
                    menu_book
                  </i>
                  주보
                </h3>
                <Link
                  to="/news/bulletin"
                  className="text-s text-brand-primary hover:underline"
                >
                  + 더보기
                </Link>
              </div>
              <div className="bg-white border border-slate-200 p-5 max-h-[240px] overflow-y-auto">
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
          </div>
        </div>
      </section>
    </>
  );
}
