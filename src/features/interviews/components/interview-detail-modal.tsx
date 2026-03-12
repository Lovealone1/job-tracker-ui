'use client';

import React from 'react';
import { X, Clock, MapPin, Video, User, Mail, Calendar, FileText, MessageSquare } from 'lucide-react';
import { Interview, InterviewStatus, InterviewType } from '@/types/interview';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface InterviewDetailModalProps {
    interview: Interview | null;
    isOpen: boolean;
    onClose: () => void;
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

function formatDate(iso?: string) {
    if (!iso) return '—';
    return format(new Date(iso), 'dd MMM yyyy, HH:mm', { locale: enUS });
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
    if (!value || value === '—') return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon size={16} className="text-zinc-400 mt-0.5 shrink-0" />
            <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{label}</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{value}</p>
            </div>
        </div>
    );
}

export function InterviewDetailModal({ interview, isOpen, onClose }: InterviewDetailModalProps) {
    if (!isOpen || !interview) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h2 className="text-lg font-black text-zinc-900 dark:text-white">Interview Details</h2>
                        <p className="text-xs text-zinc-500 mt-1">
                            {interview.jobApplication?.title} at {interview.jobApplication?.company}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', typeColors[interview.type])}>
                            {interview.type.replace(/_/g, ' ')}
                        </span>
                        <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', statusColors[interview.status])}>
                            {interview.status.replace(/_/g, ' ')}
                        </span>
                    </div>

                    {/* Details */}
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        <DetailRow icon={Calendar} label="Scheduled At" value={formatDate(interview.scheduledAt)} />
                        <DetailRow icon={Clock} label="Duration" value={interview.durationMinutes ? `${interview.durationMinutes} minutes` : undefined} />
                        <DetailRow icon={Clock} label="Timezone" value={interview.timezone} />
                        <DetailRow icon={MapPin} label="Location" value={interview.location} />
                        <DetailRow
                            icon={Video}
                            label="Meeting Link"
                            value={interview.meetingUrl ? (
                                <a href={interview.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-[#A600FF] hover:underline break-all">
                                    {interview.meetingUrl}
                                </a>
                            ) : undefined}
                        />
                        <DetailRow icon={User} label="Interviewer" value={interview.interviewerName} />
                        <DetailRow icon={Mail} label="Interviewer Email" value={interview.interviewerEmail} />
                    </div>

                    {/* Notes */}
                    {interview.notes && (
                        <div className="pt-2">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText size={14} className="text-zinc-400" />
                                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Preparation Notes</span>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                                {interview.notes}
                            </p>
                        </div>
                    )}

                    {/* Feedback */}
                    {interview.feedback && (
                        <div className="pt-2">
                            <div className="flex items-center gap-2 mb-1">
                                <MessageSquare size={14} className="text-zinc-400" />
                                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Feedback</span>
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                                {interview.feedback}
                            </p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400">
                            <div>
                                <span className="block font-semibold">Created</span>
                                <span>{formatDate(interview.createdAt)}</span>
                            </div>
                            <div>
                                <span className="block font-semibold">Updated</span>
                                <span>{formatDate(interview.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
