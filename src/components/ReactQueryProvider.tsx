'use client';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export default function ReactQueryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 min
            gcTime: 30 * 60 * 1000, // 30 min in-memory
            retry: 1
          }
        }
      })
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const persister = createSyncStoragePersister({
      storage: window.localStorage
    });

    persistQueryClient({
      queryClient,
      persister,
      maxAge: 6 * 60 * 60 * 1000 // 6h de validade para dados persistidos
    });
  }, [queryClient]);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
