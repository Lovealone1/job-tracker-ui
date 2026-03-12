import { apiClient } from './api-client';
import {
    Interview,
    InterviewSummary,
    InterviewStatus,
    CreateInterviewDto,
    UpdateInterviewDto,
    RescheduleInterviewDto,
    InterviewPaginationQuery,
    PaginatedInterviewResponse,
} from '@/types/interview';

class InterviewService {
    private readonly resource = '/interviews';

    async getAll(query?: InterviewPaginationQuery): Promise<PaginatedInterviewResponse> {
        const response = await apiClient.get<PaginatedInterviewResponse>(this.resource, {
            params: query,
        });
        return response.data;
    }

    async getUpcoming(): Promise<InterviewSummary[]> {
        const response = await apiClient.get<InterviewSummary[]>(`${this.resource}/upcoming`);
        return response.data;
    }

    async getByJobApplication(jobApplicationId: string): Promise<InterviewSummary[]> {
        const response = await apiClient.get<InterviewSummary[]>(
            `${this.resource}/job-application/${jobApplicationId}`
        );
        return response.data;
    }

    async getById(id: string): Promise<Interview> {
        const response = await apiClient.get<Interview>(`${this.resource}/${id}`);
        return response.data;
    }

    async create(data: CreateInterviewDto): Promise<Interview> {
        const response = await apiClient.post<Interview>(this.resource, data);
        return response.data;
    }

    async update(id: string, data: UpdateInterviewDto): Promise<Interview> {
        const response = await apiClient.patch<Interview>(`${this.resource}/${id}`, data);
        return response.data;
    }

    async updateStatus(id: string, status: InterviewStatus): Promise<InterviewSummary> {
        const response = await apiClient.patch<InterviewSummary>(
            `${this.resource}/${id}/status`,
            { status }
        );
        return response.data;
    }

    async updateNotes(id: string, notes: string): Promise<Interview> {
        const response = await apiClient.patch<Interview>(
            `${this.resource}/${id}/notes`,
            { notes }
        );
        return response.data;
    }

    async updateFeedback(id: string, feedback: string): Promise<Interview> {
        const response = await apiClient.patch<Interview>(
            `${this.resource}/${id}/feedback`,
            { feedback }
        );
        return response.data;
    }

    async reschedule(id: string, data: RescheduleInterviewDto): Promise<InterviewSummary> {
        const response = await apiClient.patch<InterviewSummary>(
            `${this.resource}/${id}/reschedule`,
            data
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(`${this.resource}/${id}`);
    }
}

export const interviewService = new InterviewService();
