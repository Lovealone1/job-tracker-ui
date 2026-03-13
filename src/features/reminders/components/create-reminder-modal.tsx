'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Plus, Bell, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ReminderType, CreateReminderDto } from '@/types/reminder';
import { InterviewSummary } from '@/types/interview';
import { cn } from '@/lib/utils';
import { toCOWallClockISO, fromCOWallClock, nowCOWallClock } from '@/lib/date-utils';

interface CreateReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateReminderDto) => Promise<void>;
    isLoading?: boolean;
    interviews: InterviewSummary[];
    interviewsLoading?: boolean;
    initialDate?: Date;
}

const typeOptions = Object.values(ReminderType).map((t) => ({
    label: t.replace(/_/g, ' '),
    value: t,
}));

export function CreateReminderModal({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isLoading, 
    interviews, 
    interviewsLoading,
    initialDate 
}: CreateReminderModalProps) {
    const [form, setForm] = useState<Partial<CreateReminderDto>>({
        type: ReminderType.FOLLOW_UP,
        dueAt: initialDate ? toCOWallClockISO(initialDate) : nowCOWallClock(),
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showInterviews, setShowInterviews] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setForm({
                type: ReminderType.FOLLOW_UP,
                dueAt: initialDate ? toCOWallClockISO(initialDate) : nowCOWallClock(),
            });
            setSearchTerm('');
            setShowInterviews(false);
            setErrors({});
        }
    }, [isOpen, initialDate]);

    if (!isOpen) return null;

    const filteredInterviews = interviews.filter(i => {
        const title = i.jobApplication?.title?.toLowerCase() || '';
        const company = i.jobApplication?.company?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return title.includes(search) || company.includes(search);
    });

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const n = { ...prev };
                delete n[name];
                return n;
            });
        }
    };

    const handleSelectInterview = (interview: InterviewSummary) => {
        setForm(prev => ({
            ...prev,
            interviewId: interview.id,
            jobApplicationId: interview.jobApplicationId,
            title: prev.title || `Follow up: ${interview.jobApplication?.title} @ ${interview.jobApplication?.company}`
        }));
        setSearchTerm(`${interview.jobApplication?.title} @ ${interview.jobApplication?.company}`);
        setShowInterviews(false);
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.title) e.title = 'Required';
        if (!form.type) e.type = 'Required';
        if (!form.dueAt) e.dueAt = 'Required';
        if (!form.interviewId) e.interviewId = 'Please select an interview';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;
        await onSubmit(form as CreateReminderDto);
    };

    const inputClass = (name: string) => cn(
        "w-full px-3 py-2 bg-white dark:bg-zinc-950 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF] transition-colors disabled:opacity-50",
        errors[name] ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#A600FF]/10 rounded-xl">
                            <Plus className="w-5 h-5 text-[#A600FF]" />
                        </div>
                        <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Create Reminder</h2>
                    </div>
                    {!isLoading && (
                        <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Interview Selection (Combobox) */}
                    <div className="relative space-y-1.5">
                        <label className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Select Interview *</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder={interviewsLoading ? "Loading interviews..." : "Search interview or company..."}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowInterviews(true);
                                }}
                                onFocus={() => setShowInterviews(true)}
                                className={cn(inputClass('interviewId'), "pl-10")}
                                disabled={isLoading || interviewsLoading}
                            />
                        </div>
                        
                        {showInterviews && !interviewsLoading && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto scrollbar-hide">
                                {filteredInterviews.length > 0 ? (
                                    filteredInterviews.map((interview) => (
                                        <button
                                            key={interview.id}
                                            type="button"
                                            onClick={() => handleSelectInterview(interview)}
                                            className="w-full px-4 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col gap-0.5"
                                        >
                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 italic">
                                                {interview.jobApplication?.title}
                                            </span>
                                            <span className="text-[10px] text-zinc-500 uppercase font-black">
                                                {interview.jobApplication?.company} — {format(new Date(interview.scheduledAt), 'MMM d, h:mm a')}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-xs text-zinc-500 text-center italic">No interviews found</div>
                                )}
                            </div>
                        )}
                        {errors.interviewId && <span className="text-xs text-red-500 font-bold">{errors.interviewId}</span>}
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Reminder Title *</label>
                        <input
                            type="text"
                            placeholder="e.g. Follow up after technical interview"
                            value={form.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={inputClass('title')}
                            disabled={isLoading}
                        />
                        {errors.title && <span className="text-xs text-red-500 font-bold">{errors.title}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Type *</label>
                            <select
                                value={form.type || ''}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className={inputClass('type')}
                                disabled={isLoading}
                            >
                                {typeOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Due Date *</label>
                            <input
                                type="datetime-local"
                                value={form.dueAt ? format(fromCOWallClock(form.dueAt), "yyyy-MM-dd'T'HH:mm") : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) {
                                        handleChange('dueAt', '');
                                        return;
                                    }
                                    
                                    // Parse local string and convert to CO Wall Clock ISO
                                    const date = new Date(val);
                                    if (!isNaN(date.getTime())) {
                                        handleChange('dueAt', toCOWallClockISO(date));
                                    }
                                }}
                                className={inputClass('dueAt')}
                                disabled={isLoading}
                                step="60"
                            />
                            {errors.dueAt && <span className="text-xs text-red-500 font-bold">{errors.dueAt}</span>}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Description</label>
                        <textarea
                            placeholder="Add any specific details here..."
                            value={form.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                            className={cn(inputClass('description'), "resize-none h-24")}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isLoading} 
                            className="px-6 py-2 text-xs font-black uppercase tracking-widest text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="px-6 py-2 text-xs font-black uppercase tracking-widest text-white bg-[#A600FF] rounded-xl hover:bg-[#8B00D6] transition-all flex items-center gap-2 shadow-xl shadow-[#A600FF]/25 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Create Reminder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
