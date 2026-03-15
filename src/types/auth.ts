export interface User {
    id: string;
    email: string;
    role: string;
    enabled?: boolean;
    firstName?: string | null;
    lastName?: string | null;
    country?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
    timezone?: string | null;
    language?: string | null;
    resend_api_key?: string | null;
    lastLoginAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    firstName: string;
    lastName: string;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    country?: string;
    phone?: string;
    timezone?: string;
    language?: string;
    resend_api_key?: string;
    avatar?: File;
}
