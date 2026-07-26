export type FindIdStep = 1 | 2 | 3;

export interface FindIdSendCodeRequest {
  userName: string;
  email: string;
}

export interface FindIdSendCodeResponse {
  expiresInMinutes: number;
}

export interface FindIdVerifyCodeRequest {
  code: string;
}

export interface FindIdVerifyCodeResponse {
  userId: string;
}
