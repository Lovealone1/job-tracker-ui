'use client';

import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { authService } from '@/services/auth-service';

export function TempTokenInput() {
    const [token, setToken] = useState('');

    const handleSave = () => {
        if (!token) return;
        
        // Manual session creation for testing
        const dummySession = {
            access_token: token,
            refresh_token: '',
            user: {
                id: 'temp-user',
                email: 'test@example.com',
                role: 'USER'
            }
        };
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('job_tracker_auth', JSON.stringify(dummySession));
            window.location.reload(); // Reload to apply token
        }
    };

    return (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-6">
            <div className="flex items-center gap-3 mb-2 text-zinc-600 dark:text-zinc-400">
                <Key size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Validation Mode: Paste JWT</span>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Bearer token (without Bearer prefix)..."
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-colors"
                />
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                    Apply Token
                </button>
            </div>
        </div>
    );
}
