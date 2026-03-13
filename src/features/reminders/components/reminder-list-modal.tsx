'use client';

import React, { useState, useEffect } from 'react';
import { X, Bell, Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ReminderSummary } from '@/types/reminder';
import { cn } from '@/lib/utils';
import { fromCOWallClock } from '@/lib/date-utils';

interface ReminderListModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date;
    reminders: ReminderSummary[];
    onSelectReminder: (reminder: ReminderSummary) => void;
}

const ITEMS_PER_PAGE = 5;

export function ReminderListModal({ 
    isOpen, 
    onClose, 
    date, 
    reminders,
    onSelectReminder
}: ReminderListModalProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when reminders list changes or modal opens
    useEffect(() => {
        if (isOpen) setCurrentPage(1);
    }, [isOpen, reminders.length]);

    if (!isOpen) return null;

    const totalPages = Math.ceil(reminders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedReminders = reminders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#A600FF]/10 rounded-xl">
                            <CalendarIcon className="w-5 h-5 text-[#A600FF]" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                {format(date, 'MMM do, yyyy')}
                            </h2>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {reminders.length} Reminders Total
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-3 max-h-[450px] overflow-y-auto scrollbar-hide space-y-2">
                    {paginatedReminders.map((reminder) => {
                        const localDate = fromCOWallClock(reminder.dueAt);
                        const isCompleted = reminder.status === 'COMPLETED';
                        
                        return (
                            <button
                                key={reminder.id}
                                onClick={() => onSelectReminder(reminder)}
                                className={cn(
                                    "w-full p-4 rounded-xl border text-left transition-all group flex items-center justify-between active:scale-[0.98] min-w-0",
                                    isCompleted 
                                        ? "bg-zinc-50 dark:bg-zinc-800/10 border-zinc-100 dark:border-zinc-800/50 opacity-60" 
                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-[#A600FF]/30 hover:shadow-lg hover:shadow-[#A600FF]/5"
                                )}
                            >
                                <div className="space-y-1 pr-4 min-w-0 flex-1">
                                    <div className="flex gap-2 items-center">
                                        <span className={cn(
                                            "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                            isCompleted ? "bg-green-500" : "bg-[#A600FF] shadow-sm shadow-[#A600FF]/50"
                                        )} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 truncate">
                                            {format(localDate, 'hh:mm a')} — {reminder.type.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <h3 className={cn(
                                        "text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate",
                                        isCompleted && "line-through decoration-zinc-400"
                                    )}>
                                        {reminder.title}
                                    </h3>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#A600FF] transition-colors flex-shrink-0" />
                            </button>
                        );
                    })}

                    {paginatedReminders.length === 0 && (
                        <div className="py-12 text-center text-zinc-400 italic text-sm">No reminders found</div>
                    )}
                </div>
                
                {totalPages > 1 && (
                    <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20 flex items-center justify-between">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            Page {currentPage} of {totalPages}
                        </div>

                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                <div className="p-4 text-center">
                    <button 
                        onClick={onClose}
                        className="text-[10px] font-black uppercase tracking-widest text-[#A600FF] hover:underline"
                    >
                        Back to Calendar
                    </button>
                </div>
            </div>
        </div>
    );
}
