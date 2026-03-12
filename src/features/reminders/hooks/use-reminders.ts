import { useQuery } from '@tanstack/react-query';
import { reminderService } from '@/services/reminder-service';
import { authService } from '@/services/auth-service';

export const REMINDERS_KEYS = {
    all: ['reminders'] as const,
    lists: () => [...REMINDERS_KEYS.all, 'list'] as const,
    list: () => [...REMINDERS_KEYS.lists()] as const,
    upcoming: () => [...REMINDERS_KEYS.all, 'upcoming'] as const,
    dashboardSummary: () => [...REMINDERS_KEYS.all, 'dashboard-summary'] as const,
    byJobApplication: (jobApplicationId: string) =>
        [...REMINDERS_KEYS.all, 'job-application', jobApplicationId] as const,
    byInterview: (interviewId: string) =>
        [...REMINDERS_KEYS.all, 'interview', interviewId] as const,
    detail: (id: string) => [...REMINDERS_KEYS.all, 'detail', id] as const,
};

export function useReminders() {
    return useQuery({
        queryKey: REMINDERS_KEYS.list(),
        queryFn: () => reminderService.getAll(),
        enabled: authService.isAuthenticated(),
    });
}

export function useUpcomingReminders() {
    return useQuery({
        queryKey: REMINDERS_KEYS.upcoming(),
        queryFn: () => reminderService.getUpcoming(),
        enabled: authService.isAuthenticated(),
    });
}

export function useReminderDashboardSummary() {
    return useQuery({
        queryKey: REMINDERS_KEYS.dashboardSummary(),
        queryFn: () => reminderService.getDashboardSummary(),
        enabled: authService.isAuthenticated(),
    });
}

export function useRemindersByJobApplication(jobApplicationId: string) {
    return useQuery({
        queryKey: REMINDERS_KEYS.byJobApplication(jobApplicationId),
        queryFn: () => reminderService.getByJobApplication(jobApplicationId),
        enabled: authService.isAuthenticated() && !!jobApplicationId,
    });
}

export function useRemindersByInterview(interviewId: string) {
    return useQuery({
        queryKey: REMINDERS_KEYS.byInterview(interviewId),
        queryFn: () => reminderService.getByInterview(interviewId),
        enabled: authService.isAuthenticated() && !!interviewId,
    });
}

export function useReminder(id: string) {
    return useQuery({
        queryKey: REMINDERS_KEYS.detail(id),
        queryFn: () => reminderService.getById(id),
        enabled: authService.isAuthenticated() && !!id,
    });
}
