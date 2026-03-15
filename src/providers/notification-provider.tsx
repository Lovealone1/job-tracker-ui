'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster, toast } from 'sonner';
import { useTheme } from 'next-themes';

interface NotificationContextType {
    showNotification: (message: string, options?: any) => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { theme } = useTheme();

    const showNotification = (message: string, options?: any) => {
        toast(message, options);
    };

    const showSuccess = (message: string) => {
        toast.success(message);
    };

    const showError = (message: string) => {
        toast.error(message);
    };

    return (
        <NotificationContext.Provider value={{ showNotification, showSuccess, showError }}>
            {children}
            <Toaster 
                theme={theme as any} 
                position="top-right"
                expand={true}
                richColors
                closeButton
                toastOptions={{
                    style: {
                        background: 'rgba(var(--background), 0.8)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(var(--border), 0.5)',
                        borderRadius: '1.25rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    },
                    className: 'glass-toast',
                }}
            />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
