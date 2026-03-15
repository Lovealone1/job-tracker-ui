import axios from 'axios';
import { AuthResponse, LoginCredentials, User, RegisterCredentials } from '@/types/auth';
import { queryClient, clearAllCaches } from '@/core/query-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


class AuthService {
    private readonly STORAGE_KEY = 'job_tracker_auth';

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            // We use a direct axios call here to avoid circular dependency with apiClient
            // and because login is a special case that doesn't need the bearer token yet.
            const response = await axios.post<AuthResponse>(`${API_URL}/api/v1/auth/token`, credentials);
            
            if (response.data.access_token) {
                // Clear any leftover cache from previous sessions before starting new one
                await clearAllCaches();
                this.setSession(response.data);
            }
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(credentials: RegisterCredentials): Promise<void> {
        try {
            await axios.post(`${API_URL}/api/v1/auth/register`, credentials);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.STORAGE_KEY);
            // Clear all caches (in-memory and persisted)
            clearAllCaches().catch(console.error);
        }
    }

    async refresh(): Promise<AuthResponse | null> {
        const session = this.getSession();
        if (!session || !session.refresh_token) {
            this.logout();
            return null;
        }

        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/api/v1/auth/refresh`, {
                refreshToken: session.refresh_token,
            });

            if (response.data.access_token) {
                this.setSession(response.data);
                return response.data;
            }

            this.logout();
            return null;
        } catch (error) {
            console.error('Refresh token error:', error);
            this.logout();
            return null;
        }
    }

    private setSession(authData: AuthResponse): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
        }
    }

    getSession(): AuthResponse | null {
        if (typeof window === 'undefined') return null;
        
        const session = localStorage.getItem(this.STORAGE_KEY);
        return session ? JSON.parse(session) : null;
    }

    async getToken(): Promise<string | null> {
        const session = this.getSession();
        return session ? session.access_token : null;
    }

    getUser(): User | null {
        const session = this.getSession();
        return session ? session.user : null;
    }

    isAuthenticated(): boolean {
        return !!this.getSession();
    }
}

export const authService = new AuthService();
