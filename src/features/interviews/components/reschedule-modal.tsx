'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialScheduledAt?: string;
    initialDurationMinutes?: number;
    initialTimezone?: string;
    onSave: (data: { scheduledAt: string; durationMinutes?: number; timezone?: string }) => Promise<void>;
    isLoading?: boolean;
}

export function RescheduleModal({ isOpen, onClose, initialScheduledAt, initialDurationMinutes, initialTimezone, onSave, isLoading }: RescheduleModalProps) {
    const [scheduledAt, setScheduledAt] = useState('');
    const [durationMinutes, setDurationMinutes] = useState<number | ''>('');
    const [timezone, setTimezone] = useState('');

    useEffect(() => {
        if (isOpen) {
            setScheduledAt(initialScheduledAt ? new Date(initialScheduledAt).toISOString().slice(0, 16) : '');
            setDurationMinutes(initialDurationMinutes || '');
            setTimezone(initialTimezone || '');
        }
    }, [isOpen, initialScheduledAt, initialDurationMinutes, initialTimezone]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-black text-zinc-900 dark:text-white">Reschedule Interview</h2>
                    {!isLoading && (
                        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Date & Time *</label>
                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF]"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Duration (minutes)</label>
                        <input
                            type="number"
                            min={1}
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : '')}
                            placeholder="60"
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF]"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Timezone</label>
                        <input
                            type="text"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            placeholder="America/Bogota"
                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A600FF]"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                if (!scheduledAt) return;
                                await onSave({
                                    scheduledAt: new Date(scheduledAt).toISOString(),
                                    durationMinutes: durationMinutes || undefined,
                                    timezone: timezone || undefined,
                                });
                                onClose();
                            }}
                            disabled={isLoading || !scheduledAt}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#A600FF] rounded-lg hover:bg-[#8B00D6] transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Reschedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
