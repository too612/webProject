/**
 * File Name   : GalleryFilmstrip
 * Description : 다사랑앨범 필름스트립 캐러셀 렌더러
 * -----------------------------------------------------------------------------
 * - 반응형 슬롯: 데스크톱 1x5(회색2+메인3) / 모바일 1x3(회색2+메인1)
 * - 양 끝 회색 미리보기(비활성), 경계 도달 시 빈칸, 가운데 이미지 강조
 * - 좌우 드래그 시 포인터를 따라 이동 후 스냅 (거리 1칸 + 드래그 속도에 따라 2~3칸)
 * - 실이미지 클릭 시 onItemClick 호출 (드래그가 감지된 경우 클릭 억제)
 */

// ============================================================
// HEADER & CONFIG
// ============================================================
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

const DRAG_THRESHOLD_PX = 5; // 드래그/클릭 판별 기준(px)
const SNAP_RATIO = 0.25; // 슬롯 폭 대비 스냅 판정 비율
const ANIM_MS = 300; // 스냅 애니메이션 시간(ms)
const VELOCITY_WINDOW_MS = 120; // 속도 계산 샘플 창(ms)
const VELOCITY_MEDIUM = 0.8; // px/ms 초과 → 2칸 이동
const VELOCITY_FAST = 1.5; // px/ms 초과 → 3칸 이동

export interface FilmstripItem {
  id: string | number;
  title: string;
  imageUrl?: string;
  date?: string;
}

export interface GalleryFilmstripProps {
  items: FilmstripItem[];
  loading?: boolean;
  onItemClick?: (item: FilmstripItem) => void;
  emptyText?: string;
}

