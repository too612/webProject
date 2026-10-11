export type OrganizationReorg = {
  reorgKey: string;
  reorgDt: string;
  confYn: "Y" | "N";
  useYn: "Y" | "N";
  reorgTitle?: string;
  remark?: string;
  departmentCount: number;
};

export type OrganizationDepartment = {
  deptKey: string;
  reorgKey: string;
  deptCd: string;
  deptNm: string;
  engDeptNm?: string;
  parentDeptKey?: string | null;
  deptLevel: number;
  sortOrder: number;
  changeTypeCd: string;
  chefEmpNo?: string;
  chefName?: string;
  deptSysCd: string;
  useYn: "Y" | "N";
  remark?: string;
  memberCount: number;
};

export type OrganizationHistory = {
  deptHistKey: string;
  orgDeptCd: string;
  chgDeptCd: string;
  changeTypeCd: string;
  changeNote?: string;
  regDtm: string;
};

export type OrganizationDetail = OrganizationReorg & {
  departments: OrganizationDepartment[];
  histories: OrganizationHistory[];
};
