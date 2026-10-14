import type { CodeOption } from "../../ui/CodeSelect";
import { erpColumn, type GridColumnDef } from "../../grid";

export type EmployeeSelection = {
  personKey: string;
  employeeNo: string;
  nameKo: string;
  deptCd: string | null;
  gradeCode: string | null;
};
export type PopupEmployee = EmployeeSelection & {
  deptName: string | null;
  gradeName: string | null;
  positionCode: string | null;
  positionName: string | null;
  serviceStatusCode: string | null;
  serviceStatusName: string | null;
};
export type EmployeeDepartment = {
  deptKey: string;
  parentDeptKey: string | null;
  deptCd: string;
  deptNm: string;
};
export type EmployeePopupContext = {
  reorganization: { reorgKey: string; reorgDt: string };
  departments: EmployeeDepartment[];
  grades: CodeOption[];
  positions: CodeOption[];
  serviceStatuses: CodeOption[];
};
export type EmployeePopupSearch = {
  nameKo: string;
  employeeNo: string;
  deptName: string;
  deptCd: string;
  gradeCode: string;
  positionCode: string;
  serviceStatusCode: string;
};
export type EmployeePopupQuery = Partial<EmployeePopupSearch> & {
  reorgKey?: string;
  personKey?: string;
  page?: number;
  size?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
};
export type EmployeePopupResult = {
  content: PopupEmployee[];
  totalElements: number;
  number: number;
  size: number;
};
export const ACTIVE_SERVICE_STATUS = "101-010";
export const EMPTY_EMPLOYEE_SEARCH: EmployeePopupSearch = {
  nameKo: "", employeeNo: "", deptName: "", deptCd: "",
  gradeCode: "", positionCode: "", serviceStatusCode: "",
};
export const EMPLOYEE_COLUMNS: GridColumnDef<PopupEmployee>[] = [
  erpColumn("name", { field: "nameKo", headerName: "성명", minWidth: 110 }),
  erpColumn("code", { field: "employeeNo", headerName: "사번", minWidth: 120 }),
  erpColumn("name", { field: "deptName", headerName: "부서명", minWidth: 160 }),
  erpColumn("code", { field: "gradeName", headerName: "직급", minWidth: 100 }),
  erpColumn("code", { field: "positionName", headerName: "직위", minWidth: 100 }),
  erpColumn("status", { field: "serviceStatusName", headerName: "재직구분", minWidth: 110 }),
];
export const EMPLOYEE_MOBILE_HIDDEN_COLUMNS = ["deptName", "gradeName", "positionName", "serviceStatusName"];
export const employeeKey = (employee: EmployeeSelection) => employee.personKey;
export function normalizeEmployeeSearch(query: EmployeePopupSearch): EmployeePopupSearch {
  return { ...query, nameKo: query.nameKo.trim(), employeeNo: query.employeeNo.trim(), deptName: query.deptName.trim() };
}
export function equalEmployeeSearch(left: EmployeePopupSearch, right: EmployeePopupSearch) {
  return JSON.stringify(normalizeEmployeeSearch(left)) === JSON.stringify(normalizeEmployeeSearch(right));
}
