import { PaginatedResponse, PaginationQuery } from './job-application';

export enum WorkspaceProjectType {
    PORTFOLIO = 'PORTFOLIO',
    TECHNICAL_TEST = 'TECHNICAL_TEST',
    FREELANCE = 'FREELANCE',
    STUDY = 'STUDY',
    PERSONAL = 'PERSONAL',
    INTERVIEW_PREP = 'INTERVIEW_PREP',
    OTHER = 'OTHER'
}

export enum WorkspaceProjectStatus {
    PLANNING = 'PLANNING',
    IN_PROGRESS = 'IN_PROGRESS',
    ON_HOLD = 'ON_HOLD',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    ARCHIVED = 'ARCHIVED'
}

export enum WorkspaceTaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export interface WorkspaceProject {
    id: string;
    profileId: string;
    name: string;
    slug?: string;
    type: WorkspaceProjectType;
    status: WorkspaceProjectStatus;
    priority: WorkspaceTaskPriority;
    description?: string;
    goal?: string;
    outcome?: string;
    deliverables: string[];
    stack: string[];
    repositoryUrl?: string;
    liveUrl?: string;
    demoUrl?: string;
    notes?: string;
    startDate?: string;
    dueDate?: string;
    completedAt?: string;
    visibility: string;
    createdAt: string;
    updatedAt: string;
}
