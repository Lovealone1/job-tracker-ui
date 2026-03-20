import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceProjectService } from '@/services/workspace-project-service';
import { WorkspaceProject } from '@/types/workspace-project';
import { PaginationQuery } from '@/types/job-application';

export const WORKSPACE_PROJECTS_KEY = 'workspace-projects';

export function useWorkspaceProjects(query?: PaginationQuery) {
    return useQuery({
        queryKey: [WORKSPACE_PROJECTS_KEY, query],
        queryFn: () => workspaceProjectService.getAll(query),
    });
}

export function useWorkspaceProject(id: string) {
    return useQuery({
        queryKey: [WORKSPACE_PROJECTS_KEY, id],
        queryFn: () => workspaceProjectService.getById(id),
        enabled: !!id,
    });
}

export function useWorkspaceProjectMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: Partial<WorkspaceProject>) => workspaceProjectService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [WORKSPACE_PROJECTS_KEY] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<WorkspaceProject> }) => 
            workspaceProjectService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [WORKSPACE_PROJECTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [WORKSPACE_PROJECTS_KEY, variables.id] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => workspaceProjectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [WORKSPACE_PROJECTS_KEY] });
        },
    });

    return {
        createProject: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateProject: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteProject: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}

export function usePublicWorkspaceProject(username: string, slug: string) {
    return useQuery({
        queryKey: ['workspace-projects', 'public', username, slug],
        queryFn: async () => {
            return await workspaceProjectService.getPublicBySlug(username, slug);
        },
        enabled: !!username && !!slug,
        staleTime: 5 * 60 * 1000, 
    });
}
