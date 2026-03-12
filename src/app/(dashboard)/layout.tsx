'use client';

import { SidebarProvider, useSidebar } from '@/components/layout/sidebar-context';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AuthGuard } from '@/components/auth/auth-guard';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <main
                className={`
                    flex-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isCollapsed ? 'ml-[68px]' : 'ml-[260px]'}
                `}
            >
                {children}
            </main>
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
