export type StatsMinistryRow = {
  ministryName: string;
  memberCount: number;
  activityCount: number;
  volunteerCount: number;
};

export const STATS_MINISTRY_COLUMNS = [
  { key: 'ministryName', label: '사역부서' },
  { key: 'memberCount', label: '인원 수' },
  { key: 'activityCount', label: '활동 횟수' },
  { key: 'volunteerCount', label: '봉사자 수' },
];
