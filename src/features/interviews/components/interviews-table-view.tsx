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
    ChevronLeft,
    ChevronRight,
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

const statusConfig: Record<InterviewStatus, { badge: string; dot: string }> = {
    [InterviewStatus.SCHEDULED]: { 
        badge: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800/50', 
        dot: 'bg-blue-500' 
    },
    [InterviewStatus.COMPLETED]: { 
        badge: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800/50', 
        dot: 'bg-green-500' 
    },
    [InterviewStatus.CANCELED]: { 
        badge: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800/50', 
        dot: 'bg-red-500' 
    },
    [InterviewStatus.RESCHEDULED]: { 
        badge: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-800/50', 
        dot: 'bg-orange-500' 
    },
    [InterviewStatus.NO_SHOW]: { 
        badge: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700', 
        dot: 'bg-zinc-400' 
    },
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
    anchorRef: React.RefObject<HTMLElement | null>;
    renderItem: (val: T, isCurrent: boolean) => React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            // Add window scroll to positions
            setPos({ 
                top: rect.bottom + window.scrollY + 4, 
                left: rect.left + window.scrollX,
                width: Math.max(rect.width, 160)
            });
        }
    }, [anchorRef]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node) &&
                anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, anchorRef]);

    return createPortal(
        <div
            ref={ref}
            style={{ 
                top: pos.top, 
                left: pos.left,
                minWidth: pos.width
            }}
            className="fixed z-[9999] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl py-1 overflow-hidden"
        >
            {items.map((val) => (
                <button
                    key={val}
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelect(val);
                    }}
                    className={cn(
                        'flex w-full items-center gap-3 px-3 py-2.5 text-xs font-bold transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left',
                        val === currentValue ? 'text-[#A600FF] bg-[#A600FF]/5' : 'text-zinc-600 dark:text-zinc-400'
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
    isUpdating,
    onToggle,
}: {
    item: InterviewSummary;
    isUpdating: boolean;
    onToggle: (anchor: HTMLElement) => void;
}) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const cfg = statusConfig[item.status];

    return (
        <button
            ref={btnRef}
            onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                if (btnRef.current) onToggle(btnRef.current); 
            }}
            disabled={isUpdating}
            className={cn(
                'flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full transition-all cursor-pointer border border-transparent shadow-sm',
                'hover:ring-2 hover:ring-[#A600FF]/30 active:scale-95',
                cfg.badge,
                isUpdating && 'opacity-50'
            )}
        >
            <div className={cn('w-2 h-2 rounded-full ring-2 ring-white/50 dark:ring-black/20 shadow-sm', cfg.dot)} />
            {isUpdating ? (
                <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
            ) : (
                item.status.replace(/_/g, ' ')
            )}
        </button>
    );
}

/* ── Mobile card view ──────────────────────────────────────── */

