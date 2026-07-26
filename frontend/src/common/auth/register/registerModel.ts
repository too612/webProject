export type ValidationType = "success" | "error" | "";

export interface RegisterRequest {
  username: string;
  userName: string;
  email: string;
  phone: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  password: string;
  birthDate?: string;
  gender?: "M" | "F" | "";
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing?: boolean;
}

export type TermsType = "TERMS" | "PRIVACY" | "MARKETING";

export interface TermsPolicyItem {
  termsType: TermsType;
  termsVersion: string;
  title: string;
  content: string;
  isRequired: boolean;
}

export const USERNAME_PATTERN = /^[a-zA-Z0-9]{4,20}$/;
export const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;
export const PHONE_PATTERN = /^\d{3}-\d{4}-\d{4}$/;
