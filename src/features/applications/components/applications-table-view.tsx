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
    FileText,
    X,
    ChevronLeft,
    ChevronRight,
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
    onResumeVariantChange?: (id: string, variantId: string) => void;
    statusUpdatingId?: string | null;
    priorityUpdatingId?: string | null;
    resumeVariants?: { id: string; title: string }[];
}

const statusColors: Record<JobApplicationStatus, string> = {
    [JobApplicationStatus.SAVED]: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    [JobApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    [JobApplicationStatus.INTERVIEWING]: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    [JobApplicationStatus.OFFER_RECEIVED]: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
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

/* ── Resume Link Modal ────────────────────────────────────── */

function ResumeLinkModal({
    isOpen,
    onClose,
    onSelect,
    currentId,
    variants = [],
    applicationTitle,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (id: string) => void;
    currentId?: string;
    variants?: { id: string; title: string }[];
    applicationTitle: string;
}) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(variants.length / itemsPerPage);

    // Reset page when modal opens
    useEffect(() => {
        if (isOpen) setPage(1);
    }, [isOpen]);

    if (!isOpen) return null;

    const startIndex = (page - 1) * itemsPerPage;
    const displayedVariants = variants.slice(startIndex, startIndex + itemsPerPage);

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="border-b border-border p-5 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Link CV Variant</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        Application: <span className="text-zinc-600 dark:text-zinc-400 font-medium">{applicationTitle}</span>
                    </p>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-1.5">
                    {/* Unlink option always on first page */}
                    {page === 1 && (
                        <button
                            onClick={() => { onSelect(''); onClose(); }}
                            className={cn(
                                'group w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border',
                                !currentId ? 'bg-zinc-100/80 border-zinc-200 dark:bg-zinc-800/80 dark:border-zinc-700' : 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                            )}
                        >
                            <div className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors',
                                !currentId ? 'bg-zinc-200 border-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:border-zinc-600' : 'bg-zinc-50 border-zinc-100 text-zinc-400 group-hover:bg-zinc-100'
                            )}>
                                <X size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Unlink CV</p>
                                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">No specific CV variant</p>
                            </div>
                            {!currentId && <Check size={18} className="text-zinc-400" />}
                        </button>
                    )}

                    {displayedVariants.map((v) => {
                        const isCurrent = v.id === currentId;
                        return (
                            <button
                                key={v.id}
                                onClick={() => { onSelect(v.id); onClose(); }}
                                className={cn(
                                    'group w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border',
                                    isCurrent ? 'bg-zinc-100/80 border-zinc-200 dark:bg-zinc-800/80 dark:border-zinc-700' : 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                                )}
                            >
                                <div className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors',
                                    isCurrent ? 'bg-zinc-200 border-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:border-zinc-600' : 'bg-zinc-50 border-zinc-100 text-zinc-400 group-hover:bg-zinc-100'
                                )}>
                                    <FileText size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200 truncate">{v.title}</p>
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Specialized Variant</p>
                                </div>
                                {isCurrent && <Check size={18} className="text-zinc-400" />}
                            </button>
                        );
                    })}

                    {variants.length === 0 && (
                        <div className="text-center py-10">
                            <FileText size={40} className="mx-auto text-zinc-200 mb-3" />
                            <p className="text-sm text-zinc-500 font-medium">No resume variants found</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center justify-between border-t border-border/50">
                    <div className="flex items-center gap-2">
                        {totalPages > 1 && (
                            <>
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors uppercase tracking-widest"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ── Resume cell ────────────────────────────────────────── */

function ResumeCell({
    item,
    onToggle,
}: {
    item: JobApplication;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={cn(
                'flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter px-2.5 py-1.5 rounded-lg transition-all cursor-pointer',
                'hover:ring-2 hover:ring-[#A600FF]/30 active:scale-95',
                item.resumeVariant ? 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100 shadow-sm' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
            )}
            title={item.resumeVariant?.title || 'Link CV Variant'}
        >
            <FileText size={12} className={cn(item.resumeVariant ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-400')} />
            <span className="truncate max-w-[80px]">
                {item.resumeVariant?.title || 'No CV'}
            </span>
        </button>
    );
}


/* ── Mobile card view ──────────────────────────────────────── */

function MobileApplicationCard({
    item,
    onView,
    onEdit,
    onDelete,
    onNotes,
    onStatusToggle,
    onPriorityToggle,
    onLinkToggle,
    isStatusOpen,
    isPriorityOpen,
    statusUpdatingId,
    priorityUpdatingId,
    onStatusSelect,
    onPrioritySelect,
    onStatusClose,
    onPriorityClose
}: {
    item: JobApplication;
    onView?: (item: JobApplication) => void;
    onEdit?: (item: JobApplication) => void;
    onDelete?: (item: JobApplication) => void;
    onNotes?: (item: JobApplication) => void;
    onStatusToggle: () => void;
    onPriorityToggle: () => void;
    onLinkToggle: () => void;
    isStatusOpen: boolean;
    isPriorityOpen: boolean;
    statusUpdatingId?: string | null;
    priorityUpdatingId?: string | null;
    onStatusSelect: (status: JobApplicationStatus) => void;
    onPrioritySelect: (priority: Priority) => void;
    onStatusClose: () => void;
    onPriorityClose: () => void;
}) {
    return (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm">
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight truncate">{item.title}</span>
                    <span className="text-sm text-zinc-500 font-medium truncate">{item.company}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                     <button onClick={() => onView?.(item)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="View Details">
                        <Eye size={18} />
                    </button>
                    <button onClick={() => onEdit?.(item)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors" title="Edit">
                        <Pencil size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</p>
                    <StatusCell
                        item={item}
                        isOpen={isStatusOpen}
                        isUpdating={statusUpdatingId === item.id}
                        onToggle={onStatusToggle}
                        onSelect={onStatusSelect}
                        onClose={onStatusClose}
                    />
                </div>
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Priority</p>
                    <PriorityCell
                        item={item}
                        isOpen={isPriorityOpen}
                        isUpdating={priorityUpdatingId === item.id}
                        onToggle={onPriorityToggle}
                        onSelect={onPrioritySelect}
                        onClose={onPriorityClose}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Info</p>
                    <div className="flex flex-col gap-0.5">
                         <span className="text-xs text-zinc-700 dark:text-zinc-300 font-bold truncate">
                            {item.location || 'N/A'}{item.country ? `, ${item.country}` : ''}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                            {item.workMode?.replace(/_/g, ' ') || 'N/A'}
                        </span>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">CV Variant</p>
                    <ResumeCell
                        item={item}
                        onToggle={onLinkToggle}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800/30">
                <div className="flex items-center gap-2">
                     <button onClick={() => onNotes?.(item)} className="p-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl transition-colors" title="Notes">
                        <ClipboardList size={16} />
                    </button>
                     <button onClick={() => onDelete?.(item)} className="p-2 bg-red-50 dark:bg-red-900/10 text-red-500 hover:text-red-700 rounded-xl transition-colors" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    {item.appliedAt
                        ? `${format(new Date(item.appliedAt), 'MMM dd, yyyy')}`
                        : 'Not applied'}
                </span>
            </div>
        </div>
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
    resumeVariants = [],
    onResumeVariantChange,
}: ApplicationsTableViewProps) {
    const [openStatusId, setOpenStatusId] = useState<string | null>(null);
    const [openPriorityId, setOpenPriorityId] = useState<string | null>(null);
    const [linkingItem, setLinkingItem] = useState<JobApplication | null>(null);

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
            className: 'hidden md:table-cell',
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
            className: 'hidden md:table-cell',
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
            className: 'hidden md:table-cell',
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
            header: 'CV Variant',
            accessorKey: 'resumeVariantId',
            align: 'center',
            render: (item) => (
                <ResumeCell
                    item={item}
                    onToggle={() => setLinkingItem(item)}
                />
            )
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
            className: 'hidden md:table-cell',
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
                    <button onClick={() => onDelete?.(item)} className="p-1.5 text-red-500 hover:text-red-700 transition-colors" title="Delete">
                        <Trash2 size={15} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block">
                <CrudTable
                    data={data}
                    columns={columns}
                    isLoading={isLoading}
                    pagination={pagination}
                />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4 pb-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                         <div className="w-8 h-8 border-[3px] border-zinc-200 border-t-[#A600FF] rounded-full animate-spin mb-4" />
                         <span className="text-sm text-zinc-400 font-bold uppercase tracking-widest">Loading...</span>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
                        <p className="text-zinc-500 font-medium">No applications found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {data.map((item) => (
                                <MobileApplicationCard
                                    key={item.id}
                                    item={item}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onNotes={onNotes}
                                    onStatusToggle={() => {
                                        setOpenStatusId(openStatusId === item.id ? null : item.id);
                                        setOpenPriorityId(null);
                                    }}
                                    onPriorityToggle={() => {
                                        setOpenPriorityId(openPriorityId === item.id ? null : item.id);
                                        setOpenStatusId(null);
                                    }}
                                    onLinkToggle={() => setLinkingItem(item)}
                                    isStatusOpen={openStatusId === item.id}
                                    isPriorityOpen={openPriorityId === item.id}
                                    statusUpdatingId={statusUpdatingId}
                                    priorityUpdatingId={priorityUpdatingId}
                                    onStatusSelect={(status) => {
                                        onStatusChange?.(item.id, status);
                                        setOpenStatusId(null);
                                    }}
                                    onPrioritySelect={(priority) => {
                                        onPriorityChange?.(item.id, priority);
                                        setOpenPriorityId(null);
                                    }}
                                    onStatusClose={() => setOpenStatusId(null)}
                                    onPriorityClose={() => setOpenPriorityId(null)}
                                />
                            ))}
                        </div>

                        {/* Mobile Pagination */}
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

            <ResumeLinkModal
                isOpen={!!linkingItem}
                onClose={() => setLinkingItem(null)}
                onSelect={(id: string) => linkingItem && onResumeVariantChange?.(linkingItem.id, id)}
                currentId={linkingItem?.resumeVariantId}
                variants={resumeVariants}
                applicationTitle={linkingItem?.title || ''}
            />
        </>
    );
}
