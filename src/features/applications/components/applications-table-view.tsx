'use client';

import React from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { 
    Eye, 
    Pencil, 
    Trash2, 
    RefreshCcw, 
    ClipboardList, 
    Star, 
    Upload 
} from 'lucide-react';
import { CrudTable } from '@/components/shared/crud-table';
import { JobApplication, JobApplicationStatus, WorkMode } from '@/types/job-application';
import { TableColumn } from '@/types/crud';
import { cn } from '@/lib/utils';

interface ApplicationsTableViewProps {
    data: JobApplication[];
    isLoading: boolean;
    pagination?: any;
    onEdit?: (item: JobApplication) => void;
    onDelete?: (item: JobApplication) => void;
}

export function ApplicationsTableView({ 
    data, 
    isLoading, 
    pagination,
    onEdit,
    onDelete 
}: ApplicationsTableViewProps) {
    const columns: TableColumn<JobApplication>[] = [
        // ... (previous columns remain the same)
        {
            header: 'Position',
            accessorKey: 'title',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                    <span className="text-xs text-zinc-500">{item.company}</span>
                </div>
            ),
        },
        {
            header: 'Location',
            accessorKey: 'location',
            render: (item) => (
                <div className="flex flex-col text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300">{item.location || 'N/A'}</span>
                    <span className="text-zinc-500">{item.country || ''}</span>
                </div>
            ),
        },
        {
            header: 'Source',
            accessorKey: 'source',
            render: (item) => (
                <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md font-medium text-zinc-600 dark:text-cross-400">
                    {item.source || 'Direct'}
                </span>
            ),
        },
        {
            header: 'Work Mode',
            accessorKey: 'workMode',
            render: (item) => {
                const colors: Record<string, string> = {
                    [WorkMode.REMOTE]: 'text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400',
                    [WorkMode.HYBRID]: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
                    [WorkMode.ON_SITE]: 'text-zinc-600 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400',
                };
                return (
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                        colors[item.workMode || ''] || colors[WorkMode.ON_SITE]
                    )}>
                        {item.workMode || 'N/A'}
                    </span>
                );
            }
        },
        {
            header: 'Status',
            accessorKey: 'status',
            render: (item) => {
                const statusColors: Record<JobApplicationStatus, string> = {
                    [JobApplicationStatus.SAVED]: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
                    [JobApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                    [JobApplicationStatus.INTERVIEWING]: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
                    [JobApplicationStatus.OFFER]: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                    [JobApplicationStatus.REJECTED]: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
                    [JobApplicationStatus.WITHDRAWN]: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
                    [JobApplicationStatus.GHOSTED]: 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300',
                };

                return (
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", statusColors[item.status].split(' ')[0])} />
                        <span className={cn("text-xs font-bold", statusColors[item.status])}>
                            {item.status}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'Applied On',
            accessorKey: 'appliedAt',
            render: (item) => (
                <span className="text-xs text-zinc-500">
                    {item.appliedAt 
                        ? format(new Date(item.appliedAt), 'dd MMM yyyy', { locale: enUS })
                        : 'Not applied'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            align: 'center',
            render: (item) => (
                <div className="flex items-center gap-1.5">
                    <button className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="View Details">
                        <Eye size={16} />
                    </button>
                    <button 
                        onClick={() => onEdit?.(item)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" 
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Update Status">
                        <RefreshCcw size={16} />
                    </button>
                    <button className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Notes">
                        <ClipboardList size={16} />
                    </button>
                    <button className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Priority">
                        <Star size={16} />
                    </button>
                    <button className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Upload CV">
                        <Upload size={16} />
                    </button>
                    <button 
                        onClick={() => onDelete?.(item)}
                        className="p-1.5 text-red-500 hover:text-red-700 transition-colors" 
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <CrudTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            pagination={pagination}
        />
    );
}
