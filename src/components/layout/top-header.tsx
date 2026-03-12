'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    applications: 'Applications',
    interviews: 'Interviews',
    cvs: 'CVs',
    reminders: 'Reminders',
    settings: 'Settings',
};

export function TopHeader() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = index === segments.length - 1;

        return { href, label, isLast };
    });

    return (
        <header className="sticky top-0 z-30 flex h-12 items-center border-b border-border bg-background/80 backdrop-blur-md px-6">
            <nav className="flex items-center gap-1.5 text-sm">
                <Link
                    href="/dashboard"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Home size={14} />
                </Link>
                {breadcrumbs.map((crumb) => (
                    <React.Fragment key={crumb.href}>
                        <ChevronRight size={12} className="text-muted-foreground/50" />
                        {crumb.isLast ? (
                            <span className="font-medium text-foreground">
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </header>
    );
}
