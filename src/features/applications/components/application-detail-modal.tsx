'use client';

import React from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
    X,
    ExternalLink,
    MapPin,
    Building2,
    Briefcase,
    Calendar,
    DollarSign,
    Tag,
    Clock,
    FileText,
} from 'lucide-react';
import { JobApplication } from '@/types/job-application';

interface ApplicationDetailModalProps {
    application: JobApplication | null;
    isOpen: boolean;
    onClose: () => void;
}

function formatEnumLabel(value: string): string {
    return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
}

function formatDate(date?: string): string {
    if (!date) return '—';
    return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: enUS });
}

function formatCompensation(app: JobApplication): string {
    if (!app.compensationAmountMin && !app.compensationAmountMax) return '—';
    const cur = app.currency || 'USD';
    const min = app.compensationAmountMin?.toLocaleString();
    const max = app.compensationAmountMax?.toLocaleString();
    const type = app.compensationType ? ` / ${formatEnumLabel(app.compensationType)}` : '';
    if (min && max) return `${cur} ${min} – ${max}${type}`;
    if (min) return `${cur} ${min}+${type}`;
    return `Up to ${cur} ${max}${type}`;
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-2.5">
            <Icon size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">{label}</p>
                <div className="text-sm text-foreground">{value || '—'}</div>
            </div>
        </div>
    );
}

export function ApplicationDetailModal({ application, isOpen, onClose }: ApplicationDetailModalProps) {
    if (!isOpen || !application) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold truncate">{application.title}</h2>
                        <p className="text-sm text-muted-foreground">{application.company}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-1">
                    {/* Status & Priority badges */}
                    <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-border">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#A600FF]/10 text-[#A600FF]">
                            {formatEnumLabel(application.status)}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                            {formatEnumLabel(application.priority)} priority
                        </span>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                        <InfoRow icon={MapPin} label="Location" value={[application.location, application.country].filter(Boolean).join(', ') || undefined} />
                        <InfoRow icon={Building2} label="Source" value={application.source} />
                        <InfoRow icon={Briefcase} label="Work Mode" value={application.workMode ? formatEnumLabel(application.workMode) : undefined} />
                        <InfoRow icon={Briefcase} label="Employment Type" value={application.employmentType ? formatEnumLabel(application.employmentType) : undefined} />
                        <InfoRow icon={Tag} label="Contract Type" value={application.contractType ? formatEnumLabel(application.contractType) : undefined} />
                        <InfoRow icon={Tag} label="Seniority Level" value={application.seniorityLevel} />
                        <InfoRow icon={DollarSign} label="Compensation" value={formatCompensation(application)} />
                        <InfoRow icon={Tag} label="Benefits" value={application.benefits} />
                        <InfoRow icon={FileText} label="Linked Resume" value={application.resumeVariant?.title || 'None linked'} />
                    </div>

                    {/* Job URL */}
                    {application.jobUrl && (
                        <div className="pt-2 border-t border-border">
                            <a
                                href={application.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-[#A600FF] hover:underline font-medium"
                            >
                                <ExternalLink size={14} />
                                View original posting
                            </a>
                        </div>
                    )}

                    {/* Description */}
                    {application.description && (
                        <div className="pt-2 border-t border-border">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Description</p>
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{application.description}</p>
                        </div>
                    )}

                    {/* Notes */}
                    {application.notes && (
                        <div className="pt-2 border-t border-border">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Notes</p>
                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{application.notes}</p>
                        </div>
                    )}

                    {/* Dates */}
                    <div className="pt-3 border-t border-border">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Timeline</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            <InfoRow icon={Calendar} label="Saved At" value={formatDate(application.savedAt)} />
                            <InfoRow icon={Calendar} label="Applied At" value={formatDate(application.appliedAt)} />
                            <InfoRow icon={Clock} label="Created" value={formatDate(application.createdAt)} />
                            <InfoRow icon={Clock} label="Last Updated" value={formatDate(application.updatedAt)} />
                            {application.closedAt && <InfoRow icon={Calendar} label="Closed At" value={formatDate(application.closedAt)} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
