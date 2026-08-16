/**
 * File Name   : GalleryAsymmetricGrid
 * Description : 다사랑앨범 PC 비대칭 그리드 렌더러 (상당교회 갤러리 벤치마킹)
 * - PC(lg 이상): 좌측 대형 1장 + 우측 2x2 소형 4장 비대칭 그리드
 * - 모바일: React 상태 기반 드래그 캐러셀(클릭 유지 후 좌우 이동 시 인덱스 갱신)
 */
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
export interface GalleryGridItem {
  id: string | number;
  title: string;
  imageUrl?: string;
  date?: string;
}

export interface GalleryAsymmetricGridProps {
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

export default function GalleryAsymmetricGrid({
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
          <p className="text-lg font-bold text-white drop-shadow">{main.title}</p>
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
