export type OfficialIndexItem = { id: string; title: string; date: string; };

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