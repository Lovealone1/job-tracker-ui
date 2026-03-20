'use client';

import React, { useState } from 'react';
import { 
    FolderKanban, 
    Plus, 
    Search,
    LayoutGrid,
    List as ListIcon,
    Trash2,
    Clock,
    Github,
    ExternalLink,
    Edit2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { useWorkspaceProjects, useWorkspaceProjectMutations } from '@/features/workspace/hooks/use-workspace-projects';
import { WorkspaceProject } from '@/types/workspace-project';
import { ProjectEditor } from '@/features/workspace/components/project-editor';
import { toast } from 'sonner';

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider", className)}>
        {children}
    </span>
);

export default function ProjectsPage() {
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const { data: paginatedData, isLoading } = useWorkspaceProjects();
    const { createProject, updateProject, deleteProject } = useWorkspaceProjectMutations();
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProject, setSelectedProject] = useState<WorkspaceProject | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewLayout] = useState<'grid' | 'list'>('grid');

    const handleCreateNew = () => {
        setSelectedProject(null);
        setIsEditing(true);
    };

    const handleEdit = (project: WorkspaceProject) => {
        setSelectedProject(project);
        setIsEditing(true);
    };

    const handleSave = async (data: Partial<WorkspaceProject>, options?: { exit?: boolean }) => {
        try {
            if (selectedProject?.id) {
                await updateProject({ id: selectedProject.id, data });
                toast.success('Project updated successfully');
            } else {
                await createProject(data);
                toast.success('Project created successfully');
            }

            if (options?.exit) {
                setIsEditing(false);
                setSelectedProject(null);
            }
        } catch (error) {
            toast.error('Failed to save project');
        }
    };

    const handleDelete = async (project: WorkspaceProject) => {
        if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
            try {
                await deleteProject(project.id);
                toast.success('Project deleted');
            } catch (error) {
                toast.error('Failed to delete project');
            }
        }
    };

    if (isEditing) {
        return (
            <ProjectEditor 
                initialData={selectedProject || undefined} 
                onSave={handleSave} 
                onClose={() => { setIsEditing(false); setSelectedProject(null); }}
            />
        );
    }

    const projects = paginatedData?.data || [];
    const filteredProjects = projects.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="h-[calc(100vh-72px)] flex flex-col overflow-hidden bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-8 pt-2 pb-4 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-[#A600FF] shadow-lg shadow-[#A600FF]/25 rounded-2xl">
                            <FolderKanban className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none italic">
                                Projects
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#A600FF]" />
                                Workspace & Portfolio Tracker
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-6 py-3 bg-[#A600FF] hover:bg-[#8B00D6] text-white rounded-2xl text-[10px] font-black shadow-2xl shadow-[#A600FF]/40 transition-all hover:-translate-y-1 active:translate-y-0 text-nowrap uppercase tracking-widest"
                >
                    <Plus className="w-5 h-5" />
                    Create New Project
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6 custom-scrollbar">
                {/* Search & Stats */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#A600FF] transition-colors" />
                        <input
                            placeholder="Search projects by name..."
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-[#A600FF] focus:ring-4 focus:ring-[#A600FF]/5 p-3.5 pl-12 rounded-2xl outline-none transition-all font-semibold italic placeholder:text-zinc-400 placeholder:not-italic"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl h-[54px] items-center shrink-0">
                        <button 
                            onClick={() => setViewLayout('grid')}
                            className={cn(
                                "px-4 py-2 rounded-xl transition-all",
                                viewMode === 'grid' ? "bg-white dark:bg-zinc-950 shadow-sm text-[#A600FF]" : "text-zinc-400"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setViewLayout('list')}
                            className={cn(
                                "px-4 py-2 rounded-xl transition-all",
                                viewMode === 'list' ? "bg-white dark:bg-zinc-950 shadow-sm text-[#A600FF]" : "text-zinc-400"
                            )}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className={cn(
                        viewMode === 'grid' 
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                            : "flex flex-col gap-4"
                    )}>
                        {filteredProjects.map((project) => (
                            viewMode === 'grid' ? (
                                <div 
                                    key={project.id}
                                    className="group relative flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:border-[#A600FF]/50 transition-all hover:shadow-2xl hover:shadow-[#A600FF]/5 hover:-translate-y-1 h-[280px]"
                                >
                                    {/* Card Header (solid color / banner) */}
                                    <div className="h-20 bg-zinc-100 dark:bg-zinc-900/50 p-6 flex items-start justify-between relative overflow-hidden group-hover:bg-[#A600FF]/5 transition-colors border-b border-zinc-100 dark:border-zinc-900">
                                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                                            <Badge className="bg-[#A600FF]/10 text-[#A600FF]">{project.type}</Badge>
                                        </div>
                                    </div>

                                    {/* Quick Actions Overlay (Appears on Hover) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] z-30 pointer-events-none">
                                        <div className="flex flex-col gap-2 scale-90 group-hover:scale-100 transition-transform pointer-events-auto">
                                            <button 
                                                onClick={() => {
                                                    const prefix = user?.email?.split('@')[0] || 'projects';
                                                    router.push(`/${prefix}/${project.slug || project.id}`);
                                                }}
                                                className="bg-[#A600FF] text-white px-6 py-3 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] border border-[#A600FF]"
                                            >
                                                Open Board
                                            </button>
                                        </div>
                                    </div>

                                    {/* Footer info */}
                                    <div className="p-5 flex flex-col flex-1 pb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col gap-1 pr-2 truncate shrink min-w-0 w-full">
                                                <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-50 truncate leading-tight italic">
                                                    {project.name}
                                                </h3>
                                                {project.slug && (
                                                    <p className="text-[10px] font-bold text-zinc-400 truncate w-full">/{project.slug}</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 mb-auto mt-2">
                                            <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">{project.status}</Badge>
                                            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">{project.priority}</Badge>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                <Clock className="w-3 h-3" /> Updated
                                            </div>
                                            <div className="flex gap-2 shrink-0 z-40 relative">
                                                {project.repositoryUrl && (
                                                    <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer pointer-events-auto">
                                                        <Github className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {project.liveUrl && (
                                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="p-2 text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer pointer-events-auto">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                                                    className="p-2 text-zinc-400 hover:text-[#A600FF] transition-colors cursor-pointer pointer-events-auto"
                                                    title="Edit Project"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(project); }}
                                                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer pointer-events-auto"
                                                    title="Delete Project"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    key={project.id}
                                    className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-[#A600FF]/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4 w-full min-w-0">
                                        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl group-hover:bg-[#A600FF]/10 transition-colors relative shrink-0">
                                            <FolderKanban className="w-5 h-5 text-[#A600FF]" />
                                        </div>
                                        <div className="min-w-0 truncate pr-4">
                                            <h3 className="font-black text-zinc-900 dark:text-zinc-50 italic flex items-center gap-2 truncate">
                                                <span className="truncate">{project.name}</span>
                                                <Badge className="bg-[#A600FF]/10 text-[#A600FF] border-none shrink-0">{project.type}</Badge>
                                            </h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-0.5 truncate">
                                                Status: {project.status} | Priority: {project.priority}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {project.repositoryUrl && (
                                            <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button 
                                            onClick={() => handleEdit(project)}
                                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#A600FF] bg-[#A600FF]/5 rounded-xl hover:bg-[#A600FF]/10 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(project)}
                                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}

                        {/* Empty/Add Card */}
                        {viewMode === 'grid' ? (
                            <div 
                                onClick={handleCreateNew}
                                className="h-[280px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-4 text-zinc-400 hover:text-[#A600FF] hover:border-[#A600FF]/50 transition-all group cursor-pointer"
                            >
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl group-hover:bg-[#A600FF]/10 transition-colors">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <span className="font-bold text-sm tracking-tight italic">New Project</span>
                            </div>
                        ) : (
                            <button 
                                onClick={handleCreateNew}
                                className="flex items-center gap-3 p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 hover:text-[#A600FF] hover:border-[#A600FF]/50 transition-all group w-full justify-center"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="font-bold text-sm italic">Create New Project</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
