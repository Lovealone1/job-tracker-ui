'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/services/api-client';
import { authService } from '@/services/auth-service';
import { User } from '@/types/auth';

/**
 * Auth guard component — redirects to /login if not authenticated.
 * The session lives in an httpOnly cookie (not readable from JS), so the
 * check is done server-side via /auth/me. Children only render once auth
 * is confirmed.
 *
 * The call goes through `apiClient` on purpose: its response interceptor
 * turns a 401 into a refresh + retry. Calling axios directly here would skip
 * that and bounce users to /login on every expired access token, even when
 * their refresh token was still valid.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        let mounted = true;

        apiClient
            .get<User>('/auth/me')
            .then(() => {
                authService.markSessionActive();
                if (mounted) setIsAuthed(true);
            })
            .catch(() => {
                authService.markSessionInactive();
                if (mounted) router.replace('/login');
            })
            .finally(() => {
                if (mounted) setIsChecking(false);
            });

        return () => {
            mounted = false;
        };
    }, [router]);

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
            </div>
        );
    }

    if (!isAuthed) return null;

    return <>{children}</>;
}
