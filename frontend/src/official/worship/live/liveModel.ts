export type LiveTab = 'videos' | 'shorts' | 'live';

export type LiveItem = {
  tabType?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  cta?: string;
  orderNo?: number;
};
