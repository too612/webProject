export interface UserType {
  userId: string;
  username?: string;
  userName?: string;
  email?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  userId: string;
  username: string;
  token?: string;
  expiresIn?: number;
}
