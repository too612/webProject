export type AdminCertificateRow = {
  certNo?: string;
  memberName?: string;
  certType?: string;
  issuedAt?: string;
  status?: string;
  [key: string]: unknown;
};

type AdminCertificateColumn = {
  key: keyof AdminCertificateRow;
  label: string;
};

export const ADMIN_CERTIFICATE_COLUMNS: AdminCertificateColumn[] = [
  { key: 'certNo', label: '증명서번호' },
  { key: 'memberName', label: '성도명' },
  { key: 'certType', label: '종류' },
  { key: 'issuedAt', label: '발급일' },
  { key: 'status', label: '상태' },
];
