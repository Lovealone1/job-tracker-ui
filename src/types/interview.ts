// ── Interview Enums ──────────────────────────────────────

export enum InterviewType {
    SCREENING = 'SCREENING',
    HR = 'HR',
    TECHNICAL = 'TECHNICAL',
    CULTURAL = 'CULTURAL',
    BEHAVIORAL = 'BEHAVIORAL',
    CASE_STUDY = 'CASE_STUDY',
    FINAL = 'FINAL',
    OTHER = 'OTHER',
}

export enum InterviewStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
    RESCHEDULED = 'RESCHEDULED',
    NO_SHOW = 'NO_SHOW',
}

// ── Interfaces ───────────────────────────────────────────

export interface JobApplicationLight {
    title: string;
    company: string;
}

/** Summary returned in list endpoints */
export interface InterviewSummary {
    id: string;
    jobApplicationId: string;
    type: InterviewType;
    status: InterviewStatus;
    scheduledAt: string; // ISO date
    durationMinutes?: number;
    jobApplication?: JobApplicationLight;
    notes?: string;
    feedback?: string;
}

/** Full detail returned in single-get / create / update */
export interface Interview extends InterviewSummary {
    timezone?: string;
    location?: string;
    meetingUrl?: string;
    interviewerName?: string;
    interviewerEmail?: string;
    notes?: string;
    feedback?: string;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
}

// ── DTOs ─────────────────────────────────────────────────

export interface CreateInterviewDto {
    jobApplicationId: string;
    type: InterviewType;
    scheduledAt: string; // ISO date
    durationMinutes?: number;
    timezone?: string;
    location?: string;
    meetingUrl?: string;
    interviewerName?: string;
    interviewerEmail?: string;
    notes?: string;
}

export type UpdateInterviewDto = Partial<Omit<CreateInterviewDto, 'jobApplicationId'>>;

export interface RescheduleInterviewDto {
    scheduledAt: string; // ISO date
    durationMinutes?: number;
    timezone?: string;
}

// ── Pagination ───────────────────────────────────────────

export interface InterviewPaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedInterviewResponse {
    data: InterviewSummary[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
