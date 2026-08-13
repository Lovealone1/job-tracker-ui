import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth-service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Custom Axios instance for the Job Tracker App.
 * Authentication travels in httpOnly cookies (withCredentials), so no
 * Bearer token is ever handled by JS. Expired sessions are transparently
 * refreshed once and retried.
 */
export const apiClient: AxiosInstance = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
});

// Request interceptor: let the browser set the multipart boundary for FormData
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (config.data instanceof FormData && config.headers) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: refresh the session once on 401, then retry
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // If we are offline, we can't refresh.
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                return Promise.reject(error);
            }

            const session = await authService.refresh();
            if (session?.access_token) {
                // Cookies were rotated by the backend — just retry the request.
                return apiClient(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);
