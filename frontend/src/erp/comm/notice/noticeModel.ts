export type CommNoticeRow = {
  title?: string;
  author?: string;
  createdAt?: string;
  viewCount?: string | number;
  [key: string]: unknown;
};

type CommNoticeColumn = {
  key: keyof CommNoticeRow;
  label: string;
};

export const COMM_NOTICE_COLUMNS: CommNoticeColumn[] = [
  { key: 'title', label: '제목' },
  { key: 'author', label: '작성자' },
  { key: 'createdAt', label: '작성일' },
  { key: 'viewCount', label: '조회수' },
];
