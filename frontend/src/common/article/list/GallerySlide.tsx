import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import type { ArticleItem } from "../ArticleModel";

const CONTENT_IMG_SRC_REGEX = /<img[^>]+src=["']([^"']+)["']/;
const DRAG_THRESHOLD = 50;

interface GallerySlideProps {
  items: ArticleItem[];
  loading?: boolean;
  onItemClick?: (item: ArticleItem, allItems: ArticleItem[]) => void;
  width?: string | number;
  height?: string | number;
}

function resolveThumbnail(item: ArticleItem): string | null {
  if (item.thumbnailFileId)
    return `/api/common/files/${item.thumbnailFileId}/download`;
  if (item.firstFileId)
    return `/api/common/files/${item.firstFileId}/download`;
  if (item.fileList?.length) {
    const first = item.fileList[0];
    const ext = (first.orgFileNm || "").split(".").pop()?.toLowerCase() || "";
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext) &&
      first.fileId
    ) {
      return `/api/common/files/${first.fileId}/download`;
    }
  }
  const match = CONTENT_IMG_SRC_REGEX.exec(item.contentHtml || "");
  return match?.[1] ?? null;
}

export function GallerySlide({
  items,
  loading = false,
  onItemClick,
  width,
  height,
}: Readonly<GallerySlideProps>) {
  const sLen = items.length;
  const [current, setCurrent] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const indexRef = useRef(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const dragXRef = useRef(0);
  const pressedIdxRef = useRef(-1);

  const clamped = Math.max(0, Math.min(current, sLen - 1));
  indexRef.current = clamped;

  useEffect(
    function () {
      if (current >= sLen) setCurrent(0);
    },
    [sLen, current],
  );

  function goTo(i: number) {
    setCurrent(Math.max(0, Math.min(i, sLen - 1)));
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
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

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    dragXRef.current = dx;
    if (Math.abs(dx) > 5) movedRef.current = true;
    setDragX(dx);
  }

  function handlePointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const dx = dragXRef.current;
    if (!movedRef.current) {
      // 클릭으로 판정 → 해당 글 열기
      if (pressedIdxRef.current >= 0) {
        const item = items[pressedIdxRef.current];
        if (item) onItemClick?.(item, items);
      }
    } else {
      // 드래그 → 다음/이전 슬라이드로 이동
      const cur = indexRef.current;
      if (dx < -DRAG_THRESHOLD) goTo(Math.min(sLen - 1, cur + 1));
      else if (dx > DRAG_THRESHOLD) goTo(Math.max(0, cur - 1));
    }
    setDragging(false);
    setDragX(0);
    dragXRef.current = 0;
  }

  function handlePointerCancel() {
    handlePointerUp();
  }

  if (loading) {
    return (
      <div className="flex h-full w-full min-h-[240px] items-center justify-center bg-slate-100 text-sm text-slate-400">
        불러오는 중...
      </div>
    );
  }

  if (sLen === 0) {
    return (
      <div className="flex h-full w-full min-h-[240px] items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-400">
        등록된 활동이 없습니다.
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full max-w-full min-h-[240px] touch-pan-y select-none overflow-hidden bg-slate-900"
      style={{ width, height }}
      aria-roledescription="carousel"
      aria-label="활동 갤러리 슬라이드"
      tabIndex={0}
      onKeyDown={function (e) {
        if (e.key === "ArrowLeft") goTo(clamped - 1);
        if (e.key === "ArrowRight") goTo(clamped + 1);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDragStart={function (e) {
        e.preventDefault();
      }}
    >
      <div
        className="absolute inset-0 flex transition-transform"
        style={{
          transform:
            "translateX(calc(" +
            -clamped * 100 +
            "% + " +
            (dragging ? dragX : 0) +
            "px))",
          transitionDuration: dragging ? "0ms" : "500ms",
        }}
      >
        {items.map(function (item, i) {
          const url = resolveThumbnail(item);
          return (
            <div
              key={item.articleId}
              data-idx={i}
              className="relative h-full w-full shrink-0 cursor-pointer"
            >
              {url ? (
                <img
                  src={url}
                  alt={item.title}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                  <Image className="h-12 w-12" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sLen > 1 && (
        <>
          <button
            type="button"
            onPointerDown={function (e) {
              e.stopPropagation();
            }}
            onClick={function () {
              goTo(clamped - 1);
            }}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white hover:bg-black/55"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onPointerDown={function (e) {
              e.stopPropagation();
            }}
            onClick={function () {
              goTo(clamped + 1);
            }}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white hover:bg-black/55"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            role="tablist"
            aria-label="슬라이드 인디케이터"
          >
            {items.map(function (item, i) {
              return (
                <button
                  key={item.articleId}
                  type="button"
                  role="tab"
                  aria-selected={i === clamped}
                  aria-label={i + 1 + "번째 슬라이드"}
                  onPointerDown={function (e) {
                    e.stopPropagation();
                  }}
                  onClick={function () {
                    goTo(i);
                  }}
                  className={
                    "h-1.5 rounded-full transition-all " +
                    (i === clamped ? "w-6 bg-white" : "w-1.5 bg-white/50")
                  }
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
