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
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef<{ startX: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const draggingRef = useRef(false);

  useEffect(
    function () {
      if (current >= sLen) setCurrent(0);
    },
    [sLen, current],
  );

  const handlePointerDown = function (e: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    dragRef.current = { startX: e.clientX, moved: false };
    setDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = function (e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 8) {
      draggingRef.current = true;
      dragRef.current.moved = true;
    }
    if (draggingRef.current) {
      setDragOffset(delta);
    }
  };

  const handlePointerUp = function (e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    const delta = e.clientX - dragRef.current.startX;
    const moved = dragRef.current.moved;
    dragRef.current = null;
    draggingRef.current = false;
    setDragOffset(0);
    if (!moved) return;
    suppressClickRef.current = true;
    if (delta < -DRAG_THRESHOLD) setCurrent((p) => (p + 1) % sLen);
    else if (delta > DRAG_THRESHOLD) setCurrent((p) => (p - 1 + sLen) % sLen);
  };

  const handlePointerCancel = function () {
    dragRef.current = null;
  };

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
        if (e.key === "ArrowLeft") setCurrent((p) => (p - 1 + sLen) % sLen);
        if (e.key === "ArrowRight") setCurrent((p) => (p + 1) % sLen);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDragStart={function (e) {
        e.preventDefault();
      }}
    >
      {items.map(function (item, i) {
        const url = resolveThumbnail(item);
        return (
          <button
            key={item.articleId}
            type="button"
            onClick={function () {
              if (suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
              }
              onItemClick?.(item, items);
            }}
            className={
              "absolute inset-0 text-left transition-opacity duration-700 " +
              (i === current
                ? "opacity-100"
                : "pointer-events-none opacity-0")
            }
            style={
              i === current
                ? {
                    transform:
                      dragOffset !== 0
                        ? `translateX(${dragOffset}px)`
                        : undefined,
                    transition: draggingRef.current
                      ? "none"
                      : "transform 300ms ease, opacity 700ms ease",
                  }
                : undefined
            }
            aria-label={item.title}
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
          </button>
        );
      })}

      {sLen > 1 && (
        <>
          <button
            type="button"
            onPointerDown={function (e) {
              e.stopPropagation();
            }}
            onClick={function () {
              setCurrent((p) => (p - 1 + sLen) % sLen);
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
              setCurrent((p) => (p + 1) % sLen);
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
                  aria-selected={i === current}
                  aria-label={i + 1 + "번째 슬라이드"}
                  onPointerDown={function (e) {
                    e.stopPropagation();
                  }}
                  onClick={function () {
                    setCurrent(i);
                  }}
                  className={
                    "h-1.5 rounded-full " +
                    (i === current ? "w-6 bg-white" : "w-1.5 bg-white/50")
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
