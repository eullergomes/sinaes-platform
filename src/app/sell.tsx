'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
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
          <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b px-8">
          {currentCourseId && (
            <div className="mr-auto text-sm text-muted-foreground">
              Curso ativo: <span className="font-medium text-foreground">{currentCourseId}</span>
            </div>
          )}
          <PendingAlerts />
          {/* <SidebarTrigger className="-ml-1" /> */}
        </header>
        )}

        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
