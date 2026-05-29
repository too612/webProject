export type StatsOfferingRow = {
  month: string;
  tithe: number;
  mission: number;
  special: number;
  other: number;
  total: number;
};

export const STATS_OFFERING_COLUMNS = [
  { key: 'month', label: '월' },
  { key: 'tithe', label: '십일조' },
  { key: 'mission', label: '선교헌금' },
  { key: 'special', label: '특별헌금' },
  { key: 'other', label: '기타' },
  { key: 'total', label: '합계' },
];
