import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewService } from '@/services/interview-service';
import { INTERVIEWS_KEYS } from './use-interviews';
import {
    CreateInterviewDto,
    UpdateInterviewDto,
    InterviewStatus,
    RescheduleInterviewDto,
} from '@/types/interview';

export function useInterviewMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: INTERVIEWS_KEYS.all });
    };

    const createMutation = useMutation({
        mutationFn: (data: CreateInterviewDto) => interviewService.create(data),
        onSuccess: invalidateAll,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateInterviewDto }) =>
            interviewService.update(id, data),
        onSuccess: invalidateAll,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: InterviewStatus }) =>
            interviewService.updateStatus(id, status),
        onSuccess: invalidateAll,
    });

    const updateNotesMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes: string }) =>
            interviewService.updateNotes(id, notes),
        onSuccess: invalidateAll,
    });

    const updateFeedbackMutation = useMutation({
        mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
            interviewService.updateFeedback(id, feedback),
        onSuccess: invalidateAll,
    });

    const rescheduleMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: RescheduleInterviewDto }) =>
            interviewService.reschedule(id, data),
        onSuccess: invalidateAll,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => interviewService.delete(id),
        onSuccess: invalidateAll,
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
