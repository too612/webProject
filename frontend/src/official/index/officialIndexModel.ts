export type OfficialIndexItem = {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
  contentHtml?: string;
};

export type BannerItem = {
  id: string; title: string; imageUrl: string;
  linkUrl?: string; startDt?: string; endDt?: string; dismissOption?: string;
};

export type GalleryItem = {
  id: string; title: string; imageUrl: string; date: string;
  contentHtml?: string;
};

export type OfficialIndexData = {
  recentAnnouncements: OfficialIndexItem[];
  slideBanners: BannerItem[];
  popupBanners: BannerItem[];
  recentBulletins: OfficialIndexItem[];
  recentGalleries: GalleryItem[];
};

export var EMPTY_OFFICIAL_INDEX_DATA: OfficialIndexData = {
  recentAnnouncements: [], slideBanners: [], popupBanners: [], recentBulletins: [], recentGalleries: [],
};

// 공식 홈 팝업의 기간 숨김 정책과 저장 데이터.
export type PopupDismissOption = "NONE" | "HOURS_4" | "DAY" | "WEEK";
export type PopupDismissal = { option: PopupDismissOption; expiresAt: number };

export const POPUP_DISMISS_POLICIES = {
  NONE: { label: "", duration: 0 },
  HOURS_4: { label: "4시간 안보기", duration: 4 * 60 * 60 * 1000 },
  DAY: { label: "하루 안보기", duration: 24 * 60 * 60 * 1000 },
  WEEK: { label: "일주일 안보기", duration: 7 * 24 * 60 * 60 * 1000 },
} satisfies Record<PopupDismissOption, { label: string; duration: number }>;

export function getPopupDismissOption(value?: string): PopupDismissOption {
  if (value === undefined || value === null || value === "") return "DAY";
  if (value === "NONE" || value === "HOURS_4" || value === "DAY" || value === "WEEK") {
    return value;
  }
  throw new Error(`지원하지 않는 팝업 숨김 설정: ${value}`);
}

export function popupStorageKey(id: string): string {
  return `official-popup-dismiss:${id}`;
}

export function parsePopupDismissal(
  raw: string,
): PopupDismissal {
  const value: unknown = JSON.parse(raw);
  if (
    typeof value !== "object" || value === null ||
    !("option" in value) || !("expiresAt" in value) ||
    typeof value.option !== "string" ||
    typeof value.expiresAt !== "number" || !Number.isFinite(value.expiresAt) ||
    value.expiresAt <= 0
  ) {
    throw new Error("팝업 숨김 저장 데이터가 올바르지 않습니다.");
  }
  const option = getPopupDismissOption(value.option);
  if (option === "NONE" || option !== value.option) {
    throw new Error("팝업 숨김 저장 정책이 올바르지 않습니다.");
  }
  return { option, expiresAt: value.expiresAt };
}

export function isPopupDismissed(
  banner: BannerItem,
  record: PopupDismissal | undefined,
  now: number,
): boolean {
  return Boolean(
    record && banner.dismissOption !== "NONE" &&
    record.option === (banner.dismissOption || "DAY") && record.expiresAt > now,
  );
}

export function isPopupInPeriod(banner: BannerItem, now: number): boolean {
  const start = banner.startDt ? Date.parse(banner.startDt) : NaN;
  const end = banner.endDt ? Date.parse(banner.endDt) : NaN;
  return (Number.isNaN(start) || now >= start) && (Number.isNaN(end) || now <= end);
}

// DOM 측정 없이 입력 크기로 계산하는 공식 홈 팝업 레이아웃.
export type PopupImageSize = { width: number; height: number };
export type PopupLayout = {
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
  scroll: boolean;
};

export function getPopupBudget(viewport: PopupImageSize, mobile: boolean): PopupImageSize {
  return {
    width: Math.max(1, Math.min(viewport.width - 34, mobile ? Math.min(320, viewport.width * 0.86) : 656)),
    height: Math.max(1, Math.min(viewport.height - 34, viewport.height * 0.78, mobile ? 600 : 640)),
  };
}

export function getPopupLayout(
  image: PopupImageSize,
  available: PopupImageSize,
  mobile: boolean,
): PopupLayout {
  if (
    ![image.width, image.height, available.width, available.height]
      .every((value) => Number.isFinite(value) && value > 0)
  ) {
    throw new Error("팝업 이미지와 화면 크기는 양수여야 합니다.");
  }
  const ratio = image.width / image.height;
  const maxWidth = Math.min(available.width, 320);
  const minWidth = Math.min(240, maxWidth);
  const fitWidth = Math.min(maxWidth, available.height * ratio);
  const scroll = !mobile && fitWidth < minWidth;
  const imageWidth = scroll ? minWidth : fitWidth;
  const imageHeight = imageWidth / ratio;
  return {
    width: Math.max(minWidth, imageWidth),
    height: Math.min(imageHeight, available.height),
    imageWidth,
    imageHeight,
    scroll,
  };
}

export function getPopupPage(
  widths: number[],
  activeIndex: number,
  availableWidth: number,
  mobile: boolean,
): { start: number; end: number; index: number; total: number; previousStart: number } {
  if (widths.length === 0) return { start: 0, end: 0, index: 0, total: 0, previousStart: 0 };
  const selected = Math.max(0, Math.min(activeIndex, widths.length - 1));
  const pages: Array<{ start: number; end: number }> = [];
  for (let start = 0; start < widths.length;) {
    let end = start + 1;
    if (!mobile && end < widths.length && widths[start] + 16 + widths[end] <= availableWidth) {
      end++;
    }
    pages.push({ start, end });
    start = end;
  }
  const index = pages.findIndex((page) => selected >= page.start && selected < page.end);
  return { ...pages[index], index, total: pages.length, previousStart: pages[Math.max(0, index - 1)].start };
}