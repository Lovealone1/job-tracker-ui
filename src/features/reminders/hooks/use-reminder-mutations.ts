import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderService } from '@/services/reminder-service';
import { REMINDERS_KEYS } from './use-reminders';
import {
    CreateReminderDto,
    UpdateReminderDto,
    ReminderStatus,
    ReminderType,
} from '@/types/reminder';
import { useNotification } from '@/providers/notification-provider';

export function useReminderMutations() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: REMINDERS_KEYS.all });
    };

    const createMutation = useMutation({
        mutationFn: (data: CreateReminderDto) => reminderService.create(data),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Reminder created successfully');
        },
        onError: () => showError('Failed to create reminder'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateReminderDto }) =>
            reminderService.update(id, data),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Reminder updated successfully');
        },
        onError: () => showError('Failed to update reminder'),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: ReminderStatus }) =>
            reminderService.updateStatus(id, status),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Reminder status updated');
        },
        onError: () => showError('Failed to update reminder status'),
    });

    const updateTypeMutation = useMutation({
        mutationFn: ({ id, type }: { id: string; type: ReminderType }) =>
            reminderService.updateType(id, type),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Reminder type updated');
        },
        onError: () => showError('Failed to update reminder type'),
    });

    const rescheduleMutation = useMutation({
        mutationFn: ({ id, dueAt }: { id: string; dueAt: string }) =>
            reminderService.reschedule(id, dueAt),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Reminder rescheduled successfully');
        },
        onError: () => showError('Failed to reschedule reminder'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => reminderService.delete(id),
        onSuccess: () => {
            invalidateAll();
            showSuccess('Reminder deleted successfully');
        },
        onError: () => showError('Failed to delete reminder'),
    });

    return {
        createReminder: createMutation,
        updateReminder: updateMutation,
        updateStatus: updateStatusMutation,
        updateType: updateTypeMutation,
        rescheduleReminder: rescheduleMutation,
        deleteReminder: deleteMutation,
    };
}
