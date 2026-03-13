export interface EducationEntry {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface ExperienceEntry {
    company: string;
    role: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    achievements?: string[];
}

export interface ProjectEntry {
    name: string;
    description: string;
    url?: string;
    technologies?: string[];
}

export interface ResumePersonalInfo {
    email: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    website?: string;
    github?: string;
    [key: string]: any;
}

export interface Resume {
    id: string;
    profileId: string;
    title: string;
    template?: string;
    isDefault: boolean;
    resumeName: string;
    personalInfo: ResumePersonalInfo;
    summary?: string;
    education: EducationEntry[];
    experience: ExperienceEntry[];
    projects?: ProjectEntry[];
    skills?: Record<string, string[]>;
    others?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface ResumeVariant {
    id: string;
    resumeId: string;
    jobApplicationId: string;
    title?: string;
    resumeName?: string;
    personalInfo?: Partial<ResumePersonalInfo>;
    summary?: string;
    education?: EducationEntry[];
    experience?: ExperienceEntry[];
    projects?: ProjectEntry[];
    skills?: Record<string, string[]>;
    others?: Record<string, any>;
    modifications?: Record<string, any>;
    notes?: string;
    generatedWithAI: boolean;
    atsScore?: number;
    matchScore?: number;
    pdfUrl?: string;
    template?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateResumeDto {
    title: string;
    template?: string;
    isDefault?: boolean;
    resumeName: string;
    personalInfo: ResumePersonalInfo;
    summary?: string;
    education: EducationEntry[];
    experience: ExperienceEntry[];
    projects?: ProjectEntry[];
    skills?: Record<string, string[]>;
    others?: Record<string, any>;
}

export interface UpdateResumeDto extends Partial<CreateResumeDto> {}

export interface CreateResumeVariantDto {
    resumeId: string;
    jobApplicationId?: string;
    title?: string;
    resumeName?: string;
    personalInfo?: Partial<ResumePersonalInfo>;
    summary?: string;
    education?: EducationEntry[];
    experience?: ExperienceEntry[];
    projects?: ProjectEntry[];
    skills?: Record<string, string[]>;
    others?: Record<string, any>;
    notes?: string;
    generatedWithAI?: boolean;
    atsScore?: number;
    matchScore?: number;
}

export interface UpdateResumeVariantDto extends Partial<Omit<CreateResumeVariantDto, 'resumeId'>> {
    modifications?: Record<string, any>;
    pdfUrl?: string;
}
