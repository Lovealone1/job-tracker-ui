'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth-service';

/**
 * Auth guard component — redirects to /login if not authenticated.
 * The session lives in an httpOnly cookie (not readable from JS), so the
 * check is done server-side via /auth/me. Children only render once auth
 * is confirmed.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        let mounted = true;

        authService.me().then((user) => {
            if (!mounted) return;
            if (!user) {
                router.replace('/login');
            } else {
                setIsAuthed(true);
            }
            setIsChecking(false);
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
