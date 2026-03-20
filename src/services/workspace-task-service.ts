import { apiClient } from './api-client';
import { WorkspaceTask, WorkspaceTaskQuery } from '@/types/workspace-task';
import { PaginatedResponse } from '@/types/job-application';

class WorkspaceTaskService {
    private readonly resource = '/workspace-tasks';

    async getAll(query?: WorkspaceTaskQuery): Promise<PaginatedResponse<WorkspaceTask>> {
        const response = await apiClient.get<PaginatedResponse<WorkspaceTask>>(this.resource, {
            params: query,
        });
        return response.data;
    }

    async getById(id: string): Promise<WorkspaceTask> {
        const response = await apiClient.get<WorkspaceTask>(`${this.resource}/${id}`);
        return response.data;
    }

    async create(data: Partial<WorkspaceTask>): Promise<WorkspaceTask> {
        const response = await apiClient.post<WorkspaceTask>(this.resource, data);
        return response.data;
    }

    async update(id: string, data: Partial<WorkspaceTask>): Promise<WorkspaceTask> {
        const response = await apiClient.patch<WorkspaceTask>(`${this.resource}/${id}`, data);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(`${this.resource}/${id}`);
    }
}

export const workspaceTaskService = new WorkspaceTaskService();
