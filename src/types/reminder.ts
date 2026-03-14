export enum ReminderType {
    FOLLOW_UP = 'FOLLOW_UP',
    APPLICATION_DEADLINE = 'APPLICATION_DEADLINE',
    INTERVIEW_PREP = 'INTERVIEW_PREP',
    DOCUMENT_UPDATE = 'DOCUMENT_UPDATE',
    NETWORKING = 'NETWORKING',
    OTHER = 'OTHER',
}

export enum ReminderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    OVERDUE = 'OVERDUE',
    CANCELED = 'CANCELED',
}

export interface JobApplicationBrief {
    title?: string;
    company?: string;
}

export interface InterviewBrief {
    type?: string;
    scheduledAt?: string; // ISO date
}

export interface ReminderSummary {
    id: string;
    title: string;
    type: ReminderType;
    status: ReminderStatus;
    dueAt: string; // ISO date
    jobApplication?: JobApplicationBrief;
    interview?: InterviewBrief;
}

export interface Reminder extends ReminderSummary {
    description?: string;
    isRecurring: boolean;
    jobApplicationId?: string;
    interviewId?: string;
    completedAt?: string; // ISO date
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
}

export interface CreateReminderDto {
    title: string;
    description?: string;
    type: ReminderType;
    dueAt: string; // ISO date
    isRecurring?: boolean;
    jobApplicationId?: string;
    interviewId?: string;
}

export interface UpdateReminderDto {
    title?: string;
    description?: string;
    type?: ReminderType;
    dueAt?: string; // ISO date
    isRecurring?: boolean;
}

export interface UpdateReminderStatusDto {
    status: ReminderStatus;
}

export interface UpdateReminderTypeDto {
    type: ReminderType;
}

export interface RescheduleReminderDto {
    dueAt: string; // ISO date
}

export interface ReminderDashboardSummary {
    upcomingCount: number;
    completedCount: number;
}

// ── Pagination ───────────────────────────────────────────

export interface ReminderPaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    from?: string; // ISO date
    to?: string;   // ISO date
    status?: ReminderStatus;
    type?: ReminderType;
}

export interface PaginatedReminderResponse {
    data: ReminderSummary[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
