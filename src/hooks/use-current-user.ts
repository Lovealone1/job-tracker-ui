'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { authService } from '@/services/auth-service';
import { User } from '@/types/auth';

async function fetchCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
}

export function useCurrentUser() {
    const isAuthenticated = authService.isAuthenticated();

    return useQuery<User>({
        queryKey: ['auth', 'me'],
        queryFn: fetchCurrentUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        enabled: isAuthenticated,
    });
}
