export type FindPasswordStep = 1 | 2 | 3;

export interface FindPasswordSendCodeRequest {
  userId: string;
  email: string;
}

export interface FindPasswordSendCodeResponse {
  expiresInMinutes: number;
}

export interface FindPasswordVerifyCodeRequest {
  code: string;
}

export interface FindPasswordVerifyCodeResponse {
  verified: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;
