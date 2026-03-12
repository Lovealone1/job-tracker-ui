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
    MessageSquare,
    CalendarClock,
    Check,
} from 'lucide-react';
import { CrudTable } from '@/components/shared/crud-table';
import { InterviewSummary, InterviewStatus, InterviewType } from '@/types/interview';
import { TableColumn } from '@/types/crud';
import { cn } from '@/lib/utils';

interface InterviewsTableViewProps {
    data: InterviewSummary[];
    isLoading: boolean;
    pagination?: any;
    onView?: (item: InterviewSummary) => void;
    onEdit?: (item: InterviewSummary) => void;
    onDelete?: (item: InterviewSummary) => void;
    onNotes?: (item: InterviewSummary) => void;
    onFeedback?: (item: InterviewSummary) => void;
    onReschedule?: (item: InterviewSummary) => void;
    onStatusChange?: (id: string, status: InterviewStatus) => void;
    statusUpdatingId?: string | null;
}

const statusColors: Record<InterviewStatus, string> = {
    [InterviewStatus.SCHEDULED]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    [InterviewStatus.COMPLETED]: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    [InterviewStatus.CANCELED]: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    [InterviewStatus.RESCHEDULED]: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    [InterviewStatus.NO_SHOW]: 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300',
};

const typeColors: Record<InterviewType, string> = {
    [InterviewType.SCREENING]: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
    [InterviewType.HR]: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
    [InterviewType.TECHNICAL]: 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
    [InterviewType.CULTURAL]: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    [InterviewType.BEHAVIORAL]: 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
    [InterviewType.CASE_STUDY]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    [InterviewType.FINAL]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    [InterviewType.OTHER]: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
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
    item: InterviewSummary;
    isOpen: boolean;
    isUpdating: boolean;
    onToggle: () => void;
    onSelect: (status: InterviewStatus) => void;
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
                    items={Object.values(InterviewStatus)}
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

/* ── Main table view ──────────────────────────────────────── */

export function InterviewsTableView({
    data,
    isLoading,
    pagination,
    onView,
    onEdit,
    onDelete,
    onNotes,
    onFeedback,
    onReschedule,
    onStatusChange,
    statusUpdatingId,
}: InterviewsTableViewProps) {
    const [openStatusId, setOpenStatusId] = useState<string | null>(null);

    const columns: TableColumn<InterviewSummary>[] = [
        {
            header: 'Position',
            accessorKey: 'jobApplication',
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {item.jobApplication?.title || 'N/A'}
                    </span>
                    <span className="text-xs text-zinc-500">
                        {item.jobApplication?.company || ''}
                    </span>
                </div>
            ),
        },
        {
            header: 'Type',
            accessorKey: 'type',
            align: 'center',
            render: (item) => (
                <span className={cn(
                    'text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full',
                    typeColors[item.type]
                )}>
                    {item.type.replace(/_/g, ' ')}
                </span>
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
                    onToggle={() => setOpenStatusId(openStatusId === item.id ? null : item.id)}
                    onSelect={(status) => {
                        onStatusChange?.(item.id, status);
                        setOpenStatusId(null);
                    }}
                    onClose={() => setOpenStatusId(null)}
                />
            ),
        },
        {
            header: 'Scheduled At',
            accessorKey: 'scheduledAt',
            align: 'center',
            render: (item) => (
                <div className="flex flex-col text-xs text-center">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {format(new Date(item.scheduledAt), 'dd MMM yyyy', { locale: enUS })}
                    </span>
                    <span className="text-zinc-500">
                        {format(new Date(item.scheduledAt), 'HH:mm', { locale: enUS })}
                    </span>
                </div>
            ),
        },
        {
            header: 'Duration',
            accessorKey: 'durationMinutes',
            align: 'center',
            render: (item) => (
                <span className="text-xs text-zinc-500">
                    {item.durationMinutes ? `${item.durationMinutes} min` : '—'}
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
                    <button onClick={() => onReschedule?.(item)} className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Reschedule">
                        <CalendarClock size={15} />
                    </button>
                    <button onClick={() => onNotes?.(item)} className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Notes">
                        <ClipboardList size={15} />
                    </button>
                    <button onClick={() => onFeedback?.(item)} className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Feedback">
                        <MessageSquare size={15} />
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