// ============================================================
// COMPONENT & LIFECYCLE
// ============================================================
export function GalleryFilmstrip({
  items,
  loading = false,
  onItemClick,
  emptyText = "등록된 앨범이 없습니다.",
}: Readonly<GalleryFilmstripProps>) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [viewWidth, setViewWidth] = useState(0);
  const [start, setStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [animating, setAnimating] = useState(false);

  const startRef = useRef(0);
  startRef.current = start;
  const suppressClickRef = useRef(false);
  const swapTokenRef = useRef(0);
  // 드래그는 이 페이지에서 동작이 검증된 히어로 배너 패턴(mouse+touch 인라인 핸들러)을 따른다.
  // (setPointerCapture를 쓰면 click 이벤트가 버튼에 도달하지 못하므로 사용하지 않는다)
  const gestureRef = useRef<{
    startX: number;
    moved: boolean;
    lastX: number;
    samples: { x: number; t: number }[];
  } | null>(null);

  const len = items.length;
  const isMobile = viewWidth > 0 && viewWidth < 768;
  const visibleSlots = isMobile ? 3 : 5; // 모바일 1x3 / 데스크톱 1x5
  const realSlots = isMobile ? 1 : 3;
  const slotW = viewWidth > 0 ? viewWidth / visibleSlots : 0;
  const maxStart = Math.max(0, len - realSlots);
  const centerIndex = Math.floor(realSlots / 2);
  const realItems = items.slice(start, start + realSlots);
  const leftNeighbor = start > 0 ? items[start - 1] : null;
  const rightNeighbor =
    start + realSlots < len ? items[start + realSlots] : null;

  // 컨테이너 폭 측정 (반응형 대응)
  useEffect(
    function () {
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
    },
    [],
  );

  // 데이터/표시 슬롯 변경 시 스냅 상태 초기화 및 경계 보정
  useEffect(
    function () {
      swapTokenRef.current += 1;
      setAnimating(false);
      setDragOffset(0);
      setStart(function (p) {
        return Math.min(p, Math.max(0, len - realSlots));
      });
    },
    [len, realSlots],
  );

  // ============================================================
  // LOGIC & EVENT HANDLERS
  // ============================================================
  const commit = useCallback(
    function (nextStart: number, dir: -1 | 1) {
      const token = swapTokenRef.current + 1;
      swapTokenRef.current = token;
      const target = Math.max(0, Math.min(nextStart, maxStart));
      if (target === startRef.current) {
        // 경계(또는 제자리): 스냅 백
        setAnimating(true);
        setDragOffset(0);
        return;
      }
      // 1단계: 트랜지션 없이 드래그 방향으로 이동할 슬롯 수만큼 이동
      const dist = Math.abs(target - startRef.current);
      setAnimating(false);
      setDragOffset(dir * dist * slotW);
      // 2단계: 내용 교체 후 원위치로 슬라이드 인
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (token !== swapTokenRef.current) return;
          startRef.current = target;
          setStart(target);
          setAnimating(true);
          setDragOffset(0);
        });
      });
    },
    [maxStart, slotW],
  );

  // 최근 VELOCITY_WINDOW_MS 샘플로 속도(px/ms)를 계산한다.
  function resolveVelocity(g: {
    samples: { x: number; t: number }[];
  }): number {
    const now = performance.now();
    const recent = g.samples.filter(function (s) {
      return now - s.t <= VELOCITY_WINDOW_MS;
    });
    if (recent.length < 2) return 0;
    const first = recent[0];
    const last = recent[recent.length - 1];
    const dt = last.t - first.t;
    if (dt <= 0) return 0;
    return Math.abs((last.x - first.x) / dt);
  }

  function endDrag(
    clientX: number,
    g: { startX: number; moved: boolean; samples: { x: number; t: number }[] },
  ) {
    const dx = clientX - g.startX;
    const moved = g.moved;
    gestureRef.current = null;
    if (!moved || slotW === 0) return;
    if (Math.abs(dx) < slotW * SNAP_RATIO) {
      setAnimating(true);
      setDragOffset(0);
      return;
    }
    // 왼쪽 드래그(dx<0) → 다음(전진), 오른쪽 드래그(dx>0) → 이전(후진)
    const dir: -1 | 1 = dx < 0 ? -1 : 1;
    // 거리로 기본 1칸 + 속도 보너스(빠르면 2~3칸)
    const v = resolveVelocity(g);
    let steps = 1;
    if (v > VELOCITY_FAST) steps = 3;
    else if (v > VELOCITY_MEDIUM) steps = 2;
    commit(
      dir === -1 ? startRef.current + steps : startRef.current - steps,
      dir,
    );
  }

  function handleMouseDown(e: ReactMouseEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    swapTokenRef.current += 1;
    gestureRef.current = {
      startX: e.clientX,
      moved: false,
      lastX: e.clientX,
      samples: [],
    };
    suppressClickRef.current = false;
    setDragOffset(0);
    setAnimating(false);
  }

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const g = gestureRef.current;
    if (!g) return;
    const dx = e.clientX - g.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX) {
      g.moved = true;
      suppressClickRef.current = true;
    }
    if (g.moved) {
      g.lastX = e.clientX;
      g.samples.push({ x: e.clientX, t: performance.now() });
      if (g.samples.length > 8) g.samples.shift();
      setDragOffset(dx);
    }
  }

  function handleMouseUp(e: ReactMouseEvent<HTMLDivElement>) {
    const g = gestureRef.current;
    if (!g) return;
    endDrag(e.clientX, g);
  }

  function handleMouseLeave() {
    const g = gestureRef.current;
    if (!g) return;
    endDrag(g.lastX, g);
  }

  function handleTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
    const cx = e.touches[0]?.clientX;
    if (cx === undefined) return;
    swapTokenRef.current += 1;
    gestureRef.current = {
      startX: cx,
      moved: false,
      lastX: cx,
      samples: [],
    };
    suppressClickRef.current = false;
    setDragOffset(0);
    setAnimating(false);
  }

  function handleTouchMove(e: ReactTouchEvent<HTMLDivElement>) {
    const g = gestureRef.current;
    if (!g) return;
    const cx = e.touches[0]?.clientX;
    if (cx === undefined) return;
    const dx = cx - g.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX) {
      g.moved = true;
      suppressClickRef.current = true;
    }
    if (g.moved) {
      g.lastX = cx;
      g.samples.push({ x: cx, t: performance.now() });
      if (g.samples.length > 8) g.samples.shift();
      setDragOffset(dx);
    }
  }

  function handleTouchEnd(e: ReactTouchEvent<HTMLDivElement>) {
    const g = gestureRef.current;
    if (!g) return;
    const cx = e.changedTouches[0]?.clientX;
    endDrag(cx ?? g.lastX, g);
  }

  const handleKeyDown = useCallback(
    function (e: ReactKeyboardEvent<HTMLDivElement>) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        commit(startRef.current - 1, 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        commit(startRef.current + 1, -1);
      }
    },
    [commit],
  );

  const handleItemClick = useCallback(
    function (item: FilmstripItem) {
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        return;
      }
      onItemClick?.(item);
    },
    [onItemClick],
  );


  // ============================================================
  // RENDER METHODS
  // ============================================================
  if (loading) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
        불러오는 중...
      </div>
    );
  }

  if (len === 0) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-400">
        {emptyText}
      </div>
    );
  }

  const trackStyle: CSSProperties = {
    transform: `translate3d(${dragOffset}px, 0, 0)`,
    transition: animating ? `transform ${ANIM_MS}ms ease` : "none",
  };

  const slotStyle: CSSProperties = { width: `${100 / visibleSlots}%` };

  return (
    <div
      ref={viewRef}
      role="region"
      aria-label="다사랑앨범 필름스트립"
      aria-roledescription="carousel"
      tabIndex={0}
      draggable={false}
      onDragStart={function (e) {
        e.preventDefault();
      }}
      className="relative select-none overflow-hidden outline-none cursor-grab active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="flex items-stretch" style={trackStyle}>
        {/* 왼쪽 회색 미리보기 슬롯 (경계 도달 시 빈칸) */}
        <div className="shrink-0" style={slotStyle} aria-hidden="true">
          {leftNeighbor ? (
            <EdgeSlot item={leftNeighbor} />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>

        {/* 중앙 실이미지 (가운데 강조) */}
        {realItems.map(function (item, idx) {
          const isCenter = idx === centerIndex;
          return (
            <div
              key={String(item.id)}
              className="shrink-0 p-1.5"
              style={slotStyle}
            >
              <button
                type="button"
                onClick={function () {
                  handleItemClick(item);
                }}
                className={
                  "group relative block h-full w-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg " +
                  (isCenter
                    ? "z-10 ring-2 ring-brand-primary/70 shadow-lg" +
                      (realSlots > 1 ? " scale-[1.06]" : "")
                    : "scale-100")
                }
                aria-label={String(item.title)}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={String(item.title)}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}

        {/* 오른쪽 회색 미리보기 슬롯 (경계 도달 시 빈칸 유지) */}
        <div className="shrink-0" style={slotStyle} aria-hidden="true">
          {rightNeighbor ? (
            <EdgeSlot item={rightNeighbor} />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      </div>

      {/* 이전/다음 이동 버튼 (경계에서는 숨김) */}
      <button
        type="button"
        aria-label="이전 앨범"
        disabled={start <= 0}
        onMouseDown={function (e) {
          e.stopPropagation();
        }}
        onTouchStart={function (e) {
          e.stopPropagation();
        }}
        onClick={function () {
          commit(startRef.current - 1, 1);
        }}
        className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-1.5 text-white transition-opacity hover:bg-black/55 disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="다음 앨범"
        disabled={start >= maxStart}
        onMouseDown={function (e) {
          e.stopPropagation();
        }}
        onTouchStart={function (e) {
          e.stopPropagation();
        }}
        onClick={function () {
          commit(startRef.current + 1, -1);
        }}
        className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-1.5 text-white transition-opacity hover:bg-black/55 disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// ============================================================
// SUB COMPONENT : 회색 미리보기 슬롯
// ============================================================
function EdgeSlot({ item }: Readonly<{ item: FilmstripItem }>) {
  return (
    <div className="flex h-full w-full flex-col justify-center p-1.5">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover opacity-40 grayscale"
          />
        ) : (
          <div className="h-full w-full bg-slate-300/60" />
        )}
        <div className="absolute inset-0 bg-slate-500/10" />
      </div>
    </div>
  );
}

