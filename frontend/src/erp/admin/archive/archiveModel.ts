export type AdminArchiveRow = {
  docId?: string;
  title?: string;
  category?: string;
  registeredAt?: string;
  registeredBy?: string;
  [key: string]: unknown;
};

type AdminArchiveColumn = {
  key: keyof AdminArchiveRow;
  label: string;
};

export const ADMIN_ARCHIVE_COLUMNS: AdminArchiveColumn[] = [
  { key: 'docId', label: '문서 ID' },
  { key: 'title', label: '문서 제목' },
  { key: 'category', label: '분류' },
  { key: 'registeredAt', label: '등록일' },
  { key: 'registeredBy', label: '등록자' },
];
