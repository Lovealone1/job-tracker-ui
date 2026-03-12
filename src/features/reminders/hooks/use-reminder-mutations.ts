import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderService } from '@/services/reminder-service';
import { REMINDERS_KEYS } from './use-reminders';
import {
    CreateReminderDto,
    UpdateReminderDto,
    ReminderStatus,
    ReminderType,
} from '@/types/reminder';

export function useReminderMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: REMINDERS_KEYS.all });
    };

    const createMutation = useMutation({
        mutationFn: (data: CreateReminderDto) => reminderService.create(data),
        onSuccess: invalidateAll,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateReminderDto }) =>
            reminderService.update(id, data),
        onSuccess: invalidateAll,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: ReminderStatus }) =>
            reminderService.updateStatus(id, status),
        onSuccess: invalidateAll,
    });

    const updateTypeMutation = useMutation({
        mutationFn: ({ id, type }: { id: string; type: ReminderType }) =>
            reminderService.updateType(id, type),
        onSuccess: invalidateAll,
    });

    const rescheduleMutation = useMutation({
        mutationFn: ({ id, dueAt }: { id: string; dueAt: string }) =>
            reminderService.reschedule(id, dueAt),
        onSuccess: invalidateAll,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => reminderService.delete(id),
        onSuccess: invalidateAll,
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
