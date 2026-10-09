import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Dialog, DialogPortal, DialogTitle } from "@/common/ui/dialog";
import {
  getPopupDismissOption,
  getPopupBudget,
  getPopupLayout,
  getPopupPage,
  isPopupDismissed,
  isPopupInPeriod,
  parsePopupDismissal,
  POPUP_DISMISS_POLICIES,
  popupStorageKey,
  type BannerItem,
  type PopupDismissOption,
  type PopupDismissal,
  type PopupImageSize,
} from "./officialIndexModel";
import "@/styles/officialIndexPopup.css";

type ImageState = {
  source: string;
  status: "ready" | "error";
  size: PopupImageSize;
};

function imageSource(value: string): string {
  if (!value) return "";
  return value.startsWith("http") || value.startsWith("/")
    ? value
    : `/api/common/files/${value}/download`;
}

export default function OfficialIndexPopup({
  popups,
}: Readonly<{ popups: BannerItem[] }>) {
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [dismissals, setDismissals] = useState<Record<string, PopupDismissal>>(
    {},
  );
  const [restoredPopups, setRestoredPopups] = useState<BannerItem[] | null>(
    null,
  );
  const [images, setImages] = useState<Record<string, ImageState>>({});
  const [retry, setRetry] = useState(0);
  const [activeId, setActiveId] = useState<string>();
  const [now, setNow] = useState(Date.now);
  const [viewport, setViewport] = useState(() => ({
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
    top: window.visualViewport?.offsetTop ?? 0,
    left: window.visualViewport?.offsetLeft ?? 0,
  }));
  const [available, setAvailable] = useState({ width: 288, height: 400 });
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null,
  );
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const storageErrorShown = useRef(false);

  const reportStorageError = useCallback((error: unknown) => {
    console.error("공식 홈 팝업 숨김 저장소 오류", error);
    if (!storageErrorShown.current) {
      storageErrorShown.current = true;
      toast.error(
        "팝업 숨김 기간을 유지할 수 없습니다. 브라우저 저장소 설정을 확인해주세요.",
      );
    }
  }, []);

  useEffect(() => {
    const restored: Record<string, PopupDismissal> = {};
    for (const popup of popups) {
      try {
        const key = popupStorageKey(popup.id);
        const raw = localStorage.getItem(key);
        if (raw === null) continue;
        let record: PopupDismissal;
        try {
          record = parsePopupDismissal(raw);
        } catch (error) {
          console.error("손상된 팝업 숨김 데이터 제거", popup.id, error);
          toast.error("팝업 숨김 정보가 손상되어 초기화했습니다.");
          localStorage.removeItem(key);
          continue;
        }
        if (isPopupDismissed(popup, record, Date.now())) {
          restored[popup.id] = record;
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        reportStorageError(error);
      }
    }
    setDismissals(restored);
    setRestoredPopups(popups);
  }, [popups, reportStorageError]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const refresh = () => setNow(Date.now());
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    const refresh = () =>
      setViewport({
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
        top: window.visualViewport?.offsetTop ?? 0,
        left: window.visualViewport?.offsetLeft ?? 0,
      });
    window.addEventListener("resize", refresh);
    window.visualViewport?.addEventListener("resize", refresh);
    window.visualViewport?.addEventListener("scroll", refresh);
    return () => {
      window.removeEventListener("resize", refresh);
      window.visualViewport?.removeEventListener("resize", refresh);
      window.visualViewport?.removeEventListener("scroll", refresh);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loaders = popups.map((popup) => {
      const source = imageSource(popup.imageUrl);
      const image = new Image();
      const finish = (status: ImageState["status"]) => {
        if (cancelled) return;
        if (status === "error")
          console.error("팝업 이미지 로드 실패", popup.id, source);
        setImages((previous) => ({
          ...previous,
          [popup.id]: {
            source,
            status,
            size:
              status === "ready"
                ? { width: image.naturalWidth, height: image.naturalHeight }
                : { width: 3, height: 4 },
          },
        }));
      };
      image.onload = () =>
        finish(
          image.naturalWidth > 0 && image.naturalHeight > 0 ? "ready" : "error",
        );
      image.onerror = () => finish("error");
      if (source) image.src = source;
      else finish("error");
      return image;
    });
    return () => {
      cancelled = true;
      loaders.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [popups, retry]);

  const visible =
    restoredPopups === popups
      ? popups.filter((popup) => {
          return (
            !hidden.has(popup.id) &&
            isPopupInPeriod(popup, now) &&
            !isPopupDismissed(popup, dismissals[popup.id], now)
          );
        })
      : [];
  const mobile = viewport.width < 768;
  const layouts = visible.map((popup) =>
    getPopupLayout(
      images[popup.id]?.source === imageSource(popup.imageUrl)
        ? images[popup.id].size
        : { width: 3, height: 4 },
      available,
      mobile,
    ),
  );
  const activeIndex = Math.max(
    0,
    visible.findIndex((popup) => popup.id === activeId),
  );
  const selectedId = visible[activeIndex]?.id;
  useEffect(() => {
    if (restoredPopups === popups && selectedId !== activeId)
      setActiveId(selectedId);
  }, [selectedId, activeId, restoredPopups, popups]);
  const page = getPopupPage(
    layouts.map((layout) => layout.width),
    activeIndex,
    available.width,
    mobile,
  );
  const shown = visible.slice(page.start, page.end);
  const open = visible.length > 0;
  const hasNavigation = visible.length > 0;
  const imageHeight = Math.max(
    0,
    ...layouts.slice(page.start, page.end).map((layout) => layout.height),
  );

  useLayoutEffect(() => {
    const content = contentElement;
    if (!content) return;
    const measure = () => {
      const style = getComputedStyle(content);
      const budget = getPopupBudget(
        { width: content.clientWidth, height: content.clientHeight },
        content.clientWidth < 768,
      );
      const width = Math.min(
        budget.width,
        content.clientWidth -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight) -
          2,
      );
      const height =
        Math.min(
          budget.height,
          content.clientHeight -
            parseFloat(style.paddingTop) -
            parseFloat(style.paddingBottom) -
            2,
        ) -
        (headerRef.current?.offsetHeight ?? 56) -
        (footerRef.current?.offsetHeight ?? 45) -
        (navigationRef.current?.offsetHeight ?? 0) -
        2;
      setAvailable((previous) => {
        const next = {
          width: Math.max(1, width),
          height: Math.max(32, height),
        };
        return previous.width === next.width && previous.height === next.height
          ? previous
          : next;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    [
      content,
      headerRef.current,
      footerRef.current,
      navigationRef.current,
    ].forEach((element) => {
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [contentElement, open, hasNavigation, viewport, page.start, page.end]);

  const closeOne = (id: string) => {
    const index = visible.findIndex((popup) => popup.id === id);
    closeButtonRef.current?.focus();
    if (selectedId === id)
      setActiveId(visible[index + 1]?.id ?? visible[index - 1]?.id);
    setHidden((previous) => new Set(previous).add(id));
  };
  const closeAll = () =>
    setHidden(
      (previous) => new Set([...previous, ...visible.map((popup) => popup.id)]),
    );
  const dismiss = (popup: BannerItem, option: PopupDismissOption) => {
    const record = {
      option,
      expiresAt: Date.now() + POPUP_DISMISS_POLICIES[option].duration,
    };
    try {
      localStorage.setItem(popupStorageKey(popup.id), JSON.stringify(record));
      setDismissals((previous) => ({ ...previous, [popup.id]: record }));
      const index = visible.findIndex((banner) => banner.id === popup.id);
      closeButtonRef.current?.focus();
      if (selectedId === popup.id)
        setActiveId(visible[index + 1]?.id ?? visible[index - 1]?.id);
    } catch (error) {
      reportStorageError(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) closeAll();
      }}
    >
      <DialogPortal>
        <DialogPrimitive.Overlay className="official-popup-overlay bg-brand-dark/60" />
        <DialogPrimitive.Content
          ref={setContentElement}
          className="official-popup-viewport"
          style={{
            width: viewport.width,
            height: viewport.height,
            top: viewport.top,
            left: viewport.left,
          }}
          aria-describedby={undefined}
          onInteractOutside={(event) => event.preventDefault()}
          onOpenAutoFocus={() => {
            if (document.activeElement instanceof HTMLElement)
              restoreFocusRef.current = document.activeElement;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (restoreFocusRef.current?.isConnected)
              restoreFocusRef.current.focus();
          }}
        >
          <div className="official-popup-shell" data-ui="official-popup">
            <div className="official-popup-header" ref={headerRef}>
              <DialogTitle className="text-sm font-semibold tracking-wide text-brand-dark">
                소식안내
              </DialogTitle>
              <button
                ref={closeButtonRef}
                className="official-popup-button rounded-full"
                type="button"
                aria-label="팝업 전체 닫기"
                onClick={closeAll}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="official-popup-row">
              {shown.map((popup, index) => {
                const layout = layouts[page.start + index];
                const image = images[popup.id];
                const status =
                  image?.source === imageSource(popup.imageUrl)
                    ? image.status
                    : undefined;
                let option: PopupDismissOption | undefined;
                try {
                  option = getPopupDismissOption(popup.dismissOption);
                } catch {
                  // Invalid server policy is shown in the card rather than silently defaulted.
                }
                return (
                  <article
                    className="official-popup-card"
                    key={popup.id}
                    style={{ width: layout.width }}
                    aria-label={popup.title}
                  >
                    <div
                      className="official-popup-image"
                      data-scroll={layout.scroll && status === "ready"}
                      style={{ height: imageHeight }}
                      tabIndex={
                        layout.scroll && status === "ready" ? 0 : undefined
                      }
                      role={
                        layout.scroll && status === "ready"
                          ? "region"
                          : undefined
                      }
                      aria-label={
                        layout.scroll && status === "ready"
                          ? `${popup.title} 이미지 스크롤`
                          : undefined
                      }
                    >
                      {status === "ready" ? (
                        <a
                          href={
                            popup.linkUrl ||
                            `/news/banner/view?rqstNo=${encodeURIComponent(popup.id)}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${popup.title} 자세히 보기 (새 탭)`}
                          style={{ width: layout.imageWidth, maxWidth: "100%" }}
                        >
                          <img
                            src={imageSource(popup.imageUrl)}
                            alt={popup.title}
                            width={image.size.width}
                            height={image.size.height}
                            style={{
                              width: "100%",
                              maxWidth: "100%",
                              height: "auto",
                            }}
                            onError={() => {
                              console.error("팝업 이미지 표시 실패", popup.id);
                              setImages((previous) => ({
                                ...previous,
                                [popup.id]: { ...image, status: "error" },
                              }));
                            }}
                          />
                        </a>
                      ) : status === "error" ? (
                        <div
                          role="alert"
                          className="flex flex-col items-center gap-2 p-4 text-center text-sm"
                        >
                          <p className="font-semibold">{popup.title}</p>
                          <p>이미지를 불러오지 못했습니다.</p>
                          <button
                            type="button"
                            className="official-popup-button text-brand-primary"
                            onClick={() => {
                              setImages((previous) => {
                                const next = { ...previous };
                                delete next[popup.id];
                                return next;
                              });
                              setRetry((value) => value + 1);
                            }}
                          >
                            다시 시도
                          </button>
                          <a
                            className="official-popup-button"
                            href={
                              popup.linkUrl ||
                              `/news/banner/view?rqstNo=${encodeURIComponent(popup.id)}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            공지 자세히 보기
                          </a>
                        </div>
                      ) : (
                        <div
                          role="status"
                          className="flex items-center gap-2 p-4 text-sm text-slate-500"
                        >
                          <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
                          이미지 불러오는 중
                        </div>
                      )}
                    </div>
                    {option === undefined && (
                      <p
                        role="alert"
                        className="px-3 py-2 text-xs text-red-700"
                      >
                        팝업 숨김 설정을 확인해주세요.
                      </p>
                    )}
                    <div
                      className="official-popup-footer"
                      ref={index === 0 ? footerRef : undefined}
                    >
                      {option && option !== "NONE" && (
                        <button
                          type="button"
                          className="official-popup-button flex-1 border-r border-slate-200 text-slate-500"
                          onClick={() => dismiss(popup, option)}
                        >
                          {POPUP_DISMISS_POLICIES[option].label}
                        </button>
                      )}
                      <button
                        type="button"
                        className="official-popup-button flex-1"
                        onClick={() => closeOne(popup.id)}
                      >
                        닫기
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            {hasNavigation && (
              <div className="official-popup-navigation" ref={navigationRef}>
                <button
                  type="button"
                  className="official-popup-button"
                  aria-label="이전 공지"
                  disabled={page.start === 0}
                  onClick={() => setActiveId(visible[page.previousStart]?.id)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p
                  role="status"
                  aria-live="polite"
                  className="text-xs text-slate-500"
                >
                  페이지 {page.index + 1} / {page.total}
                </p>
                <button
                  type="button"
                  className="official-popup-button"
                  aria-label="다음 공지"
                  disabled={page.end === visible.length}
                  onClick={() => setActiveId(visible[page.end]?.id)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
