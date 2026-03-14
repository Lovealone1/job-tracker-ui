'use client';

import React, { useState } from 'react';
import { CalendarClock, Filter, Search, Plus } from 'lucide-react';
import { useInterviews, useUpcomingInterviews } from '@/features/interviews/hooks/use-interviews';
import { useInterviewMutations } from '@/features/interviews/hooks/use-interview-mutations';
import { useApplications } from '@/features/applications/hooks/use-applications';
import { useInterview } from '@/features/interviews/hooks/use-interviews';
import { InterviewsTableView } from '@/features/interviews/components/interviews-table-view';
import { InterviewDetailModal } from '@/features/interviews/components/interview-detail-modal';
import { CreateInterviewModal } from '@/features/interviews/components/create-interview-modal';
import { TextAreaModal } from '@/features/interviews/components/textarea-modal';
import { RescheduleModal } from '@/features/interviews/components/reschedule-modal';
import { CrudConfirmDialog } from '@/components/shared/crud-confirm-dialog';
import { InterviewSummary, InterviewStatus, Interview } from '@/types/interview';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;

type ViewMode = 'all' | 'upcoming';

export default function InterviewsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('all');
    const [jobAppFilter, setJobAppFilter] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [notesItem, setNotesItem] = useState<InterviewSummary | null>(null);
    const [feedbackItem, setFeedbackItem] = useState<InterviewSummary | null>(null);
    const [rescheduleItem, setRescheduleItem] = useState<InterviewSummary | null>(null);
    const [deletingItem, setDeletingItem] = useState<InterviewSummary | null>(null);
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

    // ── Data fetching ───────────────────────────────────
    const { data: paginatedData, isLoading: isLoadingAll } = useInterviews({
        page: page + 1,
        limit: PAGE_SIZE,
        search: search || undefined,
    });

    const { data: upcomingData, isLoading: isLoadingUpcoming } = useUpcomingInterviews();

    // For detail modal — fetch full interview when user clicks view
    const { data: viewingDetail } = useInterview(viewingId || '');
    // For edit modal
    const { data: editingDetail } = useInterview(editingId || '');

    // All applications for the create modal dropdown (fetch a big page)
    const { data: applicationsData, isLoading: applicationsLoading } = useApplications({ page: 1, limit: 200 });

    const {
        createInterview,
        updateInterview,
        updateStatus,
        updateNotes,
        updateFeedback,
        rescheduleInterview,
        deleteInterview,
    } = useInterviewMutations();

    // ── Derived data ────────────────────────────────────
    const isUpcoming = viewMode === 'upcoming';
    const displayData = isUpcoming ? (upcomingData || []) : (paginatedData?.data || []);
    const isLoading = isUpcoming ? isLoadingUpcoming : isLoadingAll;

    // Client-side filter by job application id
    const filteredData = jobAppFilter
        ? displayData.filter((item) => item.jobApplicationId === jobAppFilter)
        : displayData;

    // ── Handlers ────────────────────────────────────────
    const handleStatusChange = async (id: string, status: InterviewStatus) => {
        setStatusUpdatingId(id);
        try {
            await updateStatus.mutateAsync({ id, status });
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const handleSaveNotes = async (notes: string) => {
        if (notesItem) {
            await updateNotes.mutateAsync({ id: notesItem.id, notes });
            setNotesItem(null);
        }
    };

    const handleSaveFeedback = async (feedback: string) => {
        if (feedbackItem) {
            await updateFeedback.mutateAsync({ id: feedbackItem.id, feedback });
            setFeedbackItem(null);
        }
    };

    // Build unique job apps from current data for client filter
    const uniqueJobApps = Array.from(
        new Map(displayData.filter(i => i.jobApplication).map(i => [i.jobApplicationId, i.jobApplication!])).entries()
    );

    return (
        <div className="h-full flex flex-col overflow-hidden bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-8 pt-4 md:pt-2 pb-6 md:pb-4 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-[#A600FF] shadow-lg shadow-[#A600FF]/25 rounded-2xl">
                            <CalendarClock className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none italic">
                                Interviews
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#A600FF]" />
                                Scheduled Interviews & Preparation
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 self-start md:self-auto px-6 py-3 bg-[#A600FF] hover:bg-[#8B00D6] text-white rounded-2xl text-[10px] font-black shadow-2xl shadow-[#A600FF]/40 transition-all hover:-translate-y-1 active:translate-y-0 text-nowrap uppercase tracking-widest"
                >
                    <Plus className="w-5 h-5" />
                    Create
                </button>
            </div>

            <div className="flex-1 overflow-y-auto md:overflow-hidden p-4 md:p-8 pt-6 space-y-6 custom-scrollbar">

                {/* View Mode Toggle + Filters */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    {/* View toggle */}
                    <div className="flex w-full sm:w-auto rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0">
                        <button
                            onClick={() => { setViewMode('all'); setPage(0); }}
                            className={cn(
                                'flex-1 sm:flex-none px-4 py-2.5 text-sm font-bold transition-colors',
                                viewMode === 'all' ? 'bg-[#A600FF] text-white' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            )}
                        >
                            All Interviews
                        </button>
                        <button
                            onClick={() => { setViewMode('upcoming'); setPage(0); }}
                            className={cn(
                                'flex-1 sm:flex-none px-4 py-2.5 text-sm font-bold transition-colors',
                                viewMode === 'upcoming' ? 'bg-[#A600FF] text-white' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            )}
                        >
                            Upcoming
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by position or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF] transition-all"
                        />
                    </div>

                    {/* Job Application Filter */}
                    <select
                        value={jobAppFilter}
                        onChange={(e) => setJobAppFilter(e.target.value)}
                        className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A600FF] transition-all shrink-0"
                    >
                        <option value="">All Applications</option>
                        {uniqueJobApps.map(([id, app]) => (
                            <option key={id} value={id}>{app.title} — {app.company}</option>
                        ))}
                    </select>
                </div>

                {/* Table View */}
                <InterviewsTableView
                    data={filteredData}
                    isLoading={isLoading}
                    pagination={!isUpcoming ? {
                        page,
                        pageSize: PAGE_SIZE,
                        onPageChange: (newPage: number) => setPage(newPage),
                        hasMore: paginatedData?.meta ? page + 1 < paginatedData.meta.totalPages : false,
                        totalElements: paginatedData?.meta?.total,
                    } : undefined}
                    onView={(item) => setViewingId(item.id)}
                    onEdit={(item) => setEditingId(item.id)}
                    onDelete={(item) => setDeletingItem(item)}
                    onNotes={(item) => setNotesItem(item)}
                    onFeedback={(item) => setFeedbackItem(item)}
                    onReschedule={(item) => setRescheduleItem(item)}
                    onStatusChange={handleStatusChange}
                    statusUpdatingId={statusUpdatingId}
                />
            </div>

                {/* Detail Modal */}
                <InterviewDetailModal
                    interview={(viewingDetail as Interview) || null}
                    isOpen={!!viewingId}
                    onClose={() => setViewingId(null)}
                />

                {/* Create Modal */}
                <CreateInterviewModal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onSubmit={async (data) => {
                        await createInterview.mutateAsync(data);
                        setIsCreateOpen(false);
                    }}
                    isLoading={createInterview.isPending}
                    jobApplications={applicationsData?.data || []}
                    jobApplicationsLoading={applicationsLoading}
                />

                {/* Edit Modal */}
                <CreateInterviewModal
                    isOpen={!!editingId}
                    onClose={() => setEditingId(null)}
                    mode="edit"
                    initialData={editingDetail}
                    onSubmit={async (data) => {
                        if (editingId) {
                            // Clean data for backend validation (remove read-only / relations / nulls)
                            const allowedFields = [
                                'type', 'scheduledAt', 'durationMinutes', 'timezone',
                                'location', 'meetingUrl', 'interviewerName',
                                'interviewerEmail', 'notes', 'feedback', 'status'
                            ];

                            const cleanData = Object.keys(data).reduce((acc: any, key) => {
                                if (allowedFields.includes(key) && data[key] !== null) {
                                    acc[key] = data[key];
                                }
                                return acc;
                            }, {});

                            await updateInterview.mutateAsync({ id: editingId, data: cleanData });
                            setEditingId(null);
                        }
                    }}
                    isLoading={updateInterview.isPending}
                    jobApplications={applicationsData?.data || []}
                    jobApplicationsLoading={applicationsLoading}
                />

                {/* Notes Modal */}
                <TextAreaModal
                    isOpen={!!notesItem}
                    onClose={() => setNotesItem(null)}
                    title="Preparation Notes"
                    label={notesItem ? `Notes for ${notesItem.jobApplication?.title || 'Interview'}` : ''}
                    initialValue={notesItem?.notes || ''}
                    onSave={handleSaveNotes}
                    isLoading={updateNotes.isPending}
                />

                {/* Feedback Modal */}
                <TextAreaModal
                    isOpen={!!feedbackItem}
                    onClose={() => setFeedbackItem(null)}
                    title="Interview Feedback"
                    label={feedbackItem ? `Feedback for ${feedbackItem.jobApplication?.title || 'Interview'}` : ''}
                    initialValue={feedbackItem?.feedback || ''}
                    onSave={handleSaveFeedback}
                    isLoading={updateFeedback.isPending}
                />

                {/* Reschedule Modal */}
                <RescheduleModal
                    isOpen={!!rescheduleItem}
                    onClose={() => setRescheduleItem(null)}
                    initialScheduledAt={rescheduleItem?.scheduledAt}
                    initialDurationMinutes={rescheduleItem?.durationMinutes}
                    onSave={async (data) => {
                        if (rescheduleItem) {
                            await rescheduleInterview.mutateAsync({ id: rescheduleItem.id, data });
                        }
                    }}
                    isLoading={rescheduleInterview.isPending}
                />

                {/* Delete Confirmation */}
                <CrudConfirmDialog
                    isOpen={!!deletingItem}
                    onClose={() => setDeletingItem(null)}
                    onConfirm={async () => {
                        if (deletingItem) {
                            await deleteInterview.mutateAsync(deletingItem.id);
                            setDeletingItem(null);
                        }
                    }}
                    title="Delete Interview"
                    description={`Are you sure you want to delete this ${deletingItem?.type.replace(/_/g, ' ')} interview? This action cannot be undone.`}
                    confirmText="Delete"
                    isDestructive={true}
                    isLoading={deleteInterview.isPending}
            />
        </div>
    );
}
