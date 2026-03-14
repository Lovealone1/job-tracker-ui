import { NotificationProvider } from './notification-provider';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/query-client';
import { ReactNode } from 'react';
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="job-tracker-theme"
            disableTransitionOnChange
        >
            <NotificationProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
}
