export type LoginLocationState = {
  from?: string;
  registeredMessage?: string;
} | null;

export type LoginFeedbackType = 'success' | 'error';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}
