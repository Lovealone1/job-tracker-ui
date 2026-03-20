import { WorkspaceTaskPriority } from './workspace-project';
import { PaginationQuery } from './job-application';

export enum WorkspaceTaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    BLOCKED = 'BLOCKED',
    REVIEW = 'REVIEW',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED'
}

export interface WorkspaceTask {
    id: string;
    projectId: string;
    profileId: string;
    customTaskId: string;
    title: string;
    phase?: string;
    status: WorkspaceTaskStatus;
    priority: WorkspaceTaskPriority;
    description?: string;
    deliverables: string[];
    outcome?: string;
    notes?: string;
    startDate?: string;
    dueDate?: string;
    completedAt?: string;
    orderIndex?: number;
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceTaskQuery extends PaginationQuery {
    projectId?: string;
}
