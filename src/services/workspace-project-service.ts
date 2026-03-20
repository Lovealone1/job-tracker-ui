import { apiClient } from './api-client';
import { WorkspaceProject } from '@/types/workspace-project';
import { PaginatedResponse, PaginationQuery } from '@/types/job-application';

class WorkspaceProjectService {
    private readonly resource = '/workspace-projects';

    async getAll(query?: PaginationQuery): Promise<PaginatedResponse<WorkspaceProject>> {
        const response = await apiClient.get<PaginatedResponse<WorkspaceProject>>(this.resource, {
            params: query,
        });
        return response.data;
    }

    async getById(id: string): Promise<WorkspaceProject> {
        const response = await apiClient.get<WorkspaceProject>(`${this.resource}/${id}`);
        return response.data;
    }

    async create(data: Partial<WorkspaceProject>): Promise<WorkspaceProject> {
        const response = await apiClient.post<WorkspaceProject>(this.resource, data);
        return response.data;
    }

    async update(id: string, data: Partial<WorkspaceProject>): Promise<WorkspaceProject> {
        const response = await apiClient.patch<WorkspaceProject>(`${this.resource}/${id}`, data);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(`${this.resource}/${id}`);
    }
}

export const workspaceProjectService = new WorkspaceProjectService();
