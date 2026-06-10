export type LiveTab = 'sunday_day' | 'sunday_evening' | 'friday' | 'live';

export type LiveItem = {
  tabType?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  cta?: string;
  thumbnailUrl?: string;
  videoId?: string;
  orderNo?: number;
};
