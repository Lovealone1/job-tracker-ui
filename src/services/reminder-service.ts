import { apiClient } from './api-client';
import {
    Reminder,
    ReminderSummary,
    ReminderStatus,
    ReminderType,
    CreateReminderDto,
    UpdateReminderDto,
    UpdateReminderStatusDto,
    UpdateReminderTypeDto,
    RescheduleReminderDto,
    ReminderDashboardSummary,
    ReminderPaginationQuery,
    PaginatedReminderResponse,
} from '@/types/reminder';

class ReminderService {
    private readonly resource = '/reminders';

    async getAll(query?: ReminderPaginationQuery): Promise<PaginatedReminderResponse> {
        const response = await apiClient.get<PaginatedReminderResponse>(this.resource, {
            params: query,
        });
        return response.data;
    }

    async getUpcoming(): Promise<ReminderSummary[]> {
        const response = await apiClient.get<ReminderSummary[]>(`${this.resource}/upcoming`);
        return response.data;
    }

    async getDashboardSummary(): Promise<ReminderDashboardSummary> {
        const response = await apiClient.get<ReminderDashboardSummary>(`${this.resource}/summary/dashboard`);
        return response.data;
    }

    async getByJobApplication(jobApplicationId: string): Promise<ReminderSummary[]> {
        const response = await apiClient.get<ReminderSummary[]>(`${this.resource}/job-application/${jobApplicationId}`);
        return response.data;
    }

    async getByInterview(interviewId: string): Promise<ReminderSummary[]> {
        const response = await apiClient.get<ReminderSummary[]>(`${this.resource}/interview/${interviewId}`);
        return response.data;
    }

    async getById(id: string): Promise<Reminder> {
        const response = await apiClient.get<Reminder>(`${this.resource}/${id}`);
        return response.data;
    }

    async create(data: CreateReminderDto): Promise<Reminder> {
        const response = await apiClient.post<Reminder>(this.resource, data);
        return response.data;
    }

    async update(id: string, data: UpdateReminderDto): Promise<Reminder> {
        const response = await apiClient.patch<Reminder>(`${this.resource}/${id}`, data);
        return response.data;
    }

    async updateStatus(id: string, status: ReminderStatus): Promise<ReminderSummary> {
        const response = await apiClient.patch<ReminderSummary>(`${this.resource}/${id}/status`, { status });
        return response.data;
    }

    async updateType(id: string, type: ReminderType): Promise<Reminder> {
        const response = await apiClient.patch<Reminder>(`${this.resource}/${id}/type`, { type });
        return response.data;
    }

    async reschedule(id: string, dueAt: string): Promise<ReminderSummary> {
        const response = await apiClient.patch<ReminderSummary>(`${this.resource}/${id}/reschedule`, { dueAt });
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(`${this.resource}/${id}`);
    }
}

export const reminderService = new ReminderService();
