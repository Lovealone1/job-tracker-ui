import axios from 'axios';
import { AuthResponse, LoginCredentials, User } from '@/types/auth';
import { clearAllCaches } from '@/core/query-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Non-sensitive UI hint — NOT a token.
 * The real session lives in httpOnly cookies set by the backend and is never
 * readable from JS. This flag only lets the UI decide synchronously
 * (react-query `enabled` flags, guards) whether it is worth trying requests.
 */
const SESSION_FLAG_KEY = 'jt_session_active';

export type OAuthProvider = 'google' | 'github';

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            // Direct axios call (login is a special case, no cookies yet).
            // withCredentials => the backend Set-Cookie headers are honored.
            const response = await axios.post<AuthResponse>(`${API_URL}/api/v1/auth/token`, credentials, {
                withCredentials: true,
            });

            if (response.data.access_token) {
                // Clear any leftover cache from previous sessions before starting new one
                await clearAllCaches();
                this.markSessionActive();
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * OAuth sign-in / sign-up (Google & GitHub are the ONLY registration path).
     * Redirects the browser to the backend, which starts the Supabase OAuth
     * flow and lands back on the app with httpOnly session cookies set.
     */
    startOAuth(provider: OAuthProvider): void {
        window.location.href = `${API_URL}/api/v1/auth/oauth/${provider}`;
    }

    async logout(): Promise<void> {
        try {
            await axios.post(`${API_URL}/api/v1/auth/logout`, {}, { withCredentials: true });
        } catch {
            // best-effort: local state is cleared regardless
        } finally {
            this.markSessionInactive();
            clearAllCaches().catch(console.error);
        }
    }

    async refresh(): Promise<AuthResponse | null> {
        try {
            const response = await axios.post<AuthResponse>(
                `${API_URL}/api/v1/auth/refresh`,
                {},
                { withCredentials: true },
            );

            if (response.data.access_token) {
                this.markSessionActive();
                return response.data;
            }

            return null;
        } catch (error) {
            console.error('Refresh token error:', error);
            this.markSessionInactive();
            clearAllCaches().catch(console.error);
            return null;
        }
    }

    /** Server-side session check — the httpOnly cookie is not readable from JS. */
    async me(): Promise<User | null> {
        try {
            const response = await axios.get<User>(`${API_URL}/api/v1/auth/me`, {
                withCredentials: true,
            });
            this.markSessionActive();
            return response.data;
        } catch {
            this.markSessionInactive();
            return null;
        }
    }

    /**
     * Synchronous auth hint for react-query `enabled` flags and guards.
     * It is only a UI hint: every request is still validated by the backend
     * through the httpOnly cookie.
     */
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem(SESSION_FLAG_KEY) === '1';
    }

    private markSessionActive(): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(SESSION_FLAG_KEY, '1');
        }
    }

    private markSessionInactive(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(SESSION_FLAG_KEY);
        }
    }
}

export const authService = new AuthService();
