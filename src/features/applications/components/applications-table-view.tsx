'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
    Eye,
    Pencil,
    Trash2,
    ClipboardList,
    Upload,
    Check,
} from 'lucide-react';
import { CrudTable } from '@/components/shared/crud-table';
import { JobApplication, JobApplicationStatus, Priority, WorkMode } from '@/types/job-application';
import { TableColumn } from '@/types/crud';
import { cn } from '@/lib/utils';

interface ApplicationsTableViewProps {
    data: JobApplication[];
    isLoading: boolean;
    pagination?: any;
    onView?: (item: JobApplication) => void;
    onEdit?: (item: JobApplication) => void;
    onDelete?: (item: JobApplication) => void;
    onNotes?: (item: JobApplication) => void;
    onStatusChange?: (id: string, status: JobApplicationStatus) => void;
    onPriorityChange?: (id: string, priority: Priority) => void;
    statusUpdatingId?: string | null;
    priorityUpdatingId?: string | null;
}

const statusColors: Record<JobApplicationStatus, string> = {
    [JobApplicationStatus.SAVED]: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    [JobApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    [JobApplicationStatus.INTERVIEWING]: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    [JobApplicationStatus.OFFER]: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    [JobApplicationStatus.REJECTED]: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    [JobApplicationStatus.WITHDRAWN]: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    [JobApplicationStatus.GHOSTED]: 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300',
};

const priorityConfig: Record<Priority, { color: string; dot: string; bg: string }> = {
    [Priority.LOW]: { color: 'text-zinc-500', dot: 'bg-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800' },
    [Priority.MEDIUM]: { color: 'text-blue-500', dot: 'bg-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    [Priority.HIGH]: { color: 'text-orange-500', dot: 'bg-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    [Priority.URGENT]: { color: 'text-red-500', dot: 'bg-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
};

/* ── Generic portal dropdown ──────────────────────────────── */

function PortalDropdown<T extends string>({
    items,
    currentValue,
    onSelect,
    onClose,
    anchorRef,
    renderItem,
}: {
    items: T[];
    currentValue: T;
    onSelect: (val: T) => void;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    renderItem: (val: T, isCurrent: boolean) => React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom + 4, left: rect.left });
        }
    }, [anchorRef]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                ref.current && !ref.current.contains(e.target as Node) &&
                anchorRef.current && !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, anchorRef]);

    return createPortal(
        <div
            ref={ref}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[9999] min-w-[150px] rounded-xl border border-border bg-card shadow-2xl py-1"
        >
            {items.map((val) => (
                <button
                    key={val}
                    onClick={() => onSelect(val)}
                    className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-muted',
                        val === currentValue && 'bg-muted'
                    )}
                >
                    {renderItem(val, val === currentValue)}
                </button>
            ))}
        </div>,
        document.body
    );
}

/* ── Status cell ──────────────────────────────────────────── */

function StatusCell({
    item,
    isOpen,
    isUpdating,
    onToggle,
    onSelect,
    onClose,
}: {
    item: JobApplication;
    isOpen: boolean;
    isUpdating: boolean;
    onToggle: () => void;
    onSelect: (status: JobApplicationStatus) => void;
    onClose: () => void;
}) {
    const btnRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <button
                ref={btnRef}
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                disabled={isUpdating}
                className={cn(
                    'flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer',
                    'hover:ring-2 hover:ring-[#A600FF]/30 active:scale-95',
                    statusColors[item.status],
                    isUpdating && 'opacity-50'
                )}
            >
                <div className={cn('w-2 h-2 rounded-full', statusColors[item.status].split(' ')[0])} />
                {isUpdating ? (
                    <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                ) : (
                    item.status.replace(/_/g, ' ')
                )}
            </button>
            {isOpen && (
                <PortalDropdown
                    items={Object.values(JobApplicationStatus)}
                    currentValue={item.status}
                    onSelect={onSelect}
                    onClose={onClose}
                    anchorRef={btnRef}
                    renderItem={(status, isCurrent) => (
                        <>
                            <div className={cn('w-2 h-2 rounded-full', statusColors[status].split(' ')[0])} />
                            <span>{status.replace(/_/g, ' ')}</span>
                            {isCurrent && <Check size={12} className="ml-auto text-[#A600FF]" />}
                        </>
                    )}
                />
            )}
        </>
    );
}

/* ── Priority cell ────────────────────────────────────────── */

