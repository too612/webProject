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

export interface LoginRequest {
    username: string;
    password: string;
    rememberMe?: boolean;
}

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
