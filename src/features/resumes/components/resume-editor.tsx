'use client';

import React, { useState } from 'react';
import { 
    User, 
    Briefcase, 
    GraduationCap, 
    Code, 
    Heart, 
    Layers, 
    Eye, 
    FileText, 
    Download, 
    Settings,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Type,
    RefreshCcw,
    Lock,
    Menu,
    X as CloseIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Resume, ResumeVariant } from '@/types/resume';
import { resumeToRenderCVYaml } from '../utils/latex-utils';
import { resumeService } from '@/services/resume-service';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ResumeEditorProps {
    initialData?: Resume | ResumeVariant;
    onSave: (data: any, options?: { exit?: boolean }) => Promise<void>;
}

type EditorSection = 'personal' | 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'others';

export function ResumeEditor({ initialData, onSave }: ResumeEditorProps) {
    const isVariant = initialData && 'resumeId' in initialData;
    
    const [activeSection, setActiveSection] = useState<EditorSection>('personal');
    const [viewMode, setViewMode] = useState<'real' | 'yaml'>('yaml');
    const [renderLoading, setRenderLoading] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [resumeData, setResumeData] = useState<any>(() => {
        const defaults = {
            title: 'My Resume',
            resumeName: 'Jane Doe',
            personalInfo: { email: '', phone: '', location: '', linkedIn: '', github: '', website: '' },
            summary: '',
            education: [],
            experience: [],
            projects: [],
            skills: {},
            others: {}
        };
        
        if (!initialData) return defaults;
        
        const experience = (initialData.experience || []).map((exp: any) => {
            const summary = exp.summary || exp.description || '';
            const achievements = Array.isArray(exp.achievements) ? exp.achievements.join('\n') : 
                               (Array.isArray(exp.highlights) ? exp.highlights.join('\n') : (exp.achievements || exp.highlights || ''));
            return {
                ...exp,
                summary,
                achievements
            };
        });
        
        return {
            ...defaults,
            ...initialData,
            experience,
            template: initialData?.template || 'classic',
            personalInfo: {
                ...defaults.personalInfo,
                ...(initialData?.personalInfo || {})
            }
        };
    });

    const RENDER_CV_THEMES = [
        { id: 'classic', label: 'Classic' },
        { id: 'engineeringclassic', label: 'Engineering Classic' },
        { id: 'engineeringresumes', label: 'Engineering Resumes' },
        { id: 'moderncv', label: 'Modern CV' },
        { id: 'sb2nov', label: 'SB2Nov' },
    ];

    const sections = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: Code },
        { id: 'skills', label: 'Skills', icon: Layers },
        { id: 'others', label: 'Custom Sections', icon: Settings },
    ];

    return (
        <div className="flex flex-col h-full md:h-[calc(100vh-72px)] overflow-hidden bg-background">
            {/* Mobile Sticky Header */}
            <div className="md:hidden sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsMobileNavOpen(true)}
                        className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl"
                    >
                        <Menu className="w-5 h-5 text-[#A600FF]" />
                    </button>
                    <div>
                        <h1 className="text-sm font-black truncate max-w-[150px]">{resumeData.title}</h1>
                        <div className="flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#A600FF]" />
                             <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
                                {sections.find(s => s.id === activeSection)?.label}
                             </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                        onClick={async () => {
                            try {
                                toast.loading('Generating PDF...', { id: 'pdf-render' });
                                const blob = await resumeService.renderPdfLive(resumeData);
                                const url = window.URL.createObjectURL(blob);
                                window.open(url, '_blank');
                                toast.success('PDF Generated', { id: 'pdf-render' });
                            } catch (error) {
                                toast.error('Failed to generate PDF', { id: 'pdf-render' });
                            }
                        }}
                        className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl"
                        title="Preview PDF"
                    >
                        <Eye className="w-4 h-4 text-zinc-600" />
                    </button>
                    <button 
                        onClick={() => onSave(resumeData, { exit: false })}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                        Save
                    </button>
                    <button 
                        onClick={() => onSave(resumeData, { exit: true })}
                        className="px-3 py-2 bg-[#A600FF] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#A600FF]/25 transition-all active:scale-95"
                    >
                        Exit
                    </button>
                </div>
            </div>

            {/* Top Toolbar (Desktop Only) */}
            <div className="hidden md:flex h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#A600FF] rounded-lg">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <input 
                        className="bg-transparent border-none focus:ring-0 font-bold text-sm outline-none w-64"
                        value={resumeData.title}
                        onChange={(e) => setResumeData({...resumeData, title: e.target.value})}
                        placeholder="Resume Title..."
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Theme Selector */}
                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl px-3 py-1 mr-2 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all">
                        <Type className="w-3 h-3 text-zinc-400" />
                        <select 
                            className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-[#A600FF] outline-none cursor-pointer appearance-none pr-4"
                            value={resumeData.template}
                            onChange={(e) => setResumeData({...resumeData, template: e.target.value})}
                        >
                            {RENDER_CV_THEMES.map(theme => (
                                <option key={theme.id} value={theme.id} className="bg-white dark:bg-zinc-950 text-foreground uppercase">
                                    {theme.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-zinc-400 ml-[-12px] pointer-events-none" />
                    </div>

                    <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 gap-1 mr-4">
                        <button 
                            onClick={async () => {
                                setViewMode('real');
                                setRenderLoading(true);
                                try {
                                    const response = await resumeService.renderPreviewLive(resumeData);
                                    
                                    // Extract page count from custom header
                                    const pages = parseInt(response.headers['x-page-count'] || '1', 10);
                                    setPageCount(pages);
                                    
                                    if (previewUrl) URL.revokeObjectURL(previewUrl); 
                                    const blob = new Blob([response.data], { type: 'image/png' });
                                    setPreviewUrl(URL.createObjectURL(blob));
                                } catch (err) {
                                    toast.error('Failed to generate real preview');
                                    setViewMode('yaml');
                                } finally {
                                    setRenderLoading(false);
                                }
                            }}
                            className={cn(
                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center", 
                                viewMode === 'real' ? "bg-white dark:bg-zinc-950 text-[#A600FF] shadow-sm" : "text-zinc-400"
                            )}
                        >
                            {renderLoading ? (
                                <Loader2 className="w-2 h-2 animate-spin" />
                            ) : (
                                <RefreshCcw className={cn("w-2 h-2", viewMode === 'real' ? "text-[#A600FF]" : "text-zinc-400")} />
                            )}
                            {viewMode === 'real' && !previewUrl ? 'Render' : 'Update'}
                        </button>
                        <button 
                            onClick={() => setViewMode('yaml')}
                            className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'yaml' ? "bg-white dark:bg-zinc-950 text-[#A600FF] shadow-sm" : "text-zinc-400")}
                        >
                            YAML Source
                        </button>
                    </div>

                    <button 
                        onClick={async () => {
                            try {
                                toast.loading('Generating PDF...', { id: 'pdf-render' });
                                const blob = await resumeService.renderPdfLive(resumeData);
                                const url = window.URL.createObjectURL(blob);
                                window.open(url, '_blank');
                                toast.success('PDF Generated', { id: 'pdf-render' });
                            } catch (error) {
                                toast.error('Failed to generate PDF', { id: 'pdf-render' });
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Preview PDF
                    </button>
                    <button 
                        onClick={() => onSave(resumeData, { exit: false })}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                        Save
                    </button>
                    <button 
                        onClick={() => onSave(resumeData, { exit: true })}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#A600FF] text-white text-xs font-bold hover:bg-[#8B00D6] shadow-lg shadow-[#A600FF]/20 transition-all active:scale-95"
                    >
                        Save and Exit
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Left: Navigation Sidebar (Hidden on mobile, uses slide-over) */}
                <div className={cn(
                    "fixed inset-0 z-[60] md:relative md:z-0 md:inset-auto md:flex w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex-col shrink-0 transition-transform duration-300",
                    isMobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}>
                    {/* Mobile Sidebar Header */}
                    <div className="md:hidden flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <h2 className="text-xl font-black italic">Sections</h2>
                        <button onClick={() => setIsMobileNavOpen(false)} className="p-2">
                            <CloseIcon className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>

                    <div className="p-4 space-y-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-900/50 h-full">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        setActiveSection(section.id as EditorSection);
                                        setIsMobileNavOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        activeSection === section.id 
                                            ? "bg-white dark:bg-zinc-950 text-[#A600FF] shadow-sm border border-zinc-200 dark:border-zinc-800"
                                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", activeSection === section.id ? "text-[#A600FF]" : "text-zinc-400")} />
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile Sidebar Footer (Save Button) */}
                    <div className="md:hidden p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
                         <button 
                            onClick={() => {
                                onSave(resumeData, { exit: false });
                                setIsMobileNavOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                         >
                            Save Changes
                         </button>
                    </div>
                </div>

                {/* Mobile Backdrop */}
                {isMobileNavOpen && (
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
                        onClick={() => setIsMobileNavOpen(false)}
                    />
                )}

                {/* Center: Form Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-white dark:bg-zinc-950 custom-scrollbar">
                    <div className="max-w-xl mx-auto space-y-8">
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h2 className="text-2xl md:text-3xl font-black tracking-tighter italic">
                                    {sections.find(s => s.id === activeSection)?.label}
                                </h2>
                                {isVariant && ['personal', 'summary', 'education'].includes(activeSection) && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-800 w-fit">
                                        <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Locked Sections</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-zinc-500 text-xs md:text-sm">
                                {isVariant && ['personal', 'summary', 'education'].includes(activeSection)
                                    ? "These sections are inherited from the base resume and cannot be modified in a variant."
                                    : `Fill in the details for your resume ${activeSection.toLowerCase()}.`}
                            </p>
                        </div>

                        {/* Rendering Active Form Section */}
                        <div className="space-y-6 pt-6">
                            {activeSection === 'personal' && (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                                        <input 
                                            className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-[#A600FF] p-4 rounded-2xl outline-none transition-all disabled:opacity-50"
                                            value={resumeData.resumeName}
                                            onChange={(e) => setResumeData({...resumeData, resumeName: e.target.value})}
                                            disabled={isVariant}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                                        <input 
                                            className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-[#A600FF] p-4 rounded-2xl outline-none transition-all"
                                            value={resumeData.personalInfo?.email || ''}
                                            onChange={(e) => setResumeData({...resumeData, personalInfo: {...(resumeData.personalInfo || {}), email: e.target.value}})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone Number</label>
                                        <input 
                                            className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-[#A600FF] p-4 rounded-2xl outline-none transition-all"
                                            placeholder="+1 234 567 890"
                                            value={resumeData.personalInfo?.phone || ''}
                                            onChange={(e) => setResumeData({...resumeData, personalInfo: {...(resumeData.personalInfo || {}), phone: e.target.value}})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Location</label>
                                        <input 
                                            className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-[#A600FF] p-4 rounded-2xl outline-none transition-all"
                                            value={resumeData.personalInfo?.location || ''}
                                            onChange={(e) => setResumeData({...resumeData, personalInfo: {...(resumeData.personalInfo || {}), location: e.target.value}})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Personal Website</label>
                                        <input 
                                            className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-[#A600FF] p-4 rounded-2xl outline-none transition-all"
                                            placeholder="https://..."
                                            value={resumeData.personalInfo?.website || ''}
                                            onChange={(e) => setResumeData({...resumeData, personalInfo: {...(resumeData.personalInfo || {}), website: e.target.value}})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">LinkedIn URL</label>
                                        <input 
                                            className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-[#A600FF] p-4 rounded-2xl outline-none transition-all"
                                            placeholder="https://linkedin.com/in/..."
                                            value={resumeData.personalInfo?.linkedIn || ''}
                                            onChange={(e) => setResumeData({...resumeData, personalInfo: {...(resumeData.personalInfo || {}), linkedIn: e.target.value}})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">GitHub URL</label>
                                        <input 
                                            className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-[#A600FF] p-4 rounded-2xl outline-none transition-all disabled:opacity-50"
                                            placeholder="https://github.com/..."
                                            value={resumeData.personalInfo?.github || ''}
                                            onChange={(e) => setResumeData({...resumeData, personalInfo: {...(resumeData.personalInfo || {}), github: e.target.value}})}
                                            disabled={isVariant}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'summary' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Career Summary</label>
                                    <textarea 
                                        rows={8}
                                        className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:border-[#A600FF] p-4 rounded-2xl outline-none transition-all resize-none disabled:opacity-50"
                                        placeholder="Write a brief professional summary..."
                                        value={resumeData.summary}
                                        onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
                                        disabled={isVariant}
                                    />
                                </div>
                            )}

                            {activeSection === 'education' && (
                                <div className="space-y-6">
                                    {resumeData.education.map((edu: any, index: number) => (
                                        <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 relative">
                                            <button 
                                                onClick={() => {
                                                    const newEdu = [...resumeData.education];
                                                    newEdu.splice(index, 1);
                                                    setResumeData({...resumeData, education: newEdu});
                                                }}
                                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1 col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Institution</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={edu.institution}
                                                        onChange={(e) => {
                                                            const newEdu = [...resumeData.education];
                                                            newEdu[index] = { ...newEdu[index], institution: e.target.value };
                                                            setResumeData({...resumeData, education: newEdu});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Degree</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={edu.degree}
                                                        onChange={(e) => {
                                                            const newEdu = [...resumeData.education];
                                                            newEdu[index] = { ...newEdu[index], degree: e.target.value };
                                                            setResumeData({...resumeData, education: newEdu});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Field of Study</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={edu.fieldOfStudy}
                                                        onChange={(e) => {
                                                            const newEdu = [...resumeData.education];
                                                            newEdu[index] = { ...newEdu[index], fieldOfStudy: e.target.value };
                                                            setResumeData({...resumeData, education: newEdu});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Dates (Start - End)</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all text-center"
                                                            placeholder="Year Start"
                                                            value={edu.startDate}
                                                            onChange={(e) => {
                                                                const newEdu = [...resumeData.education];
                                                                newEdu[index] = { ...newEdu[index], startDate: e.target.value };
                                                                setResumeData({...resumeData, education: newEdu});
                                                            }}
                                                        />
                                                        <input 
                                                            className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all text-center"
                                                            placeholder="Year End"
                                                            value={edu.endDate}
                                                            onChange={(e) => {
                                                                const newEdu = [...resumeData.education];
                                                                newEdu[index] = { ...newEdu[index], endDate: e.target.value };
                                                                setResumeData({...resumeData, education: newEdu});
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {!isVariant && (
                                        <button 
                                            onClick={() => setResumeData({...resumeData, education: [...resumeData.education, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }]})}
                                            className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex items-center justify-center gap-2 text-zinc-400 hover:text-[#A600FF] hover:border-[#A600FF]/50 transition-all font-bold"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add Education
                                        </button>
                                    )}
                                </div>
                            )}

                            {activeSection === 'experience' && (
                                <div className="space-y-6">
                                    {resumeData.experience.map((exp: any, index: number) => (
                                        <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 relative">
                                            <button 
                                                onClick={() => {
                                                    const newExp = [...resumeData.experience];
                                                    newExp.splice(index, 1);
                                                    setResumeData({...resumeData, experience: newExp});
                                                }}
                                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Company</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={exp.company}
                                                        onChange={(e) => {
                                                            const newExp = [...resumeData.experience];
                                                            newExp[index] = { ...newExp[index], company: e.target.value };
                                                            setResumeData({...resumeData, experience: newExp});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Role</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={exp.role}
                                                        onChange={(e) => {
                                                            const newExp = [...resumeData.experience];
                                                            newExp[index] = { ...newExp[index], role: e.target.value };
                                                            setResumeData({...resumeData, experience: newExp});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Start Date</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={exp.startDate}
                                                        onChange={(e) => {
                                                            const newExp = [...resumeData.experience];
                                                            newExp[index] = { ...newExp[index], startDate: e.target.value };
                                                            setResumeData({...resumeData, experience: newExp});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">End Date</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={exp.endDate}
                                                        placeholder="Present"
                                                        onChange={(e) => {
                                                            const newExp = [...resumeData.experience];
                                                            newExp[index] = { ...newExp[index], endDate: e.target.value };
                                                            setResumeData({...resumeData, experience: newExp});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Job Summary (Optional)</label>
                                                    <textarea 
                                                        rows={2}
                                                        placeholder="General description of your role and impact..."
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all resize-none"
                                                        value={exp.summary}
                                                        onChange={(e) => {
                                                            const newExp = [...resumeData.experience];
                                                            newExp[index] = { ...newExp[index], summary: e.target.value };
                                                            setResumeData({...resumeData, experience: newExp});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Key Achievements (Highlights)</label>
                                                        <span className="text-[8px] text-zinc-400 font-bold uppercase">One per line</span>
                                                    </div>
                                                    <textarea 
                                                        rows={4}
                                                        placeholder="Developed core features...&#10;Led a team of 10...&#10;Optimized performance by 40%..."
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all resize-none font-mono"
                                                        value={exp.achievements}
                                                        onChange={(e) => {
                                                            const newExp = [...resumeData.experience];
                                                            newExp[index] = { ...newExp[index], achievements: e.target.value };
                                                            setResumeData({...resumeData, experience: newExp});
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => setResumeData({...resumeData, experience: [...resumeData.experience, { company: '', role: '', startDate: '', endDate: '', summary: '', achievements: '' }]})}
                                        className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex items-center justify-center gap-2 text-zinc-400 hover:text-[#A600FF] hover:border-[#A600FF]/50 transition-all font-bold"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Job Experience
                                    </button>
                                </div>
                            )}

                            {activeSection === 'projects' && (
                                <div className="space-y-6">
                                    {resumeData.projects.map((proj: any, index: number) => (
                                        <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 relative">
                                            <button 
                                                onClick={() => {
                                                    const newProj = [...resumeData.projects];
                                                    newProj.splice(index, 1);
                                                    setResumeData({...resumeData, projects: newProj});
                                                }}
                                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1 col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Project Name</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={proj.name}
                                                        onChange={(e) => {
                                                            const newProj = [...resumeData.projects];
                                                            newProj[index].name = e.target.value;
                                                            setResumeData({...resumeData, projects: newProj});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={proj.description}
                                                        onChange={(e) => {
                                                            const newProj = [...resumeData.projects];
                                                            newProj[index].description = e.target.value;
                                                            setResumeData({...resumeData, projects: newProj});
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Technologies (comma separated)</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={proj.technologies?.join(', ') || ''}
                                                        onChange={(e) => {
                                                            const newProj = [...resumeData.projects];
                                                            newProj[index].technologies = e.target.value.split(',').map(s => s.trim());
                                                            setResumeData({...resumeData, projects: newProj});
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => setResumeData({...resumeData, projects: [...resumeData.projects, { name: '', description: '', technologies: [] }]})}
                                        className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex items-center justify-center gap-2 text-zinc-400 hover:text-[#A600FF] hover:border-[#A600FF]/50 transition-all font-bold"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Project
                                    </button>
                                </div>
                            )}

                            {activeSection === 'skills' && (
                                <div className="space-y-6">
                                    {Object.entries(resumeData.skills || {}).map(([category, items]: any, index) => (
                                        <div key={index} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 relative">
                                            <button 
                                                onClick={() => {
                                                    const newSkills = {...resumeData.skills};
                                                    delete newSkills[category];
                                                    setResumeData({...resumeData, skills: newSkills});
                                                }}
                                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category Name</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm font-bold transition-all"
                                                        value={category}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Skills (comma separated)</label>
                                                    <input 
                                                        className="w-full bg-white dark:bg-zinc-950 border border-transparent focus:border-[#A600FF] p-3 rounded-xl outline-none text-sm transition-all"
                                                        value={items.join(', ')}
                                                        onChange={(e) => {
                                                            const newSkills = {...resumeData.skills};
                                                            newSkills[category] = e.target.value.split(',').map(s => s.trim());
                                                            setResumeData({...resumeData, skills: newSkills});
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                        <input 
                                            id="new-skill-category"
                                            className="flex-1 bg-white dark:bg-zinc-950 border-none p-3 rounded-xl outline-none text-sm"
                                            placeholder="New Category (e.g. Languages)"
                                        />
                                        <button 
                                            onClick={() => {
                                                const input = document.getElementById('new-skill-category') as HTMLInputElement;
                                                if (input.value) {
                                                    setResumeData({...resumeData, skills: {...resumeData.skills, [input.value]: []}});
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-6 py-2 bg-[#A600FF] text-white rounded-xl text-xs font-bold"
                                        >
                                            Add Category
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'others' && (
                                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl opacity-50">
                                    <Plus className="w-8 h-8 text-[#A600FF] mb-4" />
                                    <p className="text-zinc-500 font-bold">Custom sections coming soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Live Preview (Hidden on mobile) */}
                <div className="hidden md:block w-[500px] border-l border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/30 overflow-y-auto shrink-0 select-none">
                    <div className="p-8">
                        {viewMode === 'real' ? (
                            <div className="flex flex-col gap-8 pb-8">
                                {renderLoading ? (
                                    <div className="bg-white dark:bg-zinc-950 aspect-[1/1.41] shadow-2xl rounded-sm overflow-hidden flex flex-col relative">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-10 text-center px-4">
                                            <Loader2 className="w-8 h-8 text-[#A600FF] animate-spin mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#A600FF] animate-pulse">Running RenderCV Engine...</p>
                                        </div>
                                    </div>
                                ) : previewUrl ? (
                                    Array.from({ length: pageCount }).map((_, i) => (
                                        <div key={i} className="bg-white dark:bg-zinc-950 aspect-[1/1.41] shadow-2xl rounded-sm overflow-hidden flex flex-col relative group">
                                            <img 
                                                // Currently we only have one previewUrl from the POST response
                                                // For subsequent pages, we'd need a way to fetch them.
                                                // To keep it simple for now, if pageCount > 1, we show a placeholder or we fetch.
                                                // Let's assume the render POST returned page 1.
                                                src={i === 0 ? previewUrl : `${previewUrl}#page=${i+1}`} 
                                                alt={`Resume Preview Page ${i + 1}`} 
                                                className="w-full h-full object-contain"
                                                onError={() => toast.error('Check if LaTeX is installed on the server')}
                                            />
                                            <div className="absolute top-4 right-4 bg-zinc-900/50 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                PAGE {i + 1} / {pageCount}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white dark:bg-zinc-950 aspect-[1/1.41] shadow-2xl rounded-sm flex items-center justify-center text-zinc-400 text-sm italic">
                                        Failed to load preview.
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* RenderCV YAML Source View */
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 aspect-[1/1.41] shadow-2xl rounded-sm p-8 overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">RenderCV YAML Source</span>
                                </div>
                                <pre className="flex-1 overflow-auto text-[10px] font-mono text-zinc-600 dark:text-zinc-300 leading-relaxed scrollbar-hide flex flex-col">
                                    {resumeToRenderCVYaml(resumeData)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
