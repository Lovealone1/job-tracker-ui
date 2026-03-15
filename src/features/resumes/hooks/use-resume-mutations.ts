import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resume-service';
import { resumeKeys } from './use-resumes';
import { 
    CreateResumeDto, 
    UpdateResumeDto, 
    CreateResumeVariantDto, 
    UpdateResumeVariantDto 
} from '@/types/resume';
import { useNotification } from '@/providers/notification-provider';

export function useResumeMutations() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const createResume = useMutation({
        mutationFn: (data: CreateResumeDto) => resumeService.createResume(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
            showSuccess('Resume created successfully');
        },
        onError: () => showError('Failed to create resume'),
    });

    const updateResume = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateResumeDto }) => 
            resumeService.updateResume(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: resumeKeys.detail(id) });
            showSuccess('Resume updated successfully');
        },
        onError: () => showError('Failed to update resume'),
    });

    const setDefaultResume = useMutation({
        mutationFn: (id: string) => resumeService.setDefault(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
            showSuccess('Default resume updated');
        },
        onError: () => showError('Failed to set default resume'),
    });

    const deleteResume = useMutation({
        mutationFn: (id: string) => resumeService.deleteResume(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
            showSuccess('Resume deleted successfully');
        },
        onError: () => showError('Failed to delete resume'),
    });

    // --- Variants ---

    const createVariant = useMutation({
        mutationFn: (data: CreateResumeVariantDto) => resumeService.createVariant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.variantsLists() });
            showSuccess('Resume variant created');
        },
        onError: () => showError('Failed to create variant'),
    });

    const updateVariant = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateResumeVariantDto }) => 
            resumeService.updateVariant(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.variantsLists() });
            queryClient.invalidateQueries({ queryKey: resumeKeys.variantDetail(id) });
            showSuccess('Variant updated successfully');
        },
        onError: () => showError('Failed to update variant'),
    });

    const deleteVariant = useMutation({
        mutationFn: (id: string) => resumeService.deleteVariant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resumeKeys.variantsLists() });
            showSuccess('Variant deleted successfully');
        },
        onError: () => showError('Failed to delete variant'),
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
