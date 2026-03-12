'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { LoginCredentials } from '@/types/auth';

export function useLogin() {
    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    });
}
