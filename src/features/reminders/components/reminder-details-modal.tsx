'use client';

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Trash2, CheckCircle2, Circle, Clock, Tag, ExternalLink, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Reminder, ReminderStatus, ReminderType } from '@/types/reminder';
import { cn } from '@/lib/utils';
import { fromCOWallClock, toCOWallClockISO } from '@/lib/date-utils';
import { useReminderMutations } from '../hooks/use-reminder-mutations';
import { useReminder } from '../hooks/use-reminders';

interface ReminderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reminderId: string;
    onDeleted?: () => void;
}

const typeOptions = Object.values(ReminderType).map((t) => ({
    label: t.replace(/_/g, ' '),
    value: t,
}));

export function ReminderDetailsModal({ 
    isOpen, 
    onClose, 
    reminderId,
    onDeleted
}: ReminderDetailsModalProps) {
    const { data: reminder, isLoading: isFetching } = useReminder(reminderId);
    const { updateStatus, updateType, rescheduleReminder, deleteReminder } = useReminderMutations();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [newDueDate, setNewDueDate] = useState('');

    if (!isOpen) return null;

    if (isFetching) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-[#A600FF]/30 border-t-[#A600FF] rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Retrieving Details...</p>
                </div>
            </div>
        );
    }

    if (!reminder) return null;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this reminder?')) return;
        setIsDeleting(true);
        try {
            await deleteReminder.mutateAsync(reminder.id);
            onDeleted?.();
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusToggle = async () => {
        const nextStatus = reminder.status === ReminderStatus.COMPLETED ? ReminderStatus.PENDING : ReminderStatus.COMPLETED;
        await updateStatus.mutateAsync({ id: reminder.id, status: nextStatus });
    };

    const handleTypeChange = async (type: string) => {
        await updateType.mutateAsync({ id: reminder.id, type: type as ReminderType });
    };

    const handleReschedule = async () => {
        if (!newDueDate) return;
        const date = new Date(newDueDate);
        if (!isNaN(date.getTime())) {
            await rescheduleReminder.mutateAsync({ id: reminder.id, dueAt: toCOWallClockISO(date) });
            setIsRescheduling(false);
        }
    };

    const dueAtLocal = fromCOWallClock(reminder.dueAt);

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-br from-[#A600FF] to-[#6a00ff] p-6 flex flex-col justify-end min-w-0">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="flex items-center gap-2 mb-2">
                         <select
                            value={reminder.type || ''}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border-none focus:ring-0 cursor-pointer hover:bg-white/20 transition-colors"
                        >
                            {typeOptions.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">{opt.label}</option>
                            ))}
                        </select>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm",
                            reminder.status === 'COMPLETED' ? "bg-green-500/20 text-green-100" : "bg-zinc-100/20 text-zinc-100"
                        )}>
                            {reminder.status}
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-white truncate leading-tight italic min-w-0">
                        {reminder.title}
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Time Info */}
                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#A600FF]/10 rounded-xl">
                                <CalendarIcon className="w-5 h-5 text-[#A600FF]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Scheduled For</p>
                                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {format(dueAtLocal, 'EEEE, MMM do — hh:mm a')}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setIsRescheduling(!isRescheduling);
                                if (!isRescheduling) setNewDueDate(format(dueAtLocal, "yyyy-MM-dd'T'HH:mm"));
                            }}
                            className="p-2 text-zinc-400 hover:text-[#A600FF] transition-colors"
                        >
                            <Clock size={16} />
                        </button>
                    </div>

                    {isRescheduling && (
                        <div className="p-4 bg-[#A600FF]/5 rounded-2xl border border-[#A600FF]/20 flex flex-col gap-3 animate-in slide-in-from-top-2">
                             <input
                                type="datetime-local"
                                value={newDueDate}
                                onChange={(e) => setNewDueDate(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF]"
                            />
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsRescheduling(false)}
                                    className="flex-1 py-1.5 text-[10px] font-black uppercase text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleReschedule}
                                    className="flex-1 py-1.5 text-[10px] font-black uppercase bg-[#A600FF] text-white rounded-lg hover:bg-[#8B00D6] transition-colors"
                                >
                                    Reschedule
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {reminder.description && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Memory Notes</p>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                                    "{reminder.description}"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Context */}
                    {(reminder.jobApplication || reminder.interview) && (
                        <div className="space-y-3">
                            <p className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Context</p>
                            <div className="flex flex-col gap-2">
                                {reminder.jobApplication && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                                        <div className="p-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg">
                                            <ExternalLink size={14} className="text-zinc-600 dark:text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tight">Job Application</p>
                                            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                {reminder.jobApplication.title} @ {reminder.jobApplication.company}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {reminder.interview && (
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                                        <div className="p-1.5 bg-[#A600FF]/20 rounded-lg">
                                            <CalendarIcon size={14} className="text-[#A600FF]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tight">Interview</p>
                                            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                Technical Interview — {reminder.interview?.scheduledAt ? format(new Date(reminder.interview.scheduledAt), 'MMM d, h:mm a') : 'Unscheduled'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <button 
                            onClick={handleStatusToggle}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95",
                                reminder.status === 'COMPLETED' 
                                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                                    : "bg-[#A600FF] text-white shadow-xl shadow-[#A600FF]/20 hover:bg-[#8B00D6]"
                            )}
                        >
                            {reminder.status === 'COMPLETED' ? (
                                <><CheckCircle2 size={16} /> Completed</>
                            ) : (
                                <><Circle size={16} /> Mark Done</>
                            )}
                        </button>
                        
                        <button 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
