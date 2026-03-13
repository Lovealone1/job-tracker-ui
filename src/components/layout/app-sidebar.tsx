'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    Briefcase,
    LayoutDashboard,
    FileText,
    MessageSquare,
    CalendarClock,
    Settings,
    Sun,
    Moon,
    ChevronsLeft,
    LogOut,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import { authService } from '@/services/auth-service';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Applications', href: '/applications', icon: Briefcase },
    { label: 'Interviews', href: '/interviews', icon: MessageSquare },
    { label: 'Resumes', href: '/resumes', icon: FileText },
    { label: 'Reminders', href: '/reminders', icon: CalendarClock },
];

function getUserDisplayName(user: { firstName?: string | null; lastName?: string | null; email: string }): string {
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : user.email.split('@')[0];
}

function getUserInitials(user: { firstName?: string | null; lastName?: string | null; email: string }): string {
    if (user.firstName || user.lastName) {
        return [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase();
    }
    return user.email[0].toUpperCase();
}

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isCollapsed, toggleCollapsed } = useSidebar();
    const { resolvedTheme, setTheme } = useTheme();
    const { data: user, isLoading: isUserLoading } = useCurrentUser();

    const isDark = resolvedTheme === 'dark';

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    return (
        <aside
            className={`
                fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden
                border-r border-sidebar-border bg-sidebar text-sidebar-foreground
                transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isCollapsed ? 'w-[68px]' : 'w-[260px]'}
            `}
        >
            {/* ═══════ HEADER CARD ═══════ */}
            <div className={isCollapsed ? 'w-full py-3' : 'p-3'}>
                <div
                    onClick={toggleCollapsed}
                    className={`
                        flex items-center cursor-pointer
                        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${isCollapsed
                            ? 'w-full justify-center'
                            : 'justify-between gap-3 rounded-xl bg-sidebar-accent/60 p-3 backdrop-blur-sm border border-sidebar-border hover:bg-sidebar-accent/80'
                        }
                    `}
                >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform duration-300">
                            <Briefcase size={18} />
                        </div>
                        {!isCollapsed && (
                            <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                                Job Tracker
                            </span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground">
                            <ChevronsLeft size={16} />
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════ DIVIDER ═══════ */}
            <div className="mx-3">
                <div className="h-px bg-sidebar-border" />
            </div>

            {/* ═══════ NAVIGATION MENU ═══════ */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3">
                <div className="space-y-1">
                    <span
                        className={`
                            mb-2 block px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap
                            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                            ${isCollapsed ? 'h-0 opacity-0 mb-0 overflow-hidden' : 'h-auto opacity-100'}
                        `}
                    >
                        Menu
                    </span>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.label : undefined}
                                className={`
                                    group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium overflow-hidden
                                    transition-all duration-200
                                    ${isCollapsed ? 'justify-center gap-0' : 'gap-3'}
                                    ${isActive
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    }
                                `}
                            >
                                <Icon size={18} className="shrink-0" />
                                <span
                                    className={`
                                        truncate whitespace-nowrap
                                        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                                        ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                                    `}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* ═══════ DIVIDER ═══════ */}
            <div className="mx-3">
                <div className="h-px bg-sidebar-border" />
            </div>

            {/* ═══════ SETTINGS SECTION ═══════ */}
            <div className="px-3 py-3">
                <span
                    className={`
                        mb-2 block px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap
                        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${isCollapsed ? 'h-0 opacity-0 mb-0 overflow-hidden' : 'h-auto opacity-100'}
                    `}
                >
                    Settings
                </span>
                <div className="space-y-1">
                    <button
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        title={isCollapsed ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
                        className={`
                            group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium overflow-hidden
                            text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                            transition-all duration-200
                            ${isCollapsed ? 'justify-center gap-0' : 'gap-3'}
                        `}
                    >
                        {isDark ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
                        <span
                            className={`
                                whitespace-nowrap
                                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                                ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                            `}
                        >
                            {isDark ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                    <Link
                        href="/settings"
                        title={isCollapsed ? 'Settings' : undefined}
                        className={`
                            group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium overflow-hidden
                            text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                            transition-all duration-200
                            ${isCollapsed ? 'justify-center gap-0' : 'gap-3'}
                            ${pathname === '/settings' ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : ''}
                        `}
                    >
                        <Settings size={18} className="shrink-0" />
                        <span
                            className={`
                                whitespace-nowrap
                                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                                ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                            `}
                        >
                            Settings
                        </span>
                    </Link>
                </div>
            </div>

            {/* ═══════ DIVIDER ═══════ */}
            <div className="mx-3">
                <div className="h-px bg-sidebar-border" />
            </div>

            {/* ═══════ USER CARD FOOTER ═══════ */}
            <div className="p-3">
                <div
                    className={`
                        flex items-center overflow-hidden
                        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${isCollapsed
                            ? 'justify-center p-0'
                            : 'gap-3 rounded-xl bg-sidebar-accent/60 p-3 backdrop-blur-sm border border-sidebar-border'
                        }
                    `}
                >
                    {/* Avatar */}
                    {isUserLoading ? (
                        <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />
                    ) : user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={getUserDisplayName(user)}
                            className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-sidebar-border"
                        />
                    ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold ring-2 ring-sidebar-border">
                            {user ? getUserInitials(user) : '?'}
                        </div>
                    )}

                    {/* User info + logout — animated */}
                    <div
                        className={`
                            flex items-center gap-3 min-w-0
                            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                            ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto flex-1 opacity-100'}
                        `}
                    >
                        <div className="min-w-0 flex-1">
                            {isUserLoading ? (
                                <>
                                    <div className="h-3.5 w-24 animate-pulse rounded bg-muted mb-1" />
                                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                                </>
                            ) : user ? (
                                <>
                                    <p className="truncate text-sm font-semibold leading-tight whitespace-nowrap">
                                        {getUserDisplayName(user)}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground leading-tight mt-0.5 whitespace-nowrap">
                                        {user.email}
                                    </p>
                                </>
                            ) : (
                                <p className="text-xs text-muted-foreground whitespace-nowrap">Not signed in</p>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            title="Sign out"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
