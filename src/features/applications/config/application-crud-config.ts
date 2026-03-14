import { z } from 'zod';
import { 
    JobApplicationStatus, 
    Priority, 
    WorkMode, 
    EmploymentType, 
    ContractType, 
    CompensationType,
    Seniority
} from '@/types/job-application';
import { CrudEntityConfig } from '@/types/crud';

export const jobApplicationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    company: z.string().min(1, 'Company is required'),
    description: z.string().optional(),
    jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    source: z.string().optional(),
    location: z.string().optional(),
    country: z.string().optional(),
    workMode: z.nativeEnum(WorkMode).default(WorkMode.ON_SITE),
    employmentType: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
    contractType: z.nativeEnum(ContractType).default(ContractType.UNDEFINED),
    seniorityLevel: z.nativeEnum(Seniority).default(Seniority.UNKNOWN),
    compensationAmountMin: z.number().min(0).optional(),
    compensationAmountMax: z.number().min(0).optional(),
    compensationType: z.nativeEnum(CompensationType).default(CompensationType.MONTHLY),
    currency: z.string().default('USD'),
    benefits: z.string().optional(),
    status: z.nativeEnum(JobApplicationStatus).default(JobApplicationStatus.SAVED),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
    resumeVariantId: z.string().optional().or(z.literal('')),
});

export const applicationCrudConfig: CrudEntityConfig = {
    entityKey: 'job-applications',
    title: 'Job Applications',
    singularTitle: 'Job Application',
    endpoints: {
        base: '/job-applications',
    },
    columns: [], // We already have a custom view, but this is required by the type
    formSchema: jobApplicationSchema,
    defaultValues: {
        workMode: WorkMode.ON_SITE,
        employmentType: EmploymentType.FULL_TIME,
        contractType: ContractType.UNDEFINED,
        compensationType: CompensationType.MONTHLY,
        currency: 'USD',
        status: JobApplicationStatus.SAVED,
        priority: Priority.MEDIUM,
    },
    formFields: [
        // Row 1
        {
            name: 'title',
            label: 'Position Title',
            type: 'text',
            placeholder: 'e.g. Senior Software Engineer',
        },
        {
            name: 'company',
            label: 'Company',
            type: 'text',
            placeholder: 'e.g. Google',
        },
        {
            name: 'jobUrl',
            label: 'Job URL',
            type: 'text',
            placeholder: 'https://...',
        },
        {
            name: 'source',
            label: 'Source',
            type: 'text',
            placeholder: 'e.g. LinkedIn, Indeed',
        },
        // Row 2
        {
            name: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'e.g. Mountain View, CA',
        },
        {
            name: 'country',
            label: 'Country',
            type: 'text',
            placeholder: 'e.g. USA',
        },
        {
            name: 'workMode',
            label: 'Work Mode',
            type: 'select',
            options: Object.values(WorkMode).map(v => ({ 
                label: v === WorkMode.ON_SITE ? 'On-site' : v.charAt(0) + v.slice(1).toLowerCase(), 
                value: v 
            })),
        },
        {
            name: 'employmentType',
            label: 'Employment Type',
            type: 'select',
            options: Object.values(EmploymentType).map(v => ({ 
                label: (v.charAt(0) + v.slice(1).toLowerCase()).replace('_', ' '), 
                value: v 
            })),
        },
        // Row 3
        {
            name: 'contractType',
            label: 'Contract Type',
            type: 'select',
            options: Object.values(ContractType).map(v => ({ 
                label: (v.charAt(0) + v.slice(1).toLowerCase()).replace('_', ' '), 
                value: v 
            })),
        },
        {
            name: 'seniorityLevel',
            label: 'Seniority Level',
            type: 'select',
            options: Object.values(Seniority).map(v => ({ 
                label: (v.charAt(0) + v.slice(1).toLowerCase()).replace('_', ' '), 
                value: v 
            })),
        },
        {
            name: 'status',
            label: 'Application Status',
            type: 'select',
            options: Object.values(JobApplicationStatus).map(v => ({ 
                label: (v.charAt(0) + v.slice(1).toLowerCase()).replace('_', ' '), 
                value: v 
            })),
        },
        {
            name: 'priority',
            label: 'Priority',
            type: 'select',
            options: Object.values(Priority).map(v => ({ label: v, value: v })),
        },
        // Row 4
        {
            name: 'compensationAmountMin',
            label: 'Min Compensation',
            type: 'number',
        },
        {
            name: 'compensationAmountMax',
            label: 'Max Compensation',
            type: 'number',
        },
        {
            name: 'compensationType',
            label: 'Comp. Frequency',
            type: 'select',
            options: Object.values(CompensationType).map(v => ({ 
                label: (v.charAt(0) + v.slice(1).toLowerCase()).replace('_', ' '), 
                value: v 
            })),
        },
        {
            name: 'currency',
            label: 'Currency',
            type: 'text',
            placeholder: 'USD, EUR, etc.',
        },
        // Full width rows
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Job description...',
        },
        {
            name: 'resumeVariantId',
            label: 'Linked CV Variant',
            type: 'select',
            options: [], // To be populated dynamically in the page
        }
    ]
};
