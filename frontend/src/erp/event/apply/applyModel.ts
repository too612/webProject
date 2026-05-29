export type EventApplyRow = {
  eventName?: string;
  applicantName?: string;
  applyDate?: string;
  status?: string;
  [key: string]: unknown;
};

type EventApplyColumn = {
  key: keyof EventApplyRow;
  label: string;
};

export const EVENT_APPLY_COLUMNS: EventApplyColumn[] = [
  { key: 'eventName', label: '행사명' },
  { key: 'applicantName', label: '신청자' },
  { key: 'applyDate', label: '신청일' },
  { key: 'status', label: '상태' },
];