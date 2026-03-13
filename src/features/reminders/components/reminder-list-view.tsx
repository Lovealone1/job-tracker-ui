'use client';

import React, { useState, useMemo } from 'react';
import { useReminders, useRemindersByJobApplication, useRemindersByInterview } from '../hooks/use-reminders';
import { ReminderCard } from './reminder-card';
import { ReminderPaginationQuery, ReminderSummary } from '@/types/reminder';
import { ChevronLeft, ChevronRight, Inbox, Loader2 } from 'lucide-react';
import { ReminderDetailsModal } from './reminder-details-modal';
import { FilterState } from './reminder-filters';

interface ReminderListViewProps {
    filters: FilterState;
}

export function ReminderListView({ filters }: ReminderListViewProps) {
    const [page, setPage] = useState(1);
    const limit = 8;
    const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);

    // Determine which hook/query to use based on filters
    const query = useMemo(() => {
        if (filters.type === 'next-14') {
            const now = new Date();
            const future = new Date();
            future.setDate(now.getDate() + 14);
            return {
                from: now.toISOString(),
                to: future.toISOString(),
                status: undefined,
                page,
                limit
            } as ReminderPaginationQuery;
        }
        return { page, limit } as ReminderPaginationQuery;
    }, [filters, page]);

    // Use regular paginated hook for 'all' and 'next-14'
    const remindersQuery = useReminders(query);
    
    // Special hooks for Job and Interview (they don't support pagination as per current service implementation)
    const jobRemindersQuery = useRemindersByJobApplication(filters.id || '');
    const interviewRemindersQuery = useRemindersByInterview(filters.id || '');

    // Resolve which data to show
    const getActiveQuery = () => {
        if (filters.type === 'job') return jobRemindersQuery;
        if (filters.type === 'interview') return interviewRemindersQuery;
        return remindersQuery;
    };

    const activeQuery = getActiveQuery();
    const isSpecial = filters.type === 'job' || filters.type === 'interview';
    
    // Data normalization
    const reminders = useMemo<ReminderSummary[]>(() => {
        if (!activeQuery.data) return [];
        // Specialized hooks return raw array, main hook returns paginated object
        if (isSpecial) return (activeQuery.data as ReminderSummary[]);
        return (activeQuery.data as any).data || [];
    }, [activeQuery.data, isSpecial]);

    const totalPages = isSpecial ? 1 : (activeQuery.data as any)?.meta?.totalPages || 1;

    if (activeQuery.isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#A600FF] animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Retrieving Records...</p>
            </div>
        );
    }

    if (reminders.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mb-8 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                    <Inbox className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 italic tracking-tighter">No Reminders Found</h3>
                <p className="max-w-[320px] text-sm text-zinc-500 dark:text-zinc-400 mt-3 font-medium leading-relaxed">
                    There are no reminders matching your current filter. Head back to the calendar view for full scope.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {reminders.map((reminder: ReminderSummary) => (
                        <ReminderCard 
                            key={reminder.id} 
                            reminder={reminder} 
                            onClick={setSelectedReminderId} 
                        />
                    ))}
                </div>
            </div>

            {/* Pagination Box */}
            {!isSpecial && totalPages > 1 && (
                <div className="px-8 py-6 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl disabled:opacity-30 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-95 shadow-xl shadow-zinc-200/20 dark:shadow-none"
                    >
                        <ChevronLeft size={16} />
                        Prev
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="h-1 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#A600FF] transition-all duration-500" 
                                style={{ width: `${(page / totalPages) * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">
                            Page {page} <span className="text-zinc-300 dark:text-zinc-600">/</span> {totalPages}
                        </span>
                    </div>

                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl disabled:opacity-30 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-95 shadow-xl shadow-zinc-200/20 dark:shadow-none"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Details Modal */}
            {selectedReminderId && (
                <ReminderDetailsModal 
                    isOpen={true}
                    onClose={() => setSelectedReminderId(null)}
                    reminderId={selectedReminderId}
                    onDeleted={() => setSelectedReminderId(null)}
                />
            )}
        </div>
    );
}
