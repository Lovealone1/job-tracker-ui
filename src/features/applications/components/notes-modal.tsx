'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialNotes: string;
    applicationTitle: string;
    onSave: (notes: string) => Promise<void>;
    isLoading?: boolean;
}

export function NotesModal({ isOpen, onClose, initialNotes, applicationTitle, onSave, isLoading }: NotesModalProps) {
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        await onSave(notes);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground shadow-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold">Notes</h3>
                        <p className="text-xs text-muted-foreground truncate">{applicationTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={8}
                        placeholder="Add your notes about this application..."
                        className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#A600FF]/50 transition-all"
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3.5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#A600FF] rounded-lg hover:bg-[#8B00D6] transition-colors disabled:opacity-50"
                    >
                        {isLoading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                        <Save size={14} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
