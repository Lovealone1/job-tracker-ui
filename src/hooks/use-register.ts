'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth-service';
import { RegisterCredentials } from '@/types/auth';

export function useRegister() {
    return useMutation({
        mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    });
}
