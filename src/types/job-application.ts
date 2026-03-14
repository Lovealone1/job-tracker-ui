// Enums matching backend Prisma schema
export enum JobApplicationStatus {
    SAVED = 'SAVED',
    APPLIED = 'APPLIED',
    INTERVIEWING = 'INTERVIEWING',
    OFFER_RECEIVED = 'OFFER_RECEIVED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
    GHOSTED = 'GHOSTED',
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum WorkMode {
    REMOTE = 'REMOTE',
    ON_SITE = 'ON_SITE',
    HYBRID = 'HYBRID',
}

export enum EmploymentType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP',
    FREELANCE = 'FREELANCE',
}

export enum ContractType {
    UNDEFINED = 'UNDEFINED',
    FIXED_TERM = 'FIXED_TERM',
    PROJECT_BASED = 'PROJECT_BASED',
    CONTRACTOR = 'CONTRACTOR',
    OTHER = 'OTHER',
}

export enum CompensationType {
    HOURLY = 'HOURLY',
    MONTHLY = 'MONTHLY',
    ANNUAL = 'ANNUAL',
    PROJECT_BASED = 'PROJECT_BASED',
}

// Interfaces
export interface JobApplication {
    id: string;
    title: string;
    company: string;
    description?: string;
    jobUrl?: string;
    source?: string;
    location?: string;
    country?: string;
    workMode?: WorkMode;
    employmentType?: EmploymentType;
    contractType?: ContractType;
    seniorityLevel?: string;
    compensationAmountMin?: number;
    compensationAmountMax?: number;
    compensationType?: CompensationType;
    currency?: string;
    benefits?: string;
    status: JobApplicationStatus;
    priority: Priority;
    appliedAt?: string; // ISO Date string
    savedAt?: string; // ISO Date string
    closedAt?: string; // ISO Date string
    notes?: string;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    profileId: string;
    resumeVariantId?: string;
    resumeVariant?: { id: string; title: string };
}

export interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface JobApplicationSummary {
    totalApplications: number;
    byStatus: Record<string, number>;
    byWorkMode: Record<string, number>;
    appliedThisWeek: number;
    appliedThisMonth: number;
    upcomingInterviewsCount: number;
}
