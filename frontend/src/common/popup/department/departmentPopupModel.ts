export type DepartmentReorganization = {
  reorgKey: string;
  reorgDt: string;
  reorgTitle: string | null;
  confYn: "Y" | "N";
  useYn: "Y" | "N";
};

export type DepartmentSelection = { deptCd: string; deptNm: string };
export type PopupDepartment = DepartmentSelection & {
  deptKey: string;
  parentDeptKey: string | null;
  matched: boolean;
};
export type DepartmentPopupQuery = { reorgKey?: string; deptCd?: string; deptNm?: string; exactCode?: boolean };
export type DepartmentPopupResult = {
  reorganization: DepartmentReorganization | null;
  departments: PopupDepartment[];
  matchCount: number;
};
