export type ValidationType = 'success' | 'error' | '';

export interface RegisterRequest {
	username: string;
	userName: string;
	email: string;
	phone: string;
	password: string;
	birthDate?: string;
	gender?: 'M' | 'F' | '';
	agreeTerms: boolean;
	agreePrivacy: boolean;
	agreeMarketing?: boolean;
}

export const USERNAME_PATTERN = /^[a-zA-Z0-9]{4,20}$/;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;
export const PHONE_PATTERN = /^\d{3}-\d{4}-\d{4}$/;
