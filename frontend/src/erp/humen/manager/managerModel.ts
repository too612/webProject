import type { GridColumnDef } from "../../../common/grid";

export type ManagerRow = {
  personKey: string;
  employeeNo: string;
  nameKo: string;
  nameEn?: string | null;
  profilePhotoUrl?: string | null;
  deptCd?: string | null;
  deptName?: string | null;
  gradeCode?: string | null;
  gradeName?: string | null;
  positionCode?: string | null;
  positionName?: string | null;
  employmentTypeCode?: string | null;
  employmentTypeName?: string | null;
  serviceStatusCode?: string | null;
  serviceStatusName?: string | null;
  hireDate?: string | null;
};

export type ManagerCareer = {
  careerKey: string;
  companyName: string;
  jobTitle?: string | null;
  jobResponsibility?: string | null;
  hireDate: string;
  retireDate?: string | null;
  employmentTypeName?: string | null;
  remark?: string | null;
};

export type ManagerAssignment = {
  assignmentKey: string;
  assignmentDate: string;
  assignmentEndDate?: string | null;
  assignmentTypeName?: string | null;
  deptName?: string | null;
  gradeName?: string | null;
  positionName?: string | null;
  jobTitleName?: string | null;
  assignmentContent?: string | null;
  concurrentAssignmentYn?: string | null;
  remark?: string | null;
};

export const CAREER_COLUMNS: GridColumnDef[] = [
  {
    headerName: "기관명",
    field: "companyName",
    minWidth: 150,
    tooltipField: "companyName",
  },
  { headerName: "직책", field: "jobTitle", minWidth: 110 },
  { headerName: "고용형태", field: "employmentTypeName", minWidth: 110 },
  { headerName: "입사일", field: "hireDate", minWidth: 115 },
  { headerName: "퇴직일", field: "retireDate", minWidth: 115 },
  {
    headerName: "담당업무",
    field: "jobResponsibility",
    minWidth: 220,
    tooltipField: "jobResponsibility",
    wrapText: true,
    autoHeight: true,
  },
  {
    headerName: "비고",
    field: "remark",
    minWidth: 180,
    tooltipField: "remark",
    wrapText: true,
    autoHeight: true,
  },
];

export const ASSIGNMENT_COLUMNS: GridColumnDef[] = [
  { headerName: "발령일", field: "assignmentDate", minWidth: 115 },
  { headerName: "발령 종류", field: "assignmentTypeName", minWidth: 120 },
  { headerName: "소속 부서", field: "deptName", minWidth: 140 },
  { headerName: "직급", field: "gradeName", minWidth: 110 },
  { headerName: "직위", field: "positionName", minWidth: 110 },
  { headerName: "직책", field: "jobTitleName", minWidth: 110 },
  { headerName: "종료일", field: "assignmentEndDate", minWidth: 115 },
  {
    headerName: "겸임",
    field: "concurrentAssignmentYn",
    width: 80,
    valueFormatter: (params) => (params.value === "Y" ? "예" : "아니오"),
  },
  {
    headerName: "발령 내용",
    field: "assignmentContent",
    minWidth: 240,
    tooltipField: "assignmentContent",
    wrapText: true,
    autoHeight: true,
  },
  {
    headerName: "비고",
    field: "remark",
    minWidth: 180,
    tooltipField: "remark",
    wrapText: true,
    autoHeight: true,
  },
];

export type ManagerPersonDetail = ManagerRow & {
  nameHanja?: string | null;
  birthDate?: string | null;
  genderCode?: string | null;
  postalCode?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  retireDate?: string | null;
  promotionDate?: string | null;
  photoUrl?: string | null;
  aiSummary?: string | null;
  careers: ManagerCareer[];
  assignments: ManagerAssignment[];
};

export type ManagerCodeOption = {
  code: string;
  name: string;
};

export type ManagerFilterOptions = {
  departments: ManagerCodeOption[];
  grades: ManagerCodeOption[];
  positions: ManagerCodeOption[];
  employmentTypes: ManagerCodeOption[];
  serviceStatuses: ManagerCodeOption[];
};

export type ManagerFilters = {
  deptCd: string;
  gradeCode: string;
  positionCode: string;
  employmentTypeCode: string;
  serviceStatusCode: string;
};

export type ManagerCreateRequest = {
  employeeNo: string;
  nameKo: string;
  nameEn?: string;
  nameHanja?: string;
  deptCd?: string;
  gradeCode?: string;
  positionCode?: string;
  employmentTypeCode?: string;
  serviceStatusCode: string;
  genderCode?: string;
  birthDate?: string;
  hireDate?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
};
