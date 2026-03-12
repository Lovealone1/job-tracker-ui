'use client';

import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { TopHeader } from '@/components/layout/top-header';
import { AuthGuard } from '@/components/auth/auth-guard';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <div
                className={`
                    flex flex-1 flex-col min-h-screen
                    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isCollapsed ? 'ml-[68px]' : 'ml-[260px]'}
                `}
            >
                <TopHeader />
                <main className="flex-1 px-4 py-3">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <DashboardContent>{children}</DashboardContent>
            </SidebarProvider>
        </AuthGuard>
    );
}
