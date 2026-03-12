'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextAreaModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    label: string;
    initialValue: string;
    onSave: (value: string) => Promise<void>;
    isLoading?: boolean;
}

export function TextAreaModal({ isOpen, onClose, title, label, initialValue, onSave, isLoading }: TextAreaModalProps) {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (isOpen) setValue(initialValue);
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-black text-zinc-900 dark:text-white">{title}</h2>
                    {!isLoading && (
                        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>
                <div className="p-6 space-y-4">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#A600FF]"
                        disabled={isLoading}
                    />
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            onClick={async () => { await onSave(value); onClose(); }}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#A600FF] rounded-lg hover:bg-[#8B00D6] transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
