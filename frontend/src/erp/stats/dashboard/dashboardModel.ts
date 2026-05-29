export type StatsDashboardMetricKey = 'totalMembers' | 'newMembers' | 'avgAttendance' | 'totalOffering';

export type StatsDashboardData = Partial<Record<StatsDashboardMetricKey, number>>;

export type StatsDashboardCard = {
    key: StatsDashboardMetricKey;
    label: string;
    accent: string;
};

export const STATS_DASHBOARD_CARDS: StatsDashboardCard[] = [
    { key: 'totalMembers', label: '전체 성도 수', accent: 'border-l-indigo-600' },
    { key: 'newMembers', label: '이번 달 새가족', accent: 'border-l-emerald-600' },
    { key: 'avgAttendance', label: '평균 출석률(%)', accent: 'border-l-amber-600' },
    { key: 'totalOffering', label: '이번 달 헌금', accent: 'border-l-red-600' },
];
