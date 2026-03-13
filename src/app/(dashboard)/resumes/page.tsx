'use client';

import React, { useState } from 'react';
import { 
    FileText, 
    Plus, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    Star, 
    Clock, 
    ChevronRight,
    Search,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResumes, useResumeVariants } from '@/features/resumes/hooks/use-resumes';
import { useResumeMutations } from '@/features/resumes/hooks/use-resume-mutations';
import { Resume, ResumeVariant } from '@/types/resume';
import { ResumeEditor } from '@/features/resumes/components/resume-editor';
import { toast } from 'sonner';

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider", className)}>
        {children}
    </span>
);

export default function ResumesPage() {
    const { data: resumes, isLoading: resumesLoading } = useResumes();
    const { data: variants, isLoading: variantsLoading } = useResumeVariants();
    const { 
        createResume, updateResume, deleteResume, setDefaultResume,
        createVariant, updateVariant, deleteVariant 
    } = useResumeMutations();
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Resume | ResumeVariant | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewLayout] = useState<'grid' | 'list'>('grid');

    const isLoading = resumesLoading || variantsLoading;

    const isVariant = (item: Resume | ResumeVariant): item is ResumeVariant => {
        return 'resumeId' in item;
    };

    const handleCreateNew = async () => {
        try {
            const newResume = await createResume.mutateAsync({
                title: 'New Resume',
                resumeName: 'Your Name',
                personalInfo: { email: '' },
                education: [],
                experience: [],
                projects: [],
                skills: {}
            });
            setSelectedItem(newResume);
            setIsEditing(true);
        } catch (error) {
            toast.error('Failed to create resume');
        }
    };

    const handleCreateVariant = async (resume: Resume) => {
        try {
            const newVariant = await createVariant.mutateAsync({
                resumeId: resume.id,
                title: `Variant of ${resume.title}`,
            });
            setSelectedItem(newVariant);
            setIsEditing(true);
            toast.success('Variant created');
        } catch (error) {
            toast.error('Failed to create variant');
        }
    };

    const handleEdit = (item: Resume | ResumeVariant) => {
        setSelectedItem(item);
        setIsEditing(true);
    };

    const handleSave = async (data: any, options?: { exit?: boolean }) => {
        if (!selectedItem) return;

        try {
            if (isVariant(selectedItem)) {
                // Strip relations and internal calculated fields
                const { 
                    id, resumeId, jobApplicationId, 
                    createdAt, updatedAt, 
                    jobApplications, resume, 
                    _type, ...updateData 
                } = data;
                const updated = await updateVariant.mutateAsync({ id: selectedItem.id, data: updateData });
                setSelectedItem(updated);
            } else {
                const { id, profileId, createdAt, updatedAt, _type, ...updateData } = data;
                const updated = await updateResume.mutateAsync({ id: selectedItem.id, data: updateData });
                setSelectedItem(updated);
            }

            if (options?.exit) {
                setIsEditing(false);
                setSelectedItem(null);
            }
        } catch (error) {
            toast.error('Failed to save changes');
        }
    };

    const handleDelete = async (item: Resume | ResumeVariant) => {
        const type = isVariant(item) ? 'variant' : 'resume';
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                if (isVariant(item)) {
                    await deleteVariant.mutateAsync(item.id);
                } else {
                    await deleteResume.mutateAsync(item.id);
                }
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
            } catch (error) {
                toast.error(`Failed to delete ${type}`);
            }
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultResume.mutateAsync(id);
            toast.success('Default resume updated');
        } catch (error) {
            toast.error('Failed to set default resume');
        }
    };

    if (isEditing && selectedItem) {
        return (
            <div className="fixed inset-0 z-50 bg-background overflow-hidden">
                <div className="flex h-14 items-center gap-4 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
                    <button 
                        onClick={() => { setIsEditing(false); setSelectedItem(null); }}
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black uppercase tracking-widest text-[#A600FF]">
                            {isVariant(selectedItem) ? 'Editing Variant' : 'Editing Base Resume'}
                        </span>
                        {isVariant(selectedItem) && (
                            <Badge className="bg-[#A600FF]/10 text-[#A600FF]">Variant</Badge>
                        )}
                    </div>
                </div>
                <ResumeEditor initialData={selectedItem} onSave={handleSave} />
            </div>
        );
    }

    const filteredItems = [
        ...(resumes || []).map(r => ({ ...r, _type: 'resume' as const })),
        ...(variants || []).map(v => ({ ...v, _type: 'variant' as const }))
    ].filter(item => {
        const title = item.title || 'Untitled';
        return title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="h-[calc(100vh-72px)] flex flex-col overflow-hidden bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-8 pt-2 pb-4 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-[#A600FF] shadow-lg shadow-[#A600FF]/25 rounded-2xl">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none italic">
                                Resumes
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#A600FF]" />
                                CV Management & Tailoring
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-6 py-3 bg-[#A600FF] hover:bg-[#8B00D6] text-white rounded-2xl text-[10px] font-black shadow-2xl shadow-[#A600FF]/40 transition-all hover:-translate-y-1 active:translate-y-0 text-nowrap uppercase tracking-widest"
                >
                    <Plus className="w-5 h-5" />
                    Create New CV
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6 custom-scrollbar">
                {/* Search & Stats */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#A600FF] transition-colors" />
                        <input
                            placeholder="Search CVs by title or template..."
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
                            <div key={i} className="aspect-[1/1.2] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden relative animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className={cn(
                        viewMode === 'grid' 
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                            : "flex flex-col gap-4"
                    )}>
                        {filteredItems.map((item) => (
                            viewMode === 'grid' ? (
                                <div 
                                    key={item.id}
                                    className={cn(
                                        "group relative bg-white dark:bg-zinc-950 border rounded-3xl overflow-hidden hover:border-[#A600FF]/50 transition-all hover:shadow-2xl hover:shadow-[#A600FF]/5 hover:-translate-y-1",
                                        item._type === 'variant' ? "border-dashed border-[#A600FF]/30" : "border-zinc-200 dark:border-zinc-800"
                                    )}
                                >
                                    {/* Preview Simulation */}
                                    <div className="aspect-[1/1.2] bg-zinc-50 dark:bg-zinc-900 p-6 flex flex-col relative overflow-hidden group-hover:bg-[#A600FF]/[0.02] transition-colors border-b border-zinc-100 dark:border-zinc-900">
                                        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.12] transition-opacity">
                                            <img src="/cv-placeholder.png" alt="" className="w-full h-full object-cover" />
                                        </div>
                                        
                                        {/* Type Badge */}
                                        <div className="absolute top-4 right-4 z-20">
                                            {item._type === 'variant' ? (
                                                <Badge className="bg-[#A600FF] text-white shadow-lg shadow-[#A600FF]/25">Variant</Badge>
                                            ) : (
                                                <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">Base</Badge>
                                            )}
                                        </div>

                                        <div className="space-y-2 opacity-30 group-hover:opacity-60 transition-opacity relative z-10">
                                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                                            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                                            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                                            <div className="pt-4 h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                                            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                                            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                                        </div>
                                        
                                        {/* Quick Actions Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] z-30">
                                            <div className="flex flex-col gap-2 scale-90 group-hover:scale-100 transition-transform">
                                                <button 
                                                    onClick={() => handleEdit(item)}
                                                    className="bg-[#A600FF] text-white px-6 py-3 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] border border-[#A600FF]"
                                                >
                                                    Open Editor
                                                </button>
                                                {item._type === 'resume' && (
                                                    <button 
                                                        onClick={() => handleCreateVariant(item as Resume)}
                                                        className="bg-white dark:bg-zinc-950 text-[#A600FF] px-6 py-3 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] border border-zinc-100 dark:border-zinc-800"
                                                    >
                                                        Create Variant
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {'isDefault' in item && item.isDefault && (
                                            <div className="absolute top-4 left-4 p-2 bg-amber-100/80 dark:bg-amber-900/40 backdrop-blur-md rounded-xl text-amber-600 dark:text-amber-400">
                                                <Star className="w-4 h-4 fill-current" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer info */}
                                    <div className="p-5 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-1">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1 pr-2 truncate">
                                                <h3 className="font-black text-zinc-900 dark:text-zinc-50 truncate leading-tight italic">
                                                    {item.title}
                                                </h3>
                                                {item._type === 'variant' && 'jobApplications' in item && (item.jobApplications as any[])?.length > 0 && (
                                                    <p className="text-[9px] font-bold text-[#A600FF] uppercase truncate">
                                                        Linked to {(item.jobApplications as any[])[0].company}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                {'isDefault' in item && !item.isDefault && (
                                                    <button 
                                                        onClick={() => handleSetDefault(item.id)}
                                                        className="p-2 text-zinc-400 hover:text-amber-500 transition-colors"
                                                        title="Set as Default"
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(item)}
                                                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                                    title={`Delete ${item._type}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                                            <Clock className="w-3 h-3" />
                                            Updated recently
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    key={item.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border rounded-2xl hover:border-[#A600FF]/50 transition-all group",
                                        item._type === 'variant' ? "border-dashed border-[#A600FF]/30" : "border-zinc-200 dark:border-zinc-800"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl group-hover:bg-[#A600FF]/10 transition-colors relative">
                                            <FileText className="w-5 h-5 text-[#A600FF]" />
                                            {item._type === 'variant' && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#A600FF] rounded-full border-2 border-white dark:border-zinc-950" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-zinc-900 dark:text-zinc-50 italic flex items-center gap-2">
                                                {item.title}
                                                {'isDefault' in item && item.isDefault && <Star className="w-3 h-3 text-amber-500 fill-current" />}
                                                {item._type === 'variant' && (
                                                    <Badge className="bg-[#A600FF]/10 text-[#A600FF] border-none ml-1">Variant</Badge>
                                                )}
                                            </h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-0.5">
                                                {item._type === 'variant' ? 'Tailored Version' : `Template: ${item.template || 'Classic'}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item._type === 'resume' && (
                                            <button 
                                                onClick={() => handleCreateVariant(item as Resume)}
                                                className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#A600FF] transition-colors"
                                            >
                                                + Variant
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#A600FF] bg-[#A600FF]/5 rounded-xl hover:bg-[#A600FF]/10 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        {'isDefault' in item && !item.isDefault && (
                                            <button 
                                                onClick={() => handleSetDefault(item.id)}
                                                className="p-2 text-zinc-400 hover:text-amber-500 transition-colors"
                                            >
                                                <Star className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(item)}
                                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}

                        {/* Empty/Add Card - only in grid mode or show as a simple row in list mode */}
                        {viewMode === 'grid' ? (
                            <div 
                                onClick={handleCreateNew}
                                className="aspect-[1/1.2] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-4 text-zinc-400 hover:text-[#A600FF] hover:border-[#A600FF]/50 transition-all group cursor-pointer"
                            >
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl group-hover:bg-[#A600FF]/10 transition-colors">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <span className="font-bold text-sm tracking-tight italic">New Resume</span>
                            </div>
                        ) : (
                            <button 
                                onClick={handleCreateNew}
                                className="flex items-center gap-3 p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 hover:text-[#A600FF] hover:border-[#A600FF]/50 transition-all group w-full justify-center"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="font-bold text-sm italic">Create New Resume</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
