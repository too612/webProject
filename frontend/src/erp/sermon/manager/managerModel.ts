export type SermonManagerRow = {
  title?: string;
  preacher?: string;
  scripture?: string;
  sermonDate?: string;
  [key: string]: unknown;
};

type SermonManagerColumn = {
  key: keyof SermonManagerRow;
  label: string;
};

export const SERMON_MANAGER_COLUMNS: SermonManagerColumn[] = [
  { key: 'title', label: '설교 제목' },
  { key: 'preacher', label: '설교자' },
  { key: 'scripture', label: '본문' },
  { key: 'sermonDate', label: '설교일' },
];
