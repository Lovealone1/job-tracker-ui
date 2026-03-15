'use client';

import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { TopHeader } from '@/components/layout/top-header';
import { AuthGuard } from '@/components/auth/auth-guard';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <div
                className={`
                    flex flex-1 flex-col h-screen overflow-hidden
                    transition-[margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isCollapsed ? 'ml-0 md:ml-[68px]' : 'ml-0 md:ml-[260px]'}
                `}
            >
                <TopHeader />
                <main className="flex-1 px-4 py-3 overflow-y-auto custom-scrollbar">
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
