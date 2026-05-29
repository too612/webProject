export type CommNewsletterRow = {
  title?: string;
  period?: string;
  publishedAt?: string;
  viewCount?: string | number;
  [key: string]: unknown;
};

type CommNewsletterColumn = {
  key: keyof CommNewsletterRow;
  label: string;
};

export const COMM_NEWSLETTER_COLUMNS: CommNewsletterColumn[] = [
  { key: 'title', label: '소식지 제목' },
  { key: 'period', label: '발행기간' },
  { key: 'publishedAt', label: '발행일' },
  { key: 'viewCount', label: '조회수' },
];
