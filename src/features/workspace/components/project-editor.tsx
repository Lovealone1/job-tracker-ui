import React, { useState } from 'react';
import { ChevronRight, Save } from 'lucide-react';
import { WorkspaceProject, WorkspaceProjectType, WorkspaceProjectStatus, WorkspaceTaskPriority } from '@/types/workspace-project';

interface ProjectEditorProps {
    initialData?: WorkspaceProject;
    onSave: (data: Partial<WorkspaceProject>, options?: { exit?: boolean }) => void;
    onClose: () => void;
}

export function ProjectEditor({ initialData, onSave, onClose }: ProjectEditorProps) {
    const [formData, setFormData] = useState<Partial<WorkspaceProject>>(initialData || {
        name: 'New Project',
        type: WorkspaceProjectType.PERSONAL,
        status: WorkspaceProjectStatus.PLANNING,
        priority: WorkspaceTaskPriority.MEDIUM,
        description: '',
        deliverables: [],
        stack: [],
        visibility: 'PRIVATE'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData, { exit: true });
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950">
            <div className="flex items-center justify-between px-8 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-bold tracking-tight">
                        {initialData?.id ? 'Edit Project' : 'Create Project'}
                    </h2>
                </div>
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#A600FF] hover:bg-[#8B00D6] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#A600FF]/25 transition-all"
                >
                    <Save className="w-4 h-4" />
                    Save Project
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full space-y-6">
                <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Project Name</label>
                        <input
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-[#A600FF] focus:ring-2 focus:ring-[#A600FF]/20 p-3 rounded-xl outline-none transition-all"
                            placeholder="e.g. My Awesome Portfolio"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Type</label>
                            <select
                                name="type"
                                value={formData.type || ''}
                                onChange={handleChange}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-[#A600FF] focus:ring-2 focus:ring-[#A600FF]/20 p-3 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                            >
                                {Object.values(WorkspaceProjectType).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status || ''}
                                onChange={handleChange}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-[#A600FF] focus:ring-2 focus:ring-[#A600FF]/20 p-3 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                            >
                                {Object.values(WorkspaceProjectStatus).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-[#A600FF] focus:ring-2 focus:ring-[#A600FF]/20 p-3 rounded-xl outline-none transition-all resize-none"
                            placeholder="Describe the main goal of this project..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Repository URL</label>
                        <input
                            name="repositoryUrl"
                            value={formData.repositoryUrl || ''}
                            onChange={handleChange}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-[#A600FF] focus:ring-2 focus:ring-[#A600FF]/20 p-3 rounded-xl outline-none transition-all"
                            placeholder="https://github.com/..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Live URL</label>
                        <input
                            name="liveUrl"
                            value={formData.liveUrl || ''}
                            onChange={handleChange}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-[#A600FF] focus:ring-2 focus:ring-[#A600FF]/20 p-3 rounded-xl outline-none transition-all"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
