import React, { useEffect, useState, useRef } from "react";
import type { ArticleItem } from "./ArticleModel";

interface ImageLightboxProps {
  items: ArticleItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  items,
  initialIndex,
  isOpen,
  onClose,
}: Readonly<ImageLightboxProps>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 키보드 이벤트 (ESC, 좌/우 화살표)
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isOpen, currentIndex]);

  // 팝업 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // 인덱스 초기화 (열릴 때)
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const totalCount = items.length;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
  };

  const getImageUrl = (item: ArticleItem): string | null => {
    if (item.thumbnailFileId) {
      return `/api/common/files/${item.thumbnailFileId}/download`;
    }
    if (item.firstFileId) {
      return `/api/common/files/${item.firstFileId}/download`;
    }
    if (item.fileList && item.fileList.length > 0) {
      const firstFile = item.fileList[0];
      const fileName = firstFile.orgFileNm || "";
      const ext = fileName.split(".").pop()?.toLowerCase() || "";
      const imageExts = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "bmp",
        "ico",
      ];
      if (imageExts.includes(ext) && firstFile.fileId) {
        return `/api/common/files/${firstFile.fileId}/download`;
      }
    }
    return null;
  };

  const imageUrl = getImageUrl(currentItem);

  // 드래그/스와이프 (PC + 모바일)
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
    setIsDragging(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const diff = Math.abs(e.clientX - dragStartX);
    if (diff > 10) {
      setIsDragging(true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
    setDragStartX(null);
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setDragStartX(touch.clientX);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const touch = e.changedTouches[0];
    if (!touch) {
      setDragStartX(null);
      return;
    }
    const diff = touch.clientX - dragStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
    setDragStartX(null);
    setIsDragging(false);
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl max-h-[82vh] bg-black/40 rounded-xl shadow-2xl flex flex-col items-center justify-center overflow-hidden"
        onClick={handleContentClick}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white/15 hover:bg-white/30 text-white rounded-full px-3 py-1.5 transition-colors backdrop-blur-sm border border-white/20"
          aria-label="닫기"
        >
          <span className="material-icons text-xl">close</span>
          <span className="text-sm font-medium hidden sm:inline">닫기</span>
        </button>

        {/* 좌/우 이동 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 text-white transition-colors p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10"
          aria-label="이전"
        >
          <span className="material-icons text-5xl md:text-6xl drop-shadow-lg">
            chevron_left
          </span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 text-white transition-colors p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10"
          aria-label="다음"
        >
          <span className="material-icons text-5xl md:text-6xl drop-shadow-lg">
            chevron_right
          </span>
        </button>

        {/* 이미지 영역 (상단/하단 여백 확보) */}
        <div
          className="flex items-center justify-center w-full h-full max-h-[55vh] px-4 md:px-8 pt-12 pb-8 md:pt-16 md:pb-12 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={currentItem.title || "이미지"}
              className="max-w-full max-h-full object-contain pointer-events-none"
              draggable={false}
            />
          ) : (
            <div className="w-full h-[30vh] flex items-center justify-center text-gray-500">
              <span className="material-icons text-6xl">broken_image</span>
            </div>
          )}
        </div>

        {/* 하단 정보 (제목 + 페이지 번호) */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-white z-20 px-4 pointer-events-none">
          <div className="text-sm font-medium truncate max-w-xs mx-auto">
            {currentItem.title || "제목 없음"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {currentIndex + 1} / {totalCount}
          </div>
        </div>
      </div>
    </div>
  );
}
