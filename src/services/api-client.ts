import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth-service';

/**
 * Custom Axios instance for the Job Tracker App.
 * Authentication travels in httpOnly cookies (withCredentials), so no
 * Bearer token is ever handled by JS. Expired sessions are transparently
 * refreshed once and retried.
 *
 * The baseURL is relative on purpose: requests hit the frontend origin and
 * the Next rewrite proxies them to the API, which keeps the session cookie
 * first-party. Never hardcode the API origin here or the cookie becomes
 * third-party again and browsers drop it.
 */
export const apiClient: AxiosInstance = axios.create({
    baseURL: '/api/v1',
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
