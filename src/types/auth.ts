export interface User {
    id: string;
    email: string;
    role: string;
    enabled?: boolean;
    document?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    country?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
    timezone?: string | null;
    language?: string | null;
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
