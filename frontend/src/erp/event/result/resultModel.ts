export type EventResultRow = {
  title?: string;
  eventDate?: string;
  applicantCount?: number | string;
  organizer?: string;
  status?: string;
  [key: string]: unknown;
};

type EventResultColumn = {
  key: keyof EventResultRow;
  label: string;
};

export const EVENT_RESULT_COLUMNS: EventResultColumn[] = [
  { key: 'title', label: '행사명' },
  { key: 'eventDate', label: '행사일' },
  { key: 'applicantCount', label: '참가인원' },
  { key: 'organizer', label: '담당자' },
  { key: 'status', label: '상태' },
];
