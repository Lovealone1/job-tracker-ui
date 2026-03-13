// Enums matching backend Prisma schema
export enum JobApplicationStatus {
    SAVED = 'SAVED',
    APPLIED = 'APPLIED',
    INTERVIEWING = 'INTERVIEWING',
    OFFER = 'OFFER',
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
    PERMANENT = 'PERMANENT',
    TEMPORARY = 'TEMPORARY',
    UNDEFINED = 'UNDEFINED',
}

export enum CompensationType {
    ANNUAL = 'ANNUAL',
    MONTHLY = 'MONTHLY',
    HOURLY = 'HOURLY',
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
    byStatus: Record<JobApplicationStatus, number>;
    byPriority: Record<Priority, number>;
    recentApplications: JobApplication[];
}
