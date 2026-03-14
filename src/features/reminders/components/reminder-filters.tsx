'use client';

import React from 'react';
import { Filter, Calendar as CalendarIcon, Briefcase, CalendarDays, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApplications } from '@/features/applications/hooks/use-applications';
import { useInterviews } from '@/features/interviews/hooks/use-interviews';

export type ReminderFilterType = 'all' | 'next-14' | 'job' | 'interview';

export interface FilterState {
    type: ReminderFilterType;
    id?: string;
}

interface ReminderFiltersProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    onClear: () => void;
    onClose: () => void;
}

export function ReminderFilters({ filters, onChange, onClear, onClose }: ReminderFiltersProps) {
    const { data: appsData } = useApplications({ limit: 100 });
    const { data: interviewsData } = useInterviews({ limit: 100 });

    const isFiltered = filters.type !== 'all';

    return (
        <div className="flex flex-wrap items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full sm:w-fit">
            {/* Calendar View Button (Internal 'all' type) */}
            <button
                onClick={onClear}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all transition-all",
                    !isFiltered 
                        ? "bg-white dark:bg-zinc-800 text-[#A600FF] shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
            >
                <CalendarIcon size={14} />
                Calendar
            </button>

            <div className="w-px h-4 bg-zinc-200 dark:border-zinc-800 mx-1" />

            {/* Next 14 Days */}
            <button
                onClick={() => onChange({ type: 'next-14' })}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    filters.type === 'next-14' 
                        ? "bg-[#A600FF] text-white shadow-lg shadow-[#A600FF]/25" 
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-white/5"
                )}
            >
                <CalendarDays size={14} />
                Next 14 Days
            </button>

            {/* Job Application Filter */}
            <select
                value={filters.type === 'job' ? filters.id : ''}
                onChange={(e) => onChange({ type: 'job', id: e.target.value })}
                className={cn(
                    "flex-1 sm:flex-none px-4 py-2 bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all rounded-xl",
                    filters.type === 'job' ? "bg-[#A600FF] text-white shadow-lg shadow-[#A600FF]/25" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
            >
                <option value="" disabled className="bg-zinc-900 text-white">Job Application</option>
                {appsData?.data.map(app => (
                    <option key={app.id} value={app.id} className="bg-zinc-900 text-white italic capitalize">
                        {app.company} — {app.title}
                    </option>
                ))}
            </select>

            {/* Interview Filter */}
            <select
                value={filters.type === 'interview' ? filters.id : ''}
                onChange={(e) => onChange({ type: 'interview', id: e.target.value })}
                className={cn(
                    "flex-1 sm:flex-none px-4 py-2 bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all rounded-xl",
                    filters.type === 'interview' ? "bg-[#A600FF] text-white shadow-lg shadow-[#A600FF]/25" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
            >
                <option value="" disabled className="bg-zinc-900 text-white">Interview</option>
                {interviewsData?.data.map(interview => (
                    <option key={interview.id} value={interview.id} className="bg-zinc-900 text-white italic">
                         Id: {interview.id.slice(0, 8)}... — Tech Interview
                    </option>
                ))}
            </select>

            <div className="w-px h-4 bg-zinc-200 dark:border-zinc-800 mx-1" />

            <button
                onClick={onClose}
                className="flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-[#A600FF] hover:bg-[#A600FF]/5 dark:hover:bg-[#A600FF]/10 transition-all active:scale-90"
                title="Close Filters"
            >
                <X size={16} />
            </button>
        </div>
    );
}
