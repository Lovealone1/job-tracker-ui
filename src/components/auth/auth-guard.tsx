'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth-service';

/**
 * Auth guard component — redirects to /login if not authenticated.
 * Wraps children and only renders them once auth is confirmed.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        const session = authService.getSession();
        if (!session) {
            router.replace('/login');
        } else {
            setIsAuthed(true);
        }
        setIsChecking(false);
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
