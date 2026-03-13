import { useQuery } from '@tanstack/react-query';
import { resumeService } from '@/services/resume-service';

export const resumeKeys = {
    all: ['resumes'] as const,
    lists: () => [...resumeKeys.all, 'list'] as const,
    list: () => [...resumeKeys.lists()] as const,
    details: () => [...resumeKeys.all, 'detail'] as const,
    detail: (id: string) => [...resumeKeys.details(), id] as const,
    variantsAll: ['resume-variants'] as const,
    variantsLists: () => [...resumeKeys.variantsAll, 'list'] as const,
    variantsDetails: () => [...resumeKeys.variantsAll, 'detail'] as const,
    variantDetail: (id: string) => [...resumeKeys.variantsDetails(), id] as const,
};

export function useResumes() {
    return useQuery({
        queryKey: resumeKeys.list(),
        queryFn: () => resumeService.listResumes(),
    });
}

export function useResume(id: string) {
    return useQuery({
        queryKey: resumeKeys.detail(id),
        queryFn: () => resumeService.getResume(id),
        enabled: !!id,
    });
}

export function useResumeVariants() {
    return useQuery({
        queryKey: resumeKeys.variantsLists(),
        queryFn: () => resumeService.listVariants(),
    });
}

export function useResumeVariant(id: string) {
    return useQuery({
        queryKey: resumeKeys.variantDetail(id),
        queryFn: () => resumeService.getVariant(id),
        enabled: !!id,
    });
}
