'use client';

import React from 'react';
import { X, Calendar } from 'lucide-react';
import { JobApplicationStatus, Priority } from '@/types/job-application';
import { cn } from '@/lib/utils';

export interface ApplicationFilters {
    source: string;
    priority: Priority | '';
    status: JobApplicationStatus | '';
    dateFrom: string;
    dateTo: string;
}

interface AdvancedFiltersBarProps {
    isOpen: boolean;
    filters: ApplicationFilters;
    onFilterChange: (name: string, value: any) => void;
    onClear: () => void;
}

export function AdvancedFiltersBar({ isOpen, filters, onFilterChange, onClear }: AdvancedFiltersBarProps) {
    if (!isOpen) return null;

    const inputClass = "w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF] transition-all";

    return (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
                </div>
                <button 
                    onClick={onClear}
                    className="text-xs font-bold text-[#A600FF] hover:text-[#8B00D6] transition-colors flex items-center gap-1"
                >
                    <X size={14} />
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Source Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Source</label>
                    <input
                        type="text"
                        placeholder="e.g. LinkedIn"
                        value={filters.source}
                        onChange={(e) => onFilterChange('source', e.target.value)}
                        className={inputClass}
                    />
                </div>

                {/* Priority Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Priority</label>
                    <select
                        value={filters.priority}
                        onChange={(e) => onFilterChange('priority', e.target.value)}
                        className={inputClass}
                    >
                        <option value="">All Priorities</option>
                        {Object.values(Priority).map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className={inputClass}
                    >
                        <option value="">All Statuses</option>
                        {Object.values(JobApplicationStatus).map(v => (
                            <option key={v} value={v}>{(v.charAt(0) + v.slice(1).toLowerCase()).replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>

                {/* Date Range */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Date Range</label>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                                className={cn(inputClass, "pl-8 pr-2")}
                            />
                            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <span className="text-zinc-400">—</span>
                        <div className="relative flex-1">
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => onFilterChange('dateTo', e.target.value)}
                                className={cn(inputClass, "pl-8 pr-2")}
                            />
                            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
