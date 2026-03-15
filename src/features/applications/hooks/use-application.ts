import { useQuery } from '@tanstack/react-query';
import { applicationService } from '@/services/application-service';

export const JOB_APPLICATION_KEYS = {
    all: ['job-applications'] as const,
    detail: (id: string) => [...JOB_APPLICATION_KEYS.all, 'detail', id] as const,
};

export function useApplication(id: string) {
    return useQuery({
        queryKey: JOB_APPLICATION_KEYS.detail(id),
        queryFn: () => applicationService.getById(id),
        enabled: !!id,
    });
}
