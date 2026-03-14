import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/application-service';
import { JOB_APPLICATIONS_KEYS } from './use-applications';
import { JobApplication, JobApplicationStatus, Priority } from '@/types/job-application';
import { useNotification } from '@/providers/notification-provider';

export function useApplicationMutations() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

     const invalidateAll = () => {
        // Invalidate all plural keys (covers most lists)
        queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEYS.all });
        // Specifically invalidate summaries
        queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEYS.summaries() });
        // Also invalidate the legacy 'applications' key just in case
        queryClient.invalidateQueries({ queryKey: ['applications'] });
    };

    const createMutation = useMutation({
        mutationFn: (data: Partial<JobApplication>) => applicationService.create(data),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Application created successfully');
        },
        onError: () => showError('Failed to create application'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<JobApplication> }) => 
            applicationService.update(id, data),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Application updated successfully');
        },
        onError: () => showError('Failed to update application'),
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: JobApplicationStatus }) => 
            applicationService.updateStatus(id, status),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Status updated');
        },
        onError: () => showError('Failed to update status'),
    });

    const priorityMutation = useMutation({
        mutationFn: ({ id, priority }: { id: string; priority: Priority }) => 
            applicationService.updatePriority(id, priority),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Priority updated');
        },
        onError: () => showError('Failed to update priority'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => applicationService.delete(id),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Application deleted successfully');
        },
        onError: () => showError('Failed to delete application'),
    });

    const resumeVariantMutation = useMutation({
        mutationFn: ({ id, resumeVariantId }: { id: string; resumeVariantId: string }) => 
            applicationService.updateResumeVariant(id, resumeVariantId),
        onSuccess: () => {
            invalidateAll();
            showSuccess('CV Variant linked');
        },
        onError: () => showError('Failed to link CV variant'),
    });

    return {
        createApplication: createMutation,
        updateApplication: updateMutation,
        statusMutation,
        priorityMutation,
        resumeVariantMutation,
        deleteApplication: deleteMutation,
    };
}
