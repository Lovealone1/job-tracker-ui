'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile-service';
import { authService } from '@/services/auth-service';
import { User, UpdateProfilePayload } from '@/types/auth';
import { useNotification } from '@/providers/notification-provider';

export function useProfile() {
    const isAuthenticated = authService.isAuthenticated();

    return useQuery<User>({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(),
        enabled: isAuthenticated,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => profileService.updateProfile(payload),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['profile'], updatedUser);
            showSuccess('Profile updated successfully');
        },
        onError: (error: any) => {
            showError(error.response?.data?.message || 'Failed to update profile');
        }
    });
}
