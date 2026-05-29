export type AdminMinutesRow = {
  minuteNo?: string;
  title?: string;
  meetingDate?: string;
  author?: string;
  attendeeCount?: string | number;
  [key: string]: unknown;
};

type AdminMinutesColumn = {
  key: keyof AdminMinutesRow;
  label: string;
};

export const ADMIN_MINUTES_COLUMNS: AdminMinutesColumn[] = [
  { key: 'minuteNo', label: '회의록번호' },
  { key: 'title', label: '회의 제목' },
  { key: 'meetingDate', label: '회의일' },
  { key: 'author', label: '작성자' },
  { key: 'attendeeCount', label: '참석 인원' },
];
