'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import PendingAlerts from '@/components/PendingAlerts';

const HIDE_SIDEBAR_PATHS = ['/courses'];

function extractCourseId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('courses');
  if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
  return null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = HIDE_SIDEBAR_PATHS.includes(pathname);
  const currentCourseId = extractCourseId(pathname);

  return (
    <SidebarProvider>
      {!hideSidebar && (
        <AppSidebar collapsible="icon" currentCourseId={currentCourseId} />
      )}

      <SidebarInset>
        {!hideSidebar && (
          <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b px-4 md:px-8 bg-gray-200">
            {/* Mobile trigger to open the sidebar */}
            <div className="sm:hidden">
              <SidebarTrigger
                className="-ml-1"
                aria-label="Abrir barra lateral"
              />
            </div>
            {currentCourseId && (
              <div className="text-muted-foreground mr-auto text-sm">
                Curso ativo:{' '}
                <span className="text-foreground font-medium">
                  {currentCourseId}
                </span>
              </div>
            )}
            <PendingAlerts />
          </header>
        )}

        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
