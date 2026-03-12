'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { InterviewType, CreateInterviewDto, UpdateInterviewDto } from '@/types/interview';
import { JobApplication } from '@/types/job-application';
import { cn } from '@/lib/utils';

interface CreateInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    jobApplications: JobApplication[];
    jobApplicationsLoading?: boolean;
    initialData?: any;
    mode?: 'create' | 'edit';
}

const typeOptions = Object.values(InterviewType).map((t) => ({
    label: t.replace(/_/g, ' '),
    value: t,
}));

export function CreateInterviewModal({ isOpen, onClose, onSubmit, isLoading, jobApplications, jobApplicationsLoading, initialData, mode = 'create' }: CreateInterviewModalProps) {
    const isEdit = mode === 'edit';
    const [form, setForm] = useState<Partial<CreateInterviewDto>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setForm(initialData || {});
            setErrors({});
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (name: string, value: any) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const n = { ...prev };
                delete n[name];
                return n;
            });
        }
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!isEdit && !form.jobApplicationId) e.jobApplicationId = 'Required';
        if (!form.type) e.type = 'Required';
        if (!form.scheduledAt) e.scheduledAt = 'Required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;
        await onSubmit(form as CreateInterviewDto);
    };

    const inputClass = (name: string) => cn(
        "w-full px-3 py-2 bg-white dark:bg-zinc-950 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF] transition-colors disabled:opacity-50",
        errors[name] ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">{isEdit ? 'Edit Interview' : 'Schedule Interview'}</h2>
                    {!isLoading && (
                        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                            <X size={24} />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Job Application */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Job Application *</label>
                            <select
                                value={form.jobApplicationId || ''}
                                onChange={(e) => handleChange('jobApplicationId', e.target.value)}
                                className={inputClass('jobApplicationId')}
                                disabled={isLoading || jobApplicationsLoading || isEdit}
                            >
                                <option value="" disabled>
                                    {jobApplicationsLoading ? 'Loading applications...' : 'Select a job application'}
                                </option>
                                {jobApplications.map((app) => (
                                    <option key={app.id} value={app.id}>
                                        {app.title} — {app.company}
                                    </option>
                                ))}
                            </select>
                            {errors.jobApplicationId && <span className="text-xs text-red-500">{errors.jobApplicationId}</span>}
                        </div>

                        {/* Type */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Interview Type *</label>
                            <select
                                value={form.type || ''}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className={inputClass('type')}
                                disabled={isLoading}
                            >
                                <option value="" disabled>Select type</option>
                                {typeOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
                        </div>

                        {/* Scheduled At */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Scheduled Date & Time *</label>
                            <input
                                type="datetime-local"
                                value={form.scheduledAt ? new Date(form.scheduledAt).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleChange('scheduledAt', e.target.value ? new Date(e.target.value).toISOString() : '')}
                                className={inputClass('scheduledAt')}
                                disabled={isLoading}
                            />
                            {errors.scheduledAt && <span className="text-xs text-red-500">{errors.scheduledAt}</span>}
                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Duration (minutes)</label>
                            <input
                                type="number"
                                min={1}
                                value={form.durationMinutes || ''}
                                onChange={(e) => handleChange('durationMinutes', e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="60"
                                className={inputClass('durationMinutes')}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Timezone */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Timezone</label>
                            <input
                                type="text"
                                value={form.timezone || ''}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                                placeholder="America/Bogota"
                                className={inputClass('timezone')}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location</label>
                            <input
                                type="text"
                                value={form.location || ''}
                                onChange={(e) => handleChange('location', e.target.value)}
                                placeholder="Office address..."
                                className={inputClass('location')}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Meeting URL */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Meeting URL</label>
                            <input
                                type="url"
                                value={form.meetingUrl || ''}
                                onChange={(e) => handleChange('meetingUrl', e.target.value)}
                                placeholder="https://meet.google.com/..."
                                className={inputClass('meetingUrl')}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Interviewer Name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Interviewer Name</label>
                            <input
                                type="text"
                                value={form.interviewerName || ''}
                                onChange={(e) => handleChange('interviewerName', e.target.value)}
                                placeholder="Jane Doe"
                                className={inputClass('interviewerName')}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Interviewer Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Interviewer Email</label>
                            <input
                                type="email"
                                value={form.interviewerEmail || ''}
                                onChange={(e) => handleChange('interviewerEmail', e.target.value)}
                                placeholder="jane@company.com"
                                className={inputClass('interviewerEmail')}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Preparation Notes</label>
                            <textarea
                                value={form.notes || ''}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                rows={3}
                                placeholder="Topics to prepare, questions to ask..."
                                className={cn(inputClass('notes'), 'resize-none')}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-bold text-white bg-[#A600FF] rounded-lg hover:bg-[#8B00D6] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                            {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {isEdit ? 'Save Changes' : 'Schedule Interview'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
