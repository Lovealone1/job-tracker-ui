import { useQuery } from '@tanstack/react-query';
import { interviewService } from '@/services/interview-service';
import { authService } from '@/services/auth-service';
import { InterviewPaginationQuery } from '@/types/interview';

export const INTERVIEWS_KEYS = {
    all: ['interviews'] as const,
    lists: () => [...INTERVIEWS_KEYS.all, 'list'] as const,
    list: (query?: InterviewPaginationQuery) => [...INTERVIEWS_KEYS.lists(), query] as const,
    upcoming: () => [...INTERVIEWS_KEYS.all, 'upcoming'] as const,
    byJobApplication: (jobApplicationId: string) =>
        [...INTERVIEWS_KEYS.all, 'job-application', jobApplicationId] as const,
    detail: (id: string) => [...INTERVIEWS_KEYS.all, 'detail', id] as const,
};

export function useInterviews(query?: InterviewPaginationQuery) {
    return useQuery({
        queryKey: INTERVIEWS_KEYS.list(query),
        queryFn: () => interviewService.getAll(query),
        enabled: authService.isAuthenticated(),
    });
}

export function useUpcomingInterviews() {
    return useQuery({
        queryKey: INTERVIEWS_KEYS.upcoming(),
        queryFn: () => interviewService.getUpcoming(),
        enabled: authService.isAuthenticated(),
    });
}

export function useInterviewsByJobApplication(jobApplicationId: string) {
    return useQuery({
        queryKey: INTERVIEWS_KEYS.byJobApplication(jobApplicationId),
        queryFn: () => interviewService.getByJobApplication(jobApplicationId),
        enabled: authService.isAuthenticated() && !!jobApplicationId,
    });
}

export function useInterview(id: string) {
    return useQuery({
        queryKey: INTERVIEWS_KEYS.detail(id),
        queryFn: () => interviewService.getById(id),
        enabled: authService.isAuthenticated() && !!id,
    });
}
