import type { ExcelRowRef } from "../../../common/excel";
import { erpColumn, type GridColumnDef } from "../../../common/grid";
import { assignmentStatus } from "./personnelmoveStatus";

export type AssignmentScope = "main" | "concurrent";
export type PersonnelMoveRow = {
  excelRef?: ExcelRowRef;
  assignmentKey: string;
  personKey: string;
  employeeNo: string;
  nameKo: string;
  concurrentKey: string | null;
  scope: AssignmentScope;
  assignmentDate: string;
  assignmentOrder: number;
  assignmentTypeCode: string | null;
  deptCd: string;
  gradeCode: string;
  positionCode: string | null;
  employmentTypeCode: string | null;
  jobTitleCode: string | null;
  assignmentContent: string | null;
  assignmentEndDate: string | null;
  dispatchCountryCode: string | null;
  remark: string | null;
  version: number;
  currentEffective: boolean;
  applied: boolean;
  pending: boolean;
  syncPaused: boolean;
};
export type EmployeeOption = {
  personKey: string;
  employeeNo: string;
  nameKo: string;
  deptCd: string | null;
  gradeCode: string | null;
};
export type ConcurrentMaster = EmployeeOption & { concurrentKey: string };
export type AssignmentCodeOption = { code: string; codeName: string };
export type PersonnelMoveOptions = {
  assignmentTypes: AssignmentCodeOption[];
  grades: AssignmentCodeOption[];
  positions: AssignmentCodeOption[];
  employmentTypes: AssignmentCodeOption[];
  jobTitles: AssignmentCodeOption[];
};
export type PersonnelMoveSearch = {
  keyword: string;
  personKey: string;
  concurrentKey: string;
  deptCd: string;
  gradeCode: string;
  assignmentTypeCode: string;
  assignmentDateFrom: string;
  assignmentDateTo: string;
};
export type PersonnelMoveForm = {
  personKey: string;
  concurrentKey: string;
  assignmentDate: string;
  assignmentOrder: string;
  assignmentTypeCode: string;
  deptCd: string;
  gradeCode: string;
  positionCode: string;
  employmentTypeCode: string;
  jobTitleCode: string;
  assignmentContent: string;
  assignmentEndDate: string;
  dispatchCountryCode: string;
  remark: string;
  historicalEdit: boolean;
  historicalReason: string;
};
export type PersonnelMoveRequest = Omit<PersonnelMoveForm,
  "assignmentOrder" | "concurrentKey" | "assignmentTypeCode" | "positionCode" |
  "employmentTypeCode" | "jobTitleCode" | "assignmentEndDate" | "dispatchCountryCode"> & {
  scope: AssignmentScope;
  assignmentOrder: number;
  concurrentKey: string | null;
  assignmentTypeCode: string | null;
  positionCode: string | null;
  employmentTypeCode: string | null;
  jobTitleCode: string | null;
  assignmentEndDate: string | null;
  dispatchCountryCode: string | null;
  version?: number;
};
export const EMPTY_SEARCH: PersonnelMoveSearch = {
  keyword: "", personKey: "", concurrentKey: "", deptCd: "", gradeCode: "",
  assignmentTypeCode: "", assignmentDateFrom: "", assignmentDateTo: "",
};
export const EMPTY_FORM: PersonnelMoveForm = {
  personKey: "", concurrentKey: "", assignmentDate: "", assignmentOrder: "1",
  assignmentTypeCode: "", deptCd: "", gradeCode: "", positionCode: "",
  employmentTypeCode: "", jobTitleCode: "", assignmentContent: "",
  assignmentEndDate: "", dispatchCountryCode: "", remark: "",
  historicalEdit: false, historicalReason: "",
};
export const EMPTY_OPTIONS: PersonnelMoveOptions = {
  assignmentTypes: [], grades: [], positions: [], employmentTypes: [], jobTitles: [],
};
export const assignmentKey = (row: PersonnelMoveRow) => row.assignmentKey;
export const MOBILE_HIDDEN_COLUMNS = [
  "assignmentOrder", "deptCd", "gradeCode", "positionCode", "employmentTypeCode",
  "jobTitleCode", "assignmentTypeCode", "applied", "detail",
];
export const PERSONNELMOVE_COLUMNS: GridColumnDef<PersonnelMoveRow>[] = [
  erpColumn("name", { field: "nameKo", headerName: "성명", minWidth: 110 }),
  erpColumn("code", { field: "employeeNo", headerName: "사번", minWidth: 120 }),
  erpColumn("date", { field: "assignmentDate", headerName: "발령일", minWidth: 120 }),
  erpColumn("number", { field: "assignmentOrder", headerName: "발령 순서", minWidth: 95 }),
  erpColumn("code", { field: "assignmentTypeCode", headerName: "발령 종류", minWidth: 110 }),
  erpColumn("code", { field: "deptCd", headerName: "부서 코드", minWidth: 120 }),
  erpColumn("code", { field: "gradeCode", headerName: "직급", minWidth: 100 }),
  erpColumn("code", { field: "positionCode", headerName: "직위", minWidth: 100, sortable: false }),
  erpColumn("code", { field: "employmentTypeCode", headerName: "고용형태", minWidth: 110, sortable: false }),
  erpColumn("code", { field: "jobTitleCode", headerName: "직책", minWidth: 100, sortable: false }),
  erpColumn("status", { field: "applied", headerName: "반영 상태", minWidth: 110, sortable: false,
    valueFormatter: ({ data }) => data ? assignmentStatus(data) : "-" }),
];
