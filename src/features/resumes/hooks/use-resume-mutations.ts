import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resume-service';
import { resumeKeys } from './use-resumes';
import { 
    CreateResumeDto, 
    UpdateResumeDto, 
    CreateResumeVariantDto, 
    UpdateResumeVariantDto 
} from '@/types/resume';

export function useResumeMutations() {
    const queryClient = useQueryClient();

    const createResume = useMutation({
        mutationFn: (data: CreateResumeDto) => resumeService.createResume(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
        },
    });

    const updateResume = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateResumeDto }) => 
            resumeService.updateResume(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: resumeKeys.detail(id) });
        },
    });

    const setDefaultResume = useMutation({
        mutationFn: (id: string) => resumeService.setDefault(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
        },
    });

    const deleteResume = useMutation({
        mutationFn: (id: string) => resumeService.deleteResume(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
        },
    });

    // --- Variants ---

    const createVariant = useMutation({
        mutationFn: (data: CreateResumeVariantDto) => resumeService.createVariant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.variantsLists() });
        },
    });

    const updateVariant = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateResumeVariantDto }) => 
            resumeService.updateVariant(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.variantsLists() });
            queryClient.invalidateQueries({ queryKey: resumeKeys.variantDetail(id) });
        },
    });

    const deleteVariant = useMutation({
        mutationFn: (id: string) => resumeService.deleteVariant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.variantsLists() });
        },
    });

    return {
        createResume,
        updateResume,
        setDefaultResume,
        deleteResume,
        createVariant,
        updateVariant,
        deleteVariant,
    };
}
