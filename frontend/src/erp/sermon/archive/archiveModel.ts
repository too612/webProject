export type SermonArchiveRow = {
  title?: string;
  preacher?: string;
  mediaType?: string;
  uploadDate?: string;
  viewCount?: number | string;
  [key: string]: unknown;
};

type SermonArchiveColumn = {
  key: keyof SermonArchiveRow;
  label: string;
};

export const SERMON_ARCHIVE_COLUMNS: SermonArchiveColumn[] = [
  { key: 'title', label: '설교 제목' },
  { key: 'preacher', label: '설교자' },
  { key: 'mediaType', label: '미디어유형' },
  { key: 'uploadDate', label: '업로드일' },
  { key: 'viewCount', label: '조회수' },
];
