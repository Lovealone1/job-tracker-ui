'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Bell, Filter, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ReminderCalendar } from '@/features/reminders/components/reminder-calendar';
import { CreateReminderModal } from '@/features/reminders/components/create-reminder-modal';
import { ReminderListView } from '@/features/reminders/components/reminder-list-view';
import { ReminderFilters, FilterState } from '@/features/reminders/components/reminder-filters';
import { useReminderMutations } from '@/features/reminders/hooks/use-reminder-mutations';
import { useInterviews } from '@/features/interviews/hooks/use-interviews';
import { CreateReminderDto } from '@/types/reminder';

export default function RemindersPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [filters, setFilters] = useState<FilterState>({ type: 'all' });

    const { createReminder } = useReminderMutations();
    const { data: interviewsData, isLoading: interviewsLoading } = useInterviews({ limit: 100 });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const openModal = (date?: Date) => {
        setSelectedDate(date || new Date());
        setIsModalOpen(true);
    };

    const handleCreateReminder = async (data: CreateReminderDto) => {
        try {
            await createReminder.mutateAsync(data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create reminder:', error);
        }
    };

    const [isListView, setIsListView] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setIsListView(filters.type !== 'all');
    }, [filters.type]);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-950 select-none">
            {/* Unified Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-8 pt-4 md:pt-2 pb-6 md:pb-4 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-[#A600FF] shadow-lg shadow-[#A600FF]/25 rounded-2xl">
                            <CalendarIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none italic">
                                Reminders
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#A600FF]" />
                                {isListView ? 'Filtered List View' : format(currentMonth, 'MMMM yyyy', { locale: enUS })}
                            </p>
                        </div>
                    </div>

                    {!isListView && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevMonth}
                                className="p-2 text-zinc-500 hover:text-[#A600FF] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all hover:bg-zinc-50 active:scale-95 shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-6 py-2 text-[10px] font-black text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 hover:text-[#A600FF] transition-all active:scale-95 shadow-sm"
                            >
                                Today
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 text-zinc-500 hover:text-[#A600FF] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all hover:bg-zinc-50 active:scale-95 shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => openModal()}
                                className="flex items-center justify-center gap-2 px-13 py-3 bg-[#A600FF] hover:bg-[#8B00D6] text-white rounded-2xl text-[10px] font-black shadow-lg shadow-[#A600FF]/25 transition-all hover:-translate-y-0.5 active:translate-y-0 text-nowrap uppercase tracking-widest ml-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pb-2">
                    {!showFilters ? (
                        <button
                            onClick={() => setShowFilters(true)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl text-[10px] font-black shadow-xl transition-all active:scale-95 text-nowrap uppercase tracking-widest hover:bg-[#A600FF]/5 hover:text-[#A600FF] dark:hover:bg-[#A600FF]/10 active:translate-y-0"
                        >
                            <Filter className="w-4 h-4" />
                            Advanced Filters
                        </button>
                    ) : (
                        <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex-1 sm:flex-none">
                            <ReminderFilters
                                filters={filters}
                                onChange={setFilters}
                                onClear={() => {
                                    setFilters({ type: 'all' });
                                    setShowFilters(false);
                                }}
                                onClose={() => setShowFilters(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Main View Area */}
            <div className="flex-1 overflow-hidden p-4 md:px-8 md:pb-8 md:pt-0 flex flex-col">
                <div className="flex-1 overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl bg-white/50 dark:bg-zinc-950/20 backdrop-blur-3xl flex flex-col">
                    {isListView ? (
                        <ReminderListView filters={filters} />
                    ) : (
                        <ReminderCalendar
                            currentMonth={currentMonth}
                            className="flex-1 border-none"
                            onAddReminder={openModal}
                        />
                    )}
                </div>
            </div>

            <CreateReminderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateReminder}
                isLoading={createReminder.isPending}
                interviews={interviewsData?.data || []}
                interviewsLoading={interviewsLoading}
                initialDate={selectedDate}
            />
        </div>
    );
}
