export interface PermissionEntry {
  programId: string;
  canRead?: boolean;
  canWrite?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  isOpen?: boolean;
}

export interface UserType {
  userId: string;
  username?: string;
  userName?: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: Record<string, PermissionEntry>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  userId: string;
  username: string;
  token?: string;
  expiresIn?: number;
  roles?: string[];
  permissions?: Record<string, PermissionEntry>;
}
