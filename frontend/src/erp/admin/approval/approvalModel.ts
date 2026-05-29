export type AdminApprovalRow = {
  docNo?: string;
  title?: string;
  requester?: string;
  approver?: string;
  status?: string;
  requestedAt?: string;
  [key: string]: unknown;
};

type AdminApprovalColumn = {
  key: keyof AdminApprovalRow;
  label: string;
};

export const ADMIN_APPROVAL_COLUMNS: AdminApprovalColumn[] = [
  { key: 'docNo', label: '문서번호' },
  { key: 'title', label: '제목' },
  { key: 'requester', label: '기안자' },
  { key: 'approver', label: '결재자' },
  { key: 'status', label: '결재상태' },
  { key: 'requestedAt', label: '기안일' },
];
