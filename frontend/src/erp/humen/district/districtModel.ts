export type DistrictRow = {
  districtName?: string;
  leaderName?: string;
  memberCount?: number | string;
  meetingDay?: string;
  [key: string]: unknown;
};

type DistrictColumn = {
  key: keyof DistrictRow;
  label: string;
};

export const DISTRICT_COLUMNS: DistrictColumn[] = [
  { key: 'districtName', label: '구역명' },
  { key: 'leaderName', label: '구역장' },
  { key: 'memberCount', label: '인원수' },
  { key: 'meetingDay', label: '모임요일' },
];
