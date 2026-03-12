import { apiClient } from './api-client';
import { 
    JobApplication, 
    JobApplicationStatus, 
    JobApplicationSummary, 
    PaginatedResponse, 
    PaginationQuery, 
    Priority 
} from '@/types/job-application';


class ApplicationService {
    private readonly resource = '/job-applications';

    async getAll(query?: PaginationQuery): Promise<PaginatedResponse<JobApplication>> {
        const response = await apiClient.get<PaginatedResponse<JobApplication>>(this.resource, {
            params: query,
        });
        return response.data;
    }

    async getById(id: string): Promise<JobApplication> {
        const response = await apiClient.get<JobApplication>(`${this.resource}/${id}`);
        return response.data;
    }

    async getSummary(): Promise<JobApplicationSummary> {
        const response = await apiClient.get<JobApplicationSummary>(`${this.resource}/summary`);
        return response.data;
    }

    async create(data: Partial<JobApplication>): Promise<JobApplication> {
        const response = await apiClient.post<JobApplication>(this.resource, data);
        return response.data;
    }

    async update(id: string, data: Partial<JobApplication>): Promise<JobApplication> {
        const response = await apiClient.patch<JobApplication>(`${this.resource}/${id}`, data);
        return response.data;
    }

    async updateStatus(id: string, status: JobApplicationStatus): Promise<JobApplication> {
        const response = await apiClient.patch<JobApplication>(`${this.resource}/${id}/status`, { status });
        return response.data;
    }

    async updateNotes(id: string, notes: string): Promise<JobApplication> {
        const response = await apiClient.patch<JobApplication>(`${this.resource}/${id}/notes`, { notes });
        return response.data;
    }

    async updatePriority(id: string, priority: Priority): Promise<JobApplication> {
        const response = await apiClient.patch<JobApplication>(`${this.resource}/${id}/priority`, { priority });
        return response.data;
    }

    async updateResumeVariant(id: string, resumeVariantId: string): Promise<JobApplication> {
        const response = await apiClient.patch<JobApplication>(`${this.resource}/${id}/resume-variant`, { resumeVariantId });
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(`${this.resource}/${id}`);
    }
}

export const applicationService = new ApplicationService();
