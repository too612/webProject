import {
  maxTextLength, optionalDate, requiredText, validateForm,
  type FormRules,
} from "../../../common/ui/form/formValidation";
import type { ManagerCreateRequest, ManagerFilters } from "./managerModel";

export type ManagerSearch = ManagerFilters & { keyword: string };

const CREATE_RULES: FormRules<ManagerCreateRequest> = {
  employeeNo: [requiredText("사번"), maxTextLength("사번", 30)],
  nameKo: [requiredText("성명"), maxTextLength("성명", 100)],
  nameEn: [maxTextLength("영문 성명", 100)],
  birthDate: [optionalDate("생년월일")],
  hireDate: [optionalDate("입사일")],
  serviceStatusCode: [requiredText("재직 상태")],
};

export function validateManagerCreate(values: ManagerCreateRequest) {
  return validateForm(values, CREATE_RULES);
}

export function normalizeManagerCreate(values: ManagerCreateRequest): ManagerCreateRequest {
  return {
    ...values,
    employeeNo: values.employeeNo.trim(),
    nameKo: values.nameKo.trim(),
    nameEn: values.nameEn?.trim() || undefined,
    deptCd: values.deptCd || undefined,
    gradeCode: values.gradeCode || undefined,
    positionCode: values.positionCode || undefined,
    employmentTypeCode: values.employmentTypeCode || undefined,
    hireDate: values.hireDate || undefined,
    birthDate: values.birthDate || undefined,
  };
}

export function equalManagerSearch(draft: ManagerSearch, applied: ManagerSearch) {
  return draft.keyword.trim() === applied.keyword.trim() &&
    draft.deptCd === applied.deptCd &&
    draft.gradeCode === applied.gradeCode &&
    draft.positionCode === applied.positionCode &&
    draft.employmentTypeCode === applied.employmentTypeCode &&
    draft.serviceStatusCode === applied.serviceStatusCode;
}

export function hasManagerSearch(query: ManagerSearch) {
  return Object.values(query).some((value) => value.trim().length > 0);
}
