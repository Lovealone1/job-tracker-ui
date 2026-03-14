import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewService } from '@/services/interview-service';
import { INTERVIEWS_KEYS } from './use-interviews';
import {
    CreateInterviewDto,
    UpdateInterviewDto,
    InterviewStatus,
    RescheduleInterviewDto,
} from '@/types/interview';
import { useNotification } from '@/providers/notification-provider';

export function useInterviewMutations() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: INTERVIEWS_KEYS.all });
    };

    const createMutation = useMutation({
        mutationFn: (data: CreateInterviewDto) => interviewService.create(data),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Interview scheduled successfully');
        },
        onError: () => showError('Failed to schedule interview'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateInterviewDto }) =>
            interviewService.update(id, data),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Interview updated successfully');
        },
        onError: () => showError('Failed to update interview'),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: InterviewStatus }) =>
            interviewService.updateStatus(id, status),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Interview status updated');
        },
        onError: () => showError('Failed to update interview status'),
    });

    const updateNotesMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes: string }) =>
            interviewService.updateNotes(id, notes),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Interview notes saved');
        },
        onError: () => showError('Failed to save interview notes'),
    });

    const updateFeedbackMutation = useMutation({
        mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
            interviewService.updateFeedback(id, feedback),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Interview feedback saved');
        },
        onError: () => showError('Failed to save interview feedback'),
    });

    const rescheduleMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: RescheduleInterviewDto }) =>
            interviewService.reschedule(id, data),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Interview rescheduled successfully');
        },
        onError: () => showError('Failed to reschedule interview'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => interviewService.delete(id),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Interview deleted successfully');
        },
        onError: () => showError('Failed to delete interview'),
    });

    return {
        createInterview: createMutation,
        updateInterview: updateMutation,
        updateStatus: updateStatusMutation,
        updateNotes: updateNotesMutation,
        updateFeedback: updateFeedbackMutation,
        rescheduleInterview: rescheduleMutation,
        deleteInterview: deleteMutation,
    };
}
