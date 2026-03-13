'use client';

import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isPast,
    isToday,
    startOfDay
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, Bell, Plus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReminders } from '@/features/reminders/hooks/use-reminders';
import { ReminderSummary } from '@/types/reminder';
import { toCOWallClockISO, fromCOWallClock } from '@/lib/date-utils';
import { ReminderListModal } from './reminder-list-modal';
import { ReminderDetailsModal } from './reminder-details-modal';

interface ReminderCalendarProps {
    currentMonth: Date;
    className?: string;
    onAddReminder?: (date: Date) => void;
}

export function ReminderCalendar({ currentMonth, className, onAddReminder }: ReminderCalendarProps) {
    const [selectedDateReminders, setSelectedDateReminders] = useState<{ date: Date, reminders: ReminderSummary[] } | null>(null);
    const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    // Fetch reminders for the current view range
    const { data: remindersData, isLoading } = useReminders({
        from: toCOWallClockISO(startDate),
        to: toCOWallClockISO(endDate),
        limit: 1000 // Ensure we get all for the view
    });

    const reminders = remindersData?.data || [];

    // Group reminders by date
    const remindersByDate = reminders.reduce((acc, reminder) => {
        const localDate = fromCOWallClock(reminder.dueAt as string);
        const dateKey = format(localDate, 'yyyy-MM-dd');
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(reminder);
        return acc;
    }, {} as Record<string, ReminderSummary[]>);

    const handleCellClick = (date: Date, dayReminders: ReminderSummary[]) => {
        if (dayReminders.length === 1) {
            setSelectedReminderId(dayReminders[0].id);
        } else if (dayReminders.length > 1) {
            setSelectedDateReminders({ date, reminders: dayReminders });
        }
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
                {days.map((day, index) => (
                    <div key={index} className="py-0.5 text-center text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const formattedDate = format(day, "d");
                const isDayPast = isPast(startOfDay(cloneDay)) && !isToday(cloneDay);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isDayToday = isToday(day);
                
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayReminders = remindersByDate[dateKey] || [];
                const hasReminders = dayReminders.length > 0;

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "relative flex-1 min-h-[22px] border-r border-b border-zinc-200 dark:border-zinc-800 p-0.5 transition-all hover:bg-[#A600FF]/5 group flex flex-col",
                            !isCurrentMonth && "bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-300 dark:text-zinc-800",
                            isDayToday && "bg-[#A600FF]/5",
                            hasReminders ? "cursor-pointer" : "cursor-default"
                        )}
                        onClick={() => hasReminders && handleCellClick(cloneDay, dayReminders)}
                    >
                        <div className="flex justify-between items-start">
                            <span className={cn(
                                "text-xs font-black flex items-center justify-center w-7 h-7 rounded-lg transition-all",
                                !isCurrentMonth && "opacity-20",
                                isCurrentMonth && isDayPast && "text-zinc-400 dark:text-zinc-600",
                                isCurrentMonth && !isDayPast && "text-zinc-900 dark:text-zinc-100 group-hover:text-[#A600FF] group-hover:bg-[#A600FF]/10",
                                isDayToday && "bg-[#A600FF] text-white shadow-lg shadow-[#A600FF]/40"
                            )}>
                                {formattedDate}
                            </span>

                            {/* Interaction Icon - Only for today or future */}
                            {!isDayPast && isCurrentMonth && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddReminder?.(cloneDay);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[#A600FF]/10 text-[#A600FF] hover:bg-[#A600FF] hover:text-white transition-all transform scale-75 group-hover:scale-100"
                                >
                                    <Plus size={14} />
                                </button>
                            )}
                        </div>

                        {/* Reminders List */}
                        <div className="mt-0.5 flex-1 flex flex-col gap-0.5 overflow-hidden min-w-0">
                            {dayReminders.length === 1 ? (
                                <div className="px-1.5 py-0.5 rounded-md bg-[#A600FF]/10 border border-[#A600FF]/20 overflow-hidden min-w-0">
                                    <p className="text-[10px] font-bold text-[#A600FF] truncate">
                                        {dayReminders[0].title}
                                    </p>
                                </div>
                            ) : dayReminders.length > 1 ? (
                                <div className="px-1.5 py-0.5 rounded-md bg-zinc-900 dark:bg-white border border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
                                    <Bell className="w-2.5 h-2.5 text-white dark:text-zinc-900" />
                                    <p className="text-[10px] font-black text-white dark:text-zinc-900 uppercase">
                                        {dayReminders.length} Reminders
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {isDayToday && isCurrentMonth && (
                            <div className="absolute bottom-1 right-1">
                                <span className="text-[8px] font-black uppercase text-[#A600FF] tracking-tighter opacity-30">Today</span>
                            </div>
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 flex-1" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="flex-1 flex flex-col">{rows}</div>;
    };

    return (
        <div className={cn("flex-1 flex flex-col bg-white dark:bg-zinc-950/50", className)}>
            {renderDays()}
            {renderCells()}

            {/* Modals */}
            <ReminderListModal 
                isOpen={!!selectedDateReminders}
                onClose={() => setSelectedDateReminders(null)}
                date={selectedDateReminders?.date || new Date()}
                reminders={selectedDateReminders?.reminders || []}
                onSelectReminder={(r) => {
                    setSelectedDateReminders(null);
                    setSelectedReminderId(r.id);
                }}
            />

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
