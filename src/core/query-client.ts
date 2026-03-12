'use client';

import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient, type PersistedClient } from '@tanstack/react-query-persist-client';
import { get, set, del } from 'idb-keyval';

// Custom IDB Persister for TanStack Query
const idbPersister = {
    persistClient: async (client: PersistedClient) => {
        await set('react-query-cache', client);
    },
    restoreClient: async () => {
        return await get<PersistedClient>('react-query-cache');
    },
    removeClient: async () => {
        await del('react-query-cache');
    },
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            retry: 3,
            refetchOnWindowFocus: false, // Better for tablet apps
            refetchOnReconnect: 'always',
        },
    },
});

// Initialize persistence
if (typeof window !== 'undefined') {
    persistQueryClient({
        queryClient,
        persister: idbPersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });
}
