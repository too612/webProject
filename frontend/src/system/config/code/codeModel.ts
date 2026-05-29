export type SystemConfigCodeRow = {
  groupCode?: string;
  groupName?: string;
  codeValue?: string;
  codeName?: string;
  orderNo?: number;
  [key: string]: unknown;
};

type SystemConfigCodeColumn = {
  key: keyof SystemConfigCodeRow | 'actions';
  label: string;
};

export const SYSTEM_CONFIG_CODE_COLUMNS: SystemConfigCodeColumn[] = [
  { key: 'groupCode', label: '그룹코드' },
  { key: 'groupName', label: '그룹명' },
  { key: 'codeValue', label: '코드값' },
  { key: 'codeName', label: '코드명' },
  { key: 'orderNo', label: '순서' },
  { key: 'actions', label: '관리' },
];