function PriorityCell({
    item,
    isOpen,
    isUpdating,
    onToggle,
    onSelect,
    onClose,
}: {
    item: JobApplication;
    isOpen: boolean;
    isUpdating: boolean;
    onToggle: () => void;
    onSelect: (priority: Priority) => void;
    onClose: () => void;
}) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const cfg = priorityConfig[item.priority];

    return (
        <>
            <button
                ref={btnRef}
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                disabled={isUpdating}
                className={cn(
                    'flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer',
                    'hover:ring-2 hover:ring-[#A600FF]/30 active:scale-95',
                    cfg.bg, cfg.color,
                    isUpdating && 'opacity-50'
                )}
            >
                <div className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                {isUpdating ? (
                    <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                ) : (
                    item.priority
                )}
            </button>
            {isOpen && (
                <PortalDropdown
                    items={Object.values(Priority)}
                    currentValue={item.priority}
                    onSelect={onSelect}
                    onClose={onClose}
                    anchorRef={btnRef}
                    renderItem={(priority, isCurrent) => {
                        const c = priorityConfig[priority];
                        return (
                            <>
                                <div className={cn('w-2 h-2 rounded-full', c.dot)} />
                                <span className={c.color}>{priority}</span>
                                {isCurrent && <Check size={12} className="ml-auto text-[#A600FF]" />}
                            </>
                        );
                    }}
                />
            )}
        </>
    );
}

/* ── Main table view ──────────────────────────────────────── */

export function ApplicationsTableView({
    data,
    isLoading,
    pagination,
    onView,
    onEdit,
    onDelete,
    onNotes,
    onStatusChange,
    onPriorityChange,
    statusUpdatingId,
    priorityUpdatingId,
}: ApplicationsTableViewProps) {
    const [openStatusId, setOpenStatusId] = useState<string | null>(null);
    const [openPriorityId, setOpenPriorityId] = useState<string | null>(null);

    const columns: TableColumn<JobApplication>[] = [
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
            align: 'center',
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
            align: 'center',
            render: (item) => (
                <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md font-medium text-zinc-600 dark:text-zinc-400">
                    {item.source || 'Direct'}
                </span>
            ),
        },
        {
            header: 'Work Mode',
            accessorKey: 'workMode',
            align: 'center',
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
                        {item.workMode?.replace(/_/g, ' ') || 'N/A'}
                    </span>
                );
            }
        },
        {
            header: 'Priority',
            accessorKey: 'priority',
            align: 'center',
            render: (item) => (
                <PriorityCell
                    item={item}
                    isOpen={openPriorityId === item.id}
                    isUpdating={priorityUpdatingId === item.id}
                    onToggle={() => {
                        setOpenPriorityId(openPriorityId === item.id ? null : item.id);
                        setOpenStatusId(null);
                    }}
                    onSelect={(priority) => {
                        onPriorityChange?.(item.id, priority);
                        setOpenPriorityId(null);
                    }}
                    onClose={() => setOpenPriorityId(null)}
                />
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            align: 'center',
            render: (item) => (
                <StatusCell
                    item={item}
                    isOpen={openStatusId === item.id}
                    isUpdating={statusUpdatingId === item.id}
                    onToggle={() => {
                        setOpenStatusId(openStatusId === item.id ? null : item.id);
                        setOpenPriorityId(null);
                    }}
                    onSelect={(status) => {
                        onStatusChange?.(item.id, status);
                        setOpenStatusId(null);
                    }}
                    onClose={() => setOpenStatusId(null)}
                />
            ),
        },
        {
            header: 'Applied On',
            accessorKey: 'appliedAt',
            align: 'center',
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
                <div className="flex items-center gap-1">
                    <button onClick={() => onView?.(item)} className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="View Details">
                        <Eye size={15} />
                    </button>
                    <button onClick={() => onEdit?.(item)} className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Edit">
                        <Pencil size={15} />
                    </button>
                    <button onClick={() => onNotes?.(item)} className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Notes">
                        <ClipboardList size={15} />
                    </button>
                    <button className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors opacity-40 cursor-not-allowed" title="Upload CV (coming soon)">
                        <Upload size={15} />
                    </button>
                    <button onClick={() => onDelete?.(item)} className="p-1.5 text-red-500 hover:text-red-700 transition-colors" title="Delete">
                        <Trash2 size={15} />
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
