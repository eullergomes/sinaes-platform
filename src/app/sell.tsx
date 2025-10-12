'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import PendingAlerts from '@/components/PendingAlerts';
import { Toaster } from "@/components/ui/sonner";

function extractCourseId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('courses');
  if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
  return null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Esconder sidebar em páginas sem curso selecionado: /courses e /courses/new
  const hideSidebar = pathname === '/courses' || pathname === '/courses/new';
  const currentCourseId = extractCourseId(pathname);

  return (
    <SidebarProvider>
      {!hideSidebar && (
        <AppSidebar collapsible="icon" currentCourseId={currentCourseId} />
      )}

      <SidebarInset>
        <header
          className={
            hideSidebar
              ? 'flex h-16 shrink-0 items-center gap-3 border-b bg-green-600 px-4 text-white md:px-8'
              : 'flex h-16 shrink-0 items-center justify-end gap-2 border-b bg-gray-200 px-4 md:px-8'
          }
        >
          {hideSidebar ? (
            <div className="flex items-center gap-3">
              <Image
                src="/assets/ifma-avalia-logo.png"
                alt="IFMA Avalia Logo"
                width={24}
                height={24}
                className="brightness-0 invert"
              />
              <span className="text-lg font-semibold">IFMA Avalia</span>
            </div>
          ) : (
            <>
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
              <div className="ml-auto">
                <PendingAlerts />
              </div>
            </>
          )}
        </header>

        <div className="flex flex-1 flex-col gap-4">{children}</div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
