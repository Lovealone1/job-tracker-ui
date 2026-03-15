import { apiClient } from './api-client';
import { User, UpdateProfilePayload } from '@/types/auth';

class ProfileService {
    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>('/profile');
        return response.data;
    }

    async updateProfile(payload: UpdateProfilePayload): Promise<User> {
        const formData = new FormData();

        // Append non-null/undefined fields to formData
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        const response = await apiClient.patch<User>('/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    }
}

export const profileService = new ProfileService();
