import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/application-service';
import { JOB_APPLICATIONS_KEYS } from './use-applications';
import { JobApplication, JobApplicationStatus, Priority } from '@/types/job-application';

export function useApplicationMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEYS.all });
    };

    const createMutation = useMutation({
        mutationFn: (data: Partial<JobApplication>) => applicationService.create(data),
        onSuccess: invalidateAll,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<JobApplication> }) => 
            applicationService.update(id, data),
        onSuccess: invalidateAll,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: JobApplicationStatus }) => 
            applicationService.updateStatus(id, status),
        onSuccess: invalidateAll,
    });

    const updatePriorityMutation = useMutation({
        mutationFn: ({ id, priority }: { id: string; priority: Priority }) => 
            applicationService.updatePriority(id, priority),
        onSuccess: invalidateAll,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => applicationService.delete(id),
        onSuccess: invalidateAll,
    });

    const updateResumeVariantMutation = useMutation({
        mutationFn: ({ id, resumeVariantId }: { id: string; resumeVariantId: string }) => 
            applicationService.updateResumeVariant(id, resumeVariantId),
        onSuccess: invalidateAll,
    });

    return {
        createApplication: createMutation,
        updateApplication: updateMutation,
        updateStatus: updateStatusMutation,
        updatePriority: updatePriorityMutation,
        updateResumeVariant: updateResumeVariantMutation,
        deleteApplication: deleteMutation,
    };
}
