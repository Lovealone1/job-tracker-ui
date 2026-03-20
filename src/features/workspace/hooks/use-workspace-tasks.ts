import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceTaskService } from '@/services/workspace-task-service';
import { WorkspaceTask, WorkspaceTaskQuery } from '@/types/workspace-task';

export const WORKSPACE_TASKS_KEY = 'workspace-tasks';

export function useWorkspaceTasks(query?: WorkspaceTaskQuery) {
    return useQuery({
        queryKey: [WORKSPACE_TASKS_KEY, query],
        queryFn: () => workspaceTaskService.getAll(query),
    });
}

export function useWorkspaceTask(id: string) {
    return useQuery({
        queryKey: [WORKSPACE_TASKS_KEY, id],
        queryFn: () => workspaceTaskService.getById(id),
        enabled: !!id,
    });
}

export function useWorkspaceTaskMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: Partial<WorkspaceTask>) => workspaceTaskService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [WORKSPACE_TASKS_KEY] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<WorkspaceTask> }) => 
            workspaceTaskService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [WORKSPACE_TASKS_KEY] });
            queryClient.invalidateQueries({ queryKey: [WORKSPACE_TASKS_KEY, variables.id] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => workspaceTaskService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [WORKSPACE_TASKS_KEY] });
        },
    });

    return {
        createTask: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateTask: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteTask: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
