export type CommPrayerRow = {
  requester?: string;
  content?: string;
  createdAt?: string;
  status?: string;
  [key: string]: unknown;
};

type CommPrayerColumn = {
  key: keyof CommPrayerRow;
  label: string;
};

export const COMM_PRAYER_COLUMNS: CommPrayerColumn[] = [
  { key: 'requester', label: '신청자' },
  { key: 'content', label: '기도 내용' },
  { key: 'createdAt', label: '신청일' },
  { key: 'status', label: '상태' },
];
