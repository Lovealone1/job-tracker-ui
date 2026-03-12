'use client';

import React, { useState } from 'react';
import { Briefcase, Filter, Search } from 'lucide-react';
import { useApplications } from '@/features/applications/hooks/use-applications';
import { useApplicationMutations } from '@/features/applications/hooks/use-application-mutations';
import { ApplicationsTableView } from '@/features/applications/components/applications-table-view';
import { ApplicationDetailModal } from '@/features/applications/components/application-detail-modal';
import { NotesModal } from '@/features/applications/components/notes-modal';
import { CrudFormDialog } from '@/components/shared/crud-form-dialog';
import { CrudConfirmDialog } from '@/components/shared/crud-confirm-dialog';
import { applicationCrudConfig } from '@/features/applications/config/application-crud-config';
import { JobApplication, JobApplicationStatus, Priority } from '@/types/job-application';
import { AdvancedFiltersBar, ApplicationFilters } from '@/features/applications/components/advanced-filters-bar';
import { isWithinInterval, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;
const FILTER_LIMIT = 100; // Load more items when filters are active for better in-memory filtering

export default function ApplicationsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<JobApplication | null>(null);
    const [deletingItem, setDeletingItem] = useState<JobApplication | null>(null);
    const [viewingItem, setViewingItem] = useState<JobApplication | null>(null);
    const [notesItem, setNotesItem] = useState<JobApplication | null>(null);
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
    const [priorityUpdatingId, setPriorityUpdatingId] = useState<string | null>(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filters, setFilters] = useState<ApplicationFilters>({
        source: '',
        priority: '',
        status: '',
        dateFrom: '',
        dateTo: '',
    });

    const hasActiveFilters = 
        filters.source !== '' || 
        filters.priority !== '' || 
        filters.status !== '' || 
        filters.dateFrom !== '' || 
        filters.dateTo !== '';

    const { data, isLoading } = useApplications({
        page: hasActiveFilters ? 1 : page + 1,
        limit: hasActiveFilters ? FILTER_LIMIT : PAGE_SIZE,
        search: search || undefined,
    });

    const {
        createApplication,
        updateApplication,
        updateStatus,
        updatePriority,
        deleteApplication
    } = useApplicationMutations();

    const handleStatusChange = async (id: string, status: JobApplicationStatus) => {
        setStatusUpdatingId(id);
        try {
            await updateStatus.mutateAsync({ id, status });
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const handlePriorityChange = async (id: string, priority: Priority) => {
        setPriorityUpdatingId(id);
        try {
            await updatePriority.mutateAsync({ id, priority });
        } finally {
            setPriorityUpdatingId(null);
        }
    };

    const handleSaveNotes = async (notes: string) => {
        if (notesItem) {
            await updateApplication.mutateAsync({ id: notesItem.id, data: { notes } });
        }
    };

    const handleFilterChange = (name: string, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        // Reset page when filtering
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({
            source: '',
            priority: '',
            status: '',
            dateFrom: '',
            dateTo: '',
        });
        setPage(0);
    };

    // Client-side filtering logic
    const filteredData = (data?.data || []).filter(app => {
        // Source
        if (filters.source && !app.source?.toLowerCase().includes(filters.source.toLowerCase())) {
            return false;
        }
        // Priority
        if (filters.priority && app.priority !== filters.priority) {
            return false;
        }
        // Status
        if (filters.status && app.status !== filters.status) {
            return false;
        }
        // Date Range
        if (filters.dateFrom || filters.dateTo) {
            const appDate = parseISO(app.createdAt);
            const start = filters.dateFrom ? parseISO(filters.dateFrom) : new Date(0);
            const end = filters.dateTo ? parseISO(filters.dateTo) : new Date(8640000000000000); // Far future
            
            if (!isWithinInterval(appDate, { start, end })) {
                return false;
            }
        }
        return true;
    });

    return (
        <div className="bg-background">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-[#A600FF] flex items-center justify-center text-white shadow-lg shadow-[#A600FF]/20">
                                <Briefcase size={20} />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                                Applications
                            </h1>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-md font-medium">
                            Manage your job search process and keep track of every application details.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-6 py-3 bg-[#A600FF] hover:bg-[#8B00D6] text-white font-bold rounded-xl shadow-lg shadow-[#A600FF]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        New Application
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by position or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF] transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-all",
                            showAdvancedFilters || hasActiveFilters
                                ? "bg-[#A600FF]/10 border-[#A600FF] text-[#A600FF]" 
                                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                        )}
                    >
                        <Filter size={18} />
                        Advanced Filters
                        {hasActiveFilters && (
                            <span className="flex h-2 w-2 rounded-full bg-[#A600FF]" />
                        )}
                    </button>
                </div>

                {/* Advanced Filters Bar */}
                <AdvancedFiltersBar
                    isOpen={showAdvancedFilters}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClear={clearFilters}
                />

                {/* Table View */}
                <ApplicationsTableView
                    data={filteredData}
                    isLoading={isLoading}
                    pagination={{
                        page,
                        pageSize: PAGE_SIZE,
                        onPageChange: (newPage: number) => setPage(newPage),
                        hasMore: hasActiveFilters ? false : (data?.meta ? page + 1 < data.meta.totalPages : false),
                        totalElements: hasActiveFilters ? filteredData.length : data?.meta?.totalItems,
                    }}
                    onView={(item) => setViewingItem(item)}
                    onEdit={(item) => setEditingItem(item)}
                    onDelete={(item) => setDeletingItem(item)}
                    onNotes={(item) => setNotesItem(item)}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                    statusUpdatingId={statusUpdatingId}
                    priorityUpdatingId={priorityUpdatingId}
                />

                {/* Detail Modal */}
                <ApplicationDetailModal
                    application={viewingItem}
                    isOpen={!!viewingItem}
                    onClose={() => setViewingItem(null)}
                />

                {/* Notes Modal */}
                <NotesModal
                    isOpen={!!notesItem}
                    onClose={() => setNotesItem(null)}
                    initialNotes={notesItem?.notes || ''}
                    applicationTitle={notesItem ? `${notesItem.title} at ${notesItem.company}` : ''}
                    onSave={handleSaveNotes}
                    isLoading={updateApplication.isPending}
                />

                {/* Create Form Dialog */}
                <CrudFormDialog
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onSubmit={async (formData) => {
                        await createApplication.mutateAsync(formData);
                        setIsCreateOpen(false);
                    }}
                    config={applicationCrudConfig}
                    isLoading={createApplication.isPending}
                />

                {/* Edit Form Dialog */}
                <CrudFormDialog
                    isOpen={!!editingItem}
                    onClose={() => setEditingItem(null)}
                    initialData={editingItem}
                    onSubmit={async (formData) => {
                        if (editingItem) {
                            await updateApplication.mutateAsync({ id: editingItem.id, data: formData });
                            setEditingItem(null);
                        }
                    }}
                    config={applicationCrudConfig}
                    isLoading={updateApplication.isPending}
                />

                {/* Delete Confirmation Dialog */}
                <CrudConfirmDialog
                    isOpen={!!deletingItem}
                    onClose={() => setDeletingItem(null)}
                    onConfirm={async () => {
                        if (deletingItem) {
                            await deleteApplication.mutateAsync(deletingItem.id);
                            setDeletingItem(null);
                        }
                    }}
                    title="Delete Application"
                    description={`Are you sure you want to delete the application for "${deletingItem?.title}" at "${deletingItem?.company}"? This action cannot be undone.`}
                    confirmText="Delete"
                    isDestructive={true}
                    isLoading={deleteApplication.isPending}
                />
            </div>
        </div>
    );
}
