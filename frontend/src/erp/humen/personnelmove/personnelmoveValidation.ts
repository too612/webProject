import { isIsoDate, type FieldErrors } from "../../../common/ui/form/formValidation";
import {
  EMPTY_FORM, type AssignmentScope, type PersonnelMoveForm, type PersonnelMoveRequest,
  type PersonnelMoveRow, type PersonnelMoveSearch,
} from "./personnelmoveModel";
import { todayLocal } from "./personnelmoveStatus";

export function isHistorical(row: PersonnelMoveRow | null, date = todayLocal()) {
  return Boolean(row && row.assignmentDate < date);
}
export function equalSearch(a: PersonnelMoveSearch, b: PersonnelMoveSearch) {
  return Object.keys(a).every((key) => a[key as keyof PersonnelMoveSearch] === b[key as keyof PersonnelMoveSearch]);
}
export function validateSearch(query: PersonnelMoveSearch): FieldErrors<PersonnelMoveSearch> {
  const errors: FieldErrors<PersonnelMoveSearch> = {};
  if (query.assignmentDateFrom && !isIsoDate(query.assignmentDateFrom)) errors.assignmentDateFrom = "올바른 시작일을 입력하세요.";
  if (query.assignmentDateTo && !isIsoDate(query.assignmentDateTo)) errors.assignmentDateTo = "올바른 종료일을 입력하세요.";
  if (!errors.assignmentDateFrom && !errors.assignmentDateTo &&
    query.assignmentDateFrom && query.assignmentDateTo && query.assignmentDateFrom > query.assignmentDateTo) {
    errors.assignmentDateTo = "종료일은 시작일 이후여야 합니다.";
  }
  return errors;
}
export function validateAssignment(form: PersonnelMoveForm, scope: AssignmentScope, original: PersonnelMoveRow | null,
  today = todayLocal()): FieldErrors<PersonnelMoveForm> {
  const errors: FieldErrors<PersonnelMoveForm> = {};
  if (!form.personKey) errors.personKey = "대상 인사를 선택하세요.";
  if (scope === "concurrent" && !form.concurrentKey) errors.concurrentKey = "겸임 인사를 선택하세요.";
  if (!isIsoDate(form.assignmentDate)) errors.assignmentDate = "올바른 발령일을 입력하세요.";
  if (!/^[1-9]\d*$/.test(form.assignmentOrder) || Number(form.assignmentOrder) > 2147483647) {
    errors.assignmentOrder = "발령 순서는 1 이상의 정수여야 합니다.";
  }
  if (!form.deptCd.trim()) errors.deptCd = "부서 코드를 입력하세요.";
  if (form.deptCd.trim().length > 30) errors.deptCd = "부서 코드는 30자 이내로 입력하세요.";
  if (!form.gradeCode) errors.gradeCode = "직급을 선택하세요.";
  if (!form.assignmentTypeCode) errors.assignmentTypeCode = "발령 종류를 선택하세요.";
  if (form.assignmentEndDate && (!isIsoDate(form.assignmentEndDate) || form.assignmentEndDate < form.assignmentDate)) {
    errors.assignmentEndDate = "종료일은 발령일 이후의 올바른 날짜여야 합니다.";
  }
  if (isHistorical(original, today)) {
    if (!form.historicalEdit) errors.historicalEdit = "과거 이력 편집을 명시적으로 허용하세요.";
    if (!form.historicalReason.trim()) errors.historicalReason = "과거 이력 편집 사유를 입력하세요.";
    if (original && !original.currentEffective) {
      if (form.assignmentDate !== original.assignmentDate) errors.assignmentDate = "과거 비유효 이력의 발령일은 변경할 수 없습니다.";
      if (Number(form.assignmentOrder) !== original.assignmentOrder) errors.assignmentOrder = "과거 비유효 이력의 순서는 변경할 수 없습니다.";
    }
  }
  if (form.historicalReason.length > 4000) errors.historicalReason = "편집 사유는 4,000자 이내로 입력하세요.";
  if (form.assignmentContent.length > 20000) errors.assignmentContent = "발령 내용은 20,000자 이내로 입력하세요.";
  if (form.remark.length > 4000) errors.remark = "비고는 4,000자 이내로 입력하세요.";
  return errors;
}
export function formFromRow(row: PersonnelMoveRow): PersonnelMoveForm {
  return {
    ...EMPTY_FORM, personKey: row.personKey, concurrentKey: row.concurrentKey ?? "",
    assignmentDate: row.assignmentDate, assignmentOrder: String(row.assignmentOrder),
    assignmentTypeCode: row.assignmentTypeCode ?? "", deptCd: row.deptCd, gradeCode: row.gradeCode,
    positionCode: row.positionCode ?? "", employmentTypeCode: row.employmentTypeCode ?? "",
    jobTitleCode: row.jobTitleCode ?? "", assignmentContent: row.assignmentContent ?? "",
    assignmentEndDate: row.assignmentEndDate ?? "", dispatchCountryCode: row.dispatchCountryCode ?? "",
    remark: row.remark ?? "",
  };
}
export function normalizeAssignment(form: PersonnelMoveForm, scope: AssignmentScope, original: PersonnelMoveRow | null): PersonnelMoveRequest {
  const nullable = (value: string) => value.trim() || null;
  return {
    ...form, scope, assignmentOrder: Number(form.assignmentOrder),
    concurrentKey: scope === "concurrent" ? nullable(form.concurrentKey) : null,
    assignmentTypeCode: nullable(form.assignmentTypeCode), deptCd: form.deptCd.trim(),
    positionCode: nullable(form.positionCode), employmentTypeCode: nullable(form.employmentTypeCode),
    jobTitleCode: nullable(form.jobTitleCode), assignmentEndDate: nullable(form.assignmentEndDate),
    dispatchCountryCode: nullable(form.dispatchCountryCode), historicalReason: form.historicalReason.trim(),
    ...(original ? { version: original.version } : {}),
  };
}
