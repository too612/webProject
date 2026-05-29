export type OfficialIndexItem = {
  id: string;
  title: string;
  date: string;
};

export type OfficialIndexData = {
  recentSermons: OfficialIndexItem[];
  recentAnnouncements: OfficialIndexItem[];
};

export const EMPTY_OFFICIAL_INDEX_DATA: OfficialIndexData = {
  recentSermons: [],
  recentAnnouncements: [],
};
