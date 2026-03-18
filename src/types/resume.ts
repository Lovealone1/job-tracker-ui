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
    startDate?: string;
    endDate?: string;
    current?: boolean;
    location?: string;
    highlights?: string[];
}

export interface PublicationEntry {
    title: string;
    authors: string | string[];
    doi?: string;
    journal?: string;
    conference?: string;
    date?: string;
    description?: string;
}

export interface CertificationEntry {
    name: string;
    issuer?: string;
    date?: string;
    description?: string;
}

export interface HonorEntry {
    name: string;
    issuer?: string;
    date?: string;
    description?: string;
}

export interface PatentEntry {
    title: string;
    issuer?: string;
    date?: string;
    description?: string;
}

export interface TalkEntry {
    title: string;
    venue?: string;
    location?: string;
    date?: string;
    description?: string;
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
    publications?: PublicationEntry[];
    certifications?: CertificationEntry[];
    honors?: HonorEntry[];
    patents?: PatentEntry[];
    talks?: TalkEntry[];
    skills?: Record<string, string[]>;
    others?: Record<string, any>;
    language?: string;
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
    publications?: PublicationEntry[];
    certifications?: CertificationEntry[];
    honors?: HonorEntry[];
    patents?: PatentEntry[];
    talks?: TalkEntry[];
    skills?: Record<string, string[]>;
    others?: Record<string, any>;
    modifications?: Record<string, any>;
    notes?: string;
    generatedWithAI: boolean;
    atsScore?: number;
    matchScore?: number;
    pdfUrl?: string;
    template?: string;
    language?: string;
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
    publications?: PublicationEntry[];
    certifications?: CertificationEntry[];
    honors?: HonorEntry[];
    patents?: PatentEntry[];
    talks?: TalkEntry[];
    skills?: Record<string, string[]>;
    others?: Record<string, any>;
    language?: string;
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
    publications?: PublicationEntry[];
    certifications?: CertificationEntry[];
    honors?: HonorEntry[];
    patents?: PatentEntry[];
    talks?: TalkEntry[];
    skills?: Record<string, string[]>;
    others?: Record<string, any>;
    notes?: string;
    generatedWithAI?: boolean;
    atsScore?: number;
    matchScore?: number;
    language?: string;
}

export interface UpdateResumeVariantDto extends Partial<Omit<CreateResumeVariantDto, 'resumeId'>> {
    modifications?: Record<string, any>;
    pdfUrl?: string;
}