function MobileInterviewCard({
    item,
    onView,
    onEdit,
    onDelete,
    onNotes,
    onFeedback,
    onReschedule,
    onStatusToggle,
    statusUpdatingId,
}: {
    item: InterviewSummary;
    onView?: (item: InterviewSummary) => void;
    onEdit?: (item: InterviewSummary) => void;
    onDelete?: (item: InterviewSummary) => void;
    onNotes?: (item: InterviewSummary) => void;
    onFeedback?: (item: InterviewSummary) => void;
    onReschedule?: (item: InterviewSummary) => void;
    onStatusToggle: (anchor: HTMLElement) => void;
    statusUpdatingId?: string | null;
}) {
    return (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight truncate">
                        {item.jobApplication?.title || 'N/A'}
                    </span>
                    <span className="text-sm text-zinc-500 font-medium truncate">
                        {item.jobApplication?.company || ''}
                    </span>
                </div>
                <div className="flex gap-1 shrink-0">
                    <button onClick={() => onView?.(item)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                        <Eye size={18} />
                    </button>
                    <button onClick={() => onEdit?.(item)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                        <Pencil size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Type</p>
                    <span className={cn(
                        'inline-flex text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full',
                        typeColors[item.type]
                    )}>
                        {item.type.replace(/_/g, ' ')}
                    </span>
                </div>
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</p>
                    <StatusCell
                        item={item}
                        isUpdating={statusUpdatingId === item.id}
                        onToggle={(anchor) => onStatusToggle(anchor)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Scheduled</p>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                             {format(new Date(item.scheduledAt), 'MMM dd, yyyy')}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                            {format(new Date(item.scheduledAt), 'HH:mm')} ({item.durationMinutes || '—'}m)
                        </span>
                    </div>
                </div>
                <div className="space-y-1.5 flex flex-col justify-end items-end">
                    <button 
                        onClick={() => onReschedule?.(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95"
                    >
                        <CalendarClock size={12} />
                        Reschedule
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800/30">
                <div className="flex items-center gap-2">
                    <button onClick={() => onNotes?.(item)} className="p-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl transition-colors" title="Notes">
                        <ClipboardList size={16} />
                    </button>
                    <button onClick={() => onFeedback?.(item)} className="p-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl transition-colors" title="Feedback">
                        <MessageSquare size={16} />
                    </button>
                    <button onClick={() => onDelete?.(item)} className="p-2 bg-red-50 dark:bg-red-900/10 text-red-500 hover:text-red-700 rounded-xl transition-colors" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
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
    const [openStatus, setOpenStatus] = useState<{ id: string; anchor: HTMLElement; item: InterviewSummary } | null>(null);
    const anchorRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (openStatus) {
            anchorRef.current = openStatus.anchor;
        }
    }, [openStatus]);

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
                    isUpdating={statusUpdatingId === item.id}
                    onToggle={(anchor) => setOpenStatus({ id: item.id, anchor, item })}
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
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <CrudTable
                    data={data}
                    columns={columns}
                    isLoading={isLoading}
                    pagination={pagination}
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 pb-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                        <div className="w-8 h-8 border-[3px] border-zinc-200 border-t-[#A600FF] rounded-full animate-spin mb-4" />
                        <span className="text-sm text-zinc-400 font-bold uppercase tracking-widest">Loading...</span>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
                        <p className="text-zinc-500 font-medium">No interviews found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {data.map((item) => (
                                <MobileInterviewCard
                                    key={item.id}
                                    item={item}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onNotes={onNotes}
                                    onFeedback={onFeedback}
                                    onReschedule={onReschedule}
                                    onStatusToggle={(anchor) => setOpenStatus({ id: item.id, anchor, item })}
                                    statusUpdatingId={statusUpdatingId}
                                />
                            ))}
                        </div>

                        {/* Pagination for Mobile */}
                        {pagination && (
                            <div className="flex items-center justify-between px-2 py-4 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                    Page {pagination.page + 1}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => pagination.onPageChange(Math.max(0, pagination.page - 1))}
                                        disabled={pagination.page === 0}
                                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 disabled:opacity-30"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                                        disabled={!pagination.hasMore}
                                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 disabled:opacity-30"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {openStatus && (
                <PortalDropdown
                    items={Object.values(InterviewStatus)}
                    currentValue={openStatus.item.status}
                    onSelect={(status) => {
                        onStatusChange?.(openStatus.id, status);
                        setOpenStatus(null);
                    }}
                    onClose={() => setOpenStatus(null)}
                    anchorRef={anchorRef}
                    renderItem={(status, isCurrent) => {
                        const cfg = statusConfig[status];
                        return (
                            <>
                                <div className={cn('w-2 h-2 rounded-full ring-1 ring-black/5', cfg.dot)} />
                                <span className="flex-1">{status.replace(/_/g, ' ')}</span>
                                {isCurrent && <Check size={14} className="text-[#A600FF]" />}
                            </>
                        );
                    }}
                />
            )}
        </>
    );
}
