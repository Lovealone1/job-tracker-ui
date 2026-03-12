import { useQuery } from '@tanstack/react-query';
import { applicationService } from '@/services/application-service';
import { PaginationQuery } from '@/types/job-application';

export const JOB_APPLICATIONS_KEYS = {
    all: ['job-applications'] as const,
    lists: () => [...JOB_APPLICATIONS_KEYS.all, 'list'] as const,
    list: (query?: PaginationQuery) => [...JOB_APPLICATIONS_KEYS.lists(), query] as const,
    summaries: () => [...JOB_APPLICATIONS_KEYS.all, 'summary'] as const,
    summary: () => [...JOB_APPLICATIONS_KEYS.summaries()] as const,
};

export function useApplications(query?: PaginationQuery) {
    return useQuery({
        queryKey: JOB_APPLICATIONS_KEYS.list(query),
        queryFn: () => applicationService.getAll(query),
    });
}

export function useApplicationSummary() {
    return useQuery({
        queryKey: JOB_APPLICATIONS_KEYS.summary(),
        queryFn: () => applicationService.getSummary(),
    });
}
