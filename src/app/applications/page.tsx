'use client';

import React, { useState } from 'react';
import { Briefcase, Filter, Search } from 'lucide-react';
import { useApplications } from '@/features/applications/hooks/use-applications';
import { useApplicationMutations } from '@/features/applications/hooks/use-application-mutations';
import { ApplicationsTableView } from '@/features/applications/components/applications-table-view';
import { TempTokenInput } from '@/components/auth/temp-token-input';
import { CrudFormDialog } from '@/components/shared/crud-form-dialog';
import { CrudConfirmDialog } from '@/components/shared/crud-confirm-dialog';
import { applicationCrudConfig } from '@/features/applications/config/application-crud-config';
import { JobApplication } from '@/types/job-application';

export default function ApplicationsPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<JobApplication | null>(null);
    const [deletingItem, setDeletingItem] = useState<JobApplication | null>(null);

    const { data, isLoading } = useApplications({
        page: page + 1,
        limit: 10,
        search: search || undefined,
    });

    const { 
        createApplication, 
        updateApplication, 
        deleteApplication 
    } = useApplicationMutations();

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 p-6 sm:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-[#3b6154] flex items-center justify-center text-white shadow-lg shadow-[#3b6154]/20">
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
                        className="px-6 py-3 bg-[#3b6154] hover:bg-[#2b473e] text-white font-bold rounded-xl shadow-lg shadow-[#3b6154]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        New Application
                    </button>
                </div>

                {/* Temp Token Input for validation */}
                <TempTokenInput />

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by position or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b6154] transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-xl text-sm font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                        <Filter size={18} />
                        Advanced Filters
                    </button>
                </div>

                {/* Table View */}
                <ApplicationsTableView
                    data={data?.data || []}
                    isLoading={isLoading}
                    pagination={{
                        page,
                        pageSize: 10,
                        onPageChange: (newPage: number) => setPage(newPage),
                        hasMore: data?.meta ? page + 1 < data.meta.totalPages : false,
                        totalElements: data?.meta?.totalItems,
                    }}
                    onEdit={(item) => setEditingItem(item)}
                    onDelete={(item) => setDeletingItem(item)}
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
