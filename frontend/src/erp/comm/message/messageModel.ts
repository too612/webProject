export type CommMessageRow = {
  title?: string;
  recipient?: string;
  sentAt?: string;
  status?: string;
  [key: string]: unknown;
};

type CommMessageColumn = {
  key: keyof CommMessageRow;
  label: string;
};

export const COMM_MESSAGE_COLUMNS: CommMessageColumn[] = [
  { key: 'title', label: '제목' },
  { key: 'recipient', label: '수신자' },
  { key: 'sentAt', label: '발송일시' },
  { key: 'status', label: '상태' },
];
