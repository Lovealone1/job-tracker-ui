'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePublicWorkspaceProject } from '@/features/workspace/hooks/use-workspace-projects';
import { useWorkspaceTaskMutations } from '@/features/workspace/hooks/use-workspace-tasks';
import { FolderKanban, Clock, CircleDot, ExternalLink, Github, Plus } from 'lucide-react';
import { WorkspaceTaskStatus, WorkspaceTask } from '@/types/workspace-task';
import { cn } from '@/lib/utils';
import { WorkspaceProject, WorkspaceTaskPriority } from '@/types/workspace-project';

const STATUS_COLUMNS = [
    { id: WorkspaceTaskStatus.TODO, label: 'To Do', color: 'bg-zinc-200 dark:bg-zinc-800' },
    { id: WorkspaceTaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-500/20 text-blue-500' },
    { id: WorkspaceTaskStatus.REVIEW, label: 'Review', color: 'bg-amber-500/20 text-amber-500' },
    { id: WorkspaceTaskStatus.DONE, label: 'Done', color: 'bg-emerald-500/20 text-emerald-500' }
];

export default function PublicProjectBoard() {
    const params = useParams();
    const username = params.username as string;
    const slug = params.slug as string;

    const { data, isLoading, error, refetch } = usePublicWorkspaceProject(username, slug);
    const { createTask } = useWorkspaceTaskMutations();

    const [addingTaskStatus, setAddingTaskStatus] = useState<string | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Frontend assertion since the endpoint returns it mapping the relation
    const project = data as (WorkspaceProject & { tasks: WorkspaceTask[], profile: any }) | undefined;

    const tasksByStatus = useMemo(() => {
        if (!project?.tasks) return {};
        const grouped: Record<string, WorkspaceTask[]> = {};
        Object.values(WorkspaceTaskStatus).forEach(status => {
            grouped[status] = project.tasks.filter(t => t.status === status).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        });
        return grouped;
    }, [project?.tasks]);

    const handleCreateTask = async (status: WorkspaceTaskStatus, e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !project) return;
        
        try {
            await createTask({
                projectId: project.id,
                title: newTaskTitle.trim(),
                status: status,
                customTaskId: `TSK-${Math.floor(Math.random() * 10000)}`,
                priority: WorkspaceTaskPriority.MEDIUM,
                orderIndex: (tasksByStatus[status]?.length || 0) * 1000 + 1000
            });
            setNewTaskTitle('');
            setAddingTaskStatus(null);
            refetch();
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="w-8 h-8 border-4 border-[#A600FF]/30 border-t-[#A600FF] rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
                <FolderKanban className="w-16 h-16 text-zinc-300 dark:text-zinc-800 mb-6" />
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 text-center">Project Not Found</h1>
                <p className="text-zinc-500 text-center max-w-md">
                    This project might be private, deleted, or the URL is incorrect.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
            {/* Header / Cover Area */}
            <div className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pt-16 pb-12 px-8 flex-shrink-0">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4 max-w-2xl">
                            {/* Profile Info Badge */}
                            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/50 w-max px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                                {project.profile?.avatarUrl ? (
                                    <img src={project.profile.avatarUrl} alt="Creator" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-[#A600FF] flex items-center justify-center text-[10px] font-black text-white">
                                        {project.profile?.email?.[0].toUpperCase()}
                                    </div>
                                )}
                                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 pr-2">
                                    {project.profile?.firstName || username}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none">
                                {project.name}
                            </h1>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
                                {project.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            {project.repositoryUrl && (
                                <a 
                                    href={project.repositoryUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold shadow-lg hover:-translate-y-0.5 transition-transform"
                                >
                                    <Github className="w-4 h-4" /> Code Repository
                                </a>
                            )}
                            {project.liveUrl && (
                                <a 
                                    href={project.liveUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#A600FF] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#A600FF]/25 hover:-translate-y-0.5 transition-transform"
                                >
                                    <ExternalLink className="w-4 h-4" /> Live Demo
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap pt-4">
                        <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            {project.type}
                        </span>
                        <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            Status: {project.status}
                        </span>
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest pl-2 border-l border-zinc-200 dark:border-zinc-800">
                            <Clock className="w-3.5 h-3.5" />
                            Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanban Board Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="h-full flex items-start gap-6 p-8 min-w-max max-w-[1400px] mx-auto">
                    {STATUS_COLUMNS.map((column) => (
                        <div key={column.id} className="flex flex-col w-[320px] shrink-0 h-full max-h-full">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", column.color)}>
                                        {column.label}
                                    </span>
                                    <span className="text-xs font-bold text-zinc-500">
                                        {tasksByStatus[column.id]?.length || 0}
                                    </span>
                                </div>
                                <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tasks Container */}
                            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-8">
                                {tasksByStatus[column.id]?.length === 0 ? (
                                    <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <CircleDot className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
                                        <span className="text-xs font-bold text-zinc-400">No tasks</span>
                                    </div>
                                ) : (
                                    tasksByStatus[column.id]?.map((task) => (
                                        <div 
                                            key={task.id}
                                            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-[#A600FF]/40 hover:shadow-xl hover:shadow-[#A600FF]/5 hover:-translate-y-1 transition-all cursor-pointer"
                                        >
                                            {task.phase && (
                                                <span className="text-[10px] font-black text-[#A600FF] uppercase tracking-widest block mb-2">
                                                    {task.phase}
                                                </span>
                                            )}
                                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-2 leading-snug">
                                                {task.title}
                                            </h4>
                                            {task.description && (
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                                                    {task.description}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                                                    task.priority === 'URGENT' ? 'bg-red-500/10 text-red-500' :
                                                    task.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                                                    'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                                )}>
                                                    {task.priority}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-400">
                                                    {task.customTaskId}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* Quick Add Button (Notion style) */}
                                {addingTaskStatus === column.id ? (
                                    <form 
                                        onSubmit={(e) => handleCreateTask(column.id as WorkspaceTaskStatus, e)}
                                        className="mt-1"
                                    >
                                        <input
                                            autoFocus
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            onBlur={() => { setAddingTaskStatus(null); setNewTaskTitle(''); }}
                                            placeholder="What needs to be done?"
                                            className="w-full bg-white dark:bg-zinc-950 border border-[#A600FF]/50 focus:ring-2 focus:ring-[#A600FF]/20 rounded-xl p-3 outline-none text-sm transition-all shadow-sm"
                                        />
                                    </form>
                                ) : (
                                    <button 
                                        onClick={() => setAddingTaskStatus(column.id)}
                                        className="flex items-center gap-2 w-full py-3 px-4 rounded-xl text-left text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors mt-1"
                                    >
                                        <Plus className="w-4 h-4" /> New
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
