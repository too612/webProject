export type ErpMonthlyRegistration = {
  month: string;
  count: number;
};

export type ErpMemberCategory = {
  code: string;
  label: string;
  count: number;
};

export type ErpDepartmentStaff = {
  departmentCode: string;
  department: string;
  staffCount: number;
};

export type ErpIndexData = {
  totalMembers: number;
  activeMemberCount: number;
  newMemberCount: number;
  departmentCount: number;
  monthlyRegistrations: ErpMonthlyRegistration[];
  serviceStatusDistribution: ErpMemberCategory[];
  employmentDistribution: ErpMemberCategory[];
  departmentStaff: ErpDepartmentStaff[];
};

export type ErpShortcut = {
  label: string;
  to: string;
};

export const ERP_INDEX_SHORTCUTS: ErpShortcut[] = [
  { label: '통계 대시보드', to: '/erp/stats/dashboard' },
  { label: '회계 보고서', to: '/erp/account/report' },
  { label: '메시지', to: '/erp/comm/message' },
  { label: '행사 캘린더', to: '/erp/event/calendar' },
  { label: '설교 작성', to: '/erp/sermon/write' },
  { label: '사역 보고', to: '/erp/ministry/report' },
];

export const EMPTY_ERP_INDEX_DATA: ErpIndexData = {
  totalMembers: 0,
  activeMemberCount: 0,
  newMemberCount: 0,
  departmentCount: 0,
  monthlyRegistrations: [],
  serviceStatusDistribution: [],
  employmentDistribution: [],
  departmentStaff: [],
};
