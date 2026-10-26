import {
  maxTextLength, optionalDate, requiredText, validateForm,
  type FormRules,
} from "../../../common/ui/form/formValidation";
import {
  PROFILE_PHOTO_MAX_SIZE,
  type ManagerBasicInfoRequest,
  type ManagerCreateRequest,
  type ManagerFilters,
  type ManagerPersonDetail,
} from "./managerModel";

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

function localToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

const BASIC_INFO_RULES: FormRules<ManagerBasicInfoRequest> = {
  nameKo: [requiredText("성명"), maxTextLength("성명", 100)],
  nameEn: [maxTextLength("영문 성명", 100)],
  nameHanja: [maxTextLength("한자 성명", 100)],
  birthDate: [optionalDate("생년월일"),
    (value) => value && value > localToday() ? "생년월일은 미래일 수 없습니다." : undefined],
  postalCode: [maxTextLength("우편번호", 10)],
  addressLine1: [maxTextLength("주소", 255)],
  addressLine2: [maxTextLength("상세 주소", 255)],
};

export function toManagerBasicInfo(person: ManagerPersonDetail): ManagerBasicInfoRequest {
  return {
    nameKo: person.nameKo ?? "",
    nameEn: person.nameEn ?? "",
    nameHanja: person.nameHanja ?? "",
    birthDate: person.birthDate?.slice(0, 10) ?? "",
    genderCode: person.genderCode ?? "",
    postalCode: person.postalCode ?? "",
    addressLine1: person.addressLine1 ?? "",
    addressLine2: person.addressLine2 ?? "",
  };
}

export function validateManagerBasicInfo(values: ManagerBasicInfoRequest) {
  return validateForm(values, BASIC_INFO_RULES);
}

export function normalizeManagerBasicInfo(values: ManagerBasicInfoRequest): ManagerBasicInfoRequest {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value.trim()]),
  ) as ManagerBasicInfoRequest;
}

export function equalManagerBasicInfo(left: ManagerBasicInfoRequest, right: ManagerBasicInfoRequest) {
  const a = normalizeManagerBasicInfo(left);
  const b = normalizeManagerBasicInfo(right);
  return (Object.keys(a) as (keyof ManagerBasicInfoRequest)[]).every((key) => a[key] === b[key]);
}

/** 서버와 같은 기준(JPG/PNG, 5MB)으로 먼저 거른다. 실제 이미지 판별은 서버가 한다. */
export function validateProfilePhoto(file: File): string | undefined {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["jpg", "jpeg", "png"].includes(extension)) {
    return "JPG 또는 PNG 파일만 업로드할 수 있습니다.";
  }
  if (file.size === 0) return "빈 파일은 업로드할 수 없습니다.";
  if (file.size > PROFILE_PHOTO_MAX_SIZE) return "사진은 5MB 이하만 업로드할 수 있습니다.";
  return undefined;
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
