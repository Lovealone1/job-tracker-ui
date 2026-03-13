'use client';

import React from 'react';
import { Bell, Calendar as CalendarIcon, Clock, CheckCircle2, Circle, ExternalLink, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ReminderSummary } from '@/types/reminder';
import { cn } from '@/lib/utils';
import { fromCOWallClock } from '@/lib/date-utils';

interface ReminderCardProps {
    reminder: ReminderSummary;
    onClick: (id: string) => void;
}

export function ReminderCard({ reminder, onClick }: ReminderCardProps) {
    const localDate = fromCOWallClock(reminder.dueAt);
    const isCompleted = reminder.status === 'COMPLETED';

    return (
        <button
            onClick={() => onClick(reminder.id)}
            className={cn(
                "group relative w-full p-5 text-left transition-all duration-300",
                "bg-white dark:bg-zinc-900 border rounded-2xl",
                "hover:shadow-2xl hover:shadow-[#A600FF]/10 hover:-translate-y-1 active:scale-[0.98]",
                isCompleted 
                    ? "border-zinc-100 dark:border-zinc-800 opacity-70 grayscale-[0.5]" 
                    : "border-zinc-200 dark:border-zinc-800 hover:border-[#A600FF]/30 shadow-sm"
            )}
        >
            <div className="flex flex-col gap-4">
                {/* Top Section: Badges & Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "p-2 rounded-xl transition-colors",
                            isCompleted ? "bg-zinc-100 dark:bg-zinc-800" : "bg-[#A600FF]/10"
                        )}>
                            <Bell className={cn("w-4 h-4", isCompleted ? "text-zinc-400" : "text-[#A600FF]")} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
                            isCompleted 
                                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500" 
                                : "bg-[#A600FF] text-white"
                        )}>
                            {reminder.type.replace(/_/g, ' ')}
                        </span>
                    </div>
                    
                    {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-full border border-zinc-100 dark:border-zinc-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A600FF] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pending</span>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="space-y-1 min-w-0">
                    <h3 className={cn(
                        "text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100 truncate",
                        isCompleted && "line-through decoration-zinc-400"
                    )}>
                        {reminder.title}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <CalendarIcon size={12} />
                        <span className="text-xs font-bold italic">
                            {format(localDate, 'EEEE, MMM do — hh:mm a')}
                        </span>
                    </div>
                </div>

                {/* Context Footer */}
                {(reminder.jobApplication || reminder.interview) && (
                    <div className="flex gap-2 items-center pt-3 border-t border-zinc-50 dark:border-zinc-800/50">
                        {reminder.jobApplication && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border border-zinc-100 dark:border-zinc-800 min-w-0 flex-1">
                                <ExternalLink size={10} className="text-zinc-400 flex-shrink-0" />
                                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 truncate">
                                    {reminder.jobApplication.title} @ {reminder.jobApplication.company}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-4 transition-all duration-300">
                    <ChevronRight className="text-[#A600FF]" size={20} />
                </div>
            </div>
        </button>
    );
}
