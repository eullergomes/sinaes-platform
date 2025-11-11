'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import PendingAlerts from '@/components/PendingAlerts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useSession } from '@/lib/auth-client';

import NavUser from '@/components/nav-user';
import Footer from '@/components/footer';
import { UserRole } from '@prisma/client';

function extractCourseId(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const i = parts.indexOf('courses');
  if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
  return null;
}

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [courseName, setCourseName] = useState<string | null>(null);
  const isAuthPage =
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/profile' ||
    pathname === '/admin/users';
  const hideSidebar =
    pathname === '/courses' ||
    pathname === '/courses/new' ||
    /\/courses\/.+\/edit$/.test(pathname) ||
    isAuthPage;
  const currentCourseId = extractCourseId(pathname);

  const { data, isPending } = useSession();
  const user = data?.user ?? null;
  const hasRole = (u: unknown): u is { role?: UserRole } => {
    return (
      !!u && typeof u === 'object' && 'role' in (u as Record<string, unknown>)
    );
  };
  const isAdmin = hasRole(user) && user.role === UserRole.ADMIN;

  useEffect(() => {
    let cancelled = false;
    async function loadCourseName(slug: string) {
      try {
        const res = await fetch(`/api/courses/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error('Falha ao carregar curso');
        const data: { name: string } = await res.json();
        if (!cancelled) setCourseName(data.name);
      } catch {
        if (!cancelled) setCourseName(null);
      }
    }
    if (currentCourseId) {
      setCourseName(null);
      loadCourseName(currentCourseId);
    } else {
      setCourseName(null);
    }
    return () => {
      cancelled = true;
    };
  }, [currentCourseId]);

  const UserSkeleton = (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
    </div>
  );

  return (
    <SidebarProvider>
      {!hideSidebar && (
        <AppSidebar
          collapsible="icon"
          currentCourseId={currentCourseId}
          currentCourseName={courseName}
          user={user}
        />
      )}

      <SidebarInset>
        {!isAuthPage && (
          <header
            className={
              hideSidebar
                ? 'flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-green-600 px-4 text-white md:px-8'
                : 'flex h-16 shrink-0 items-center justify-end gap-2 border-b bg-gray-200 px-4 md:px-8'
            }
          >
            {hideSidebar ? (
              <>
                <Link href="/courses" className="flex items-center gap-3">
                  <Image
                    src="/assets/imgs/ifma-avalia-logo.png"
                    alt="IFMA Avalia Logo"
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                  />
                  <span className="text-lg font-semibold">IFMA Avalia</span>
                </Link>

                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <Button asChild variant="outline">
                      <Link href="/admin/users" className="text-black">
                        Admin
                      </Link>
                    </Button>
                  )}
                  {isPending ? (
                    UserSkeleton
                  ) : user ? (
                    <NavUser user={user} hideInfo={true} />
                  ) : (
                    <Button asChild variant="outline">
                      <Link href="/sign-in" className="text-black">
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              </>
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
                      {courseName ?? '—'}
                    </span>
                  </div>
                )}
                <div className="ml-auto flex items-center gap-4">
                  {currentCourseId && <PendingAlerts />}
                  {isAdmin && (
                    <Button asChild variant="outline">
                      <Link href="/admin/users" className="text-black">
                        Admin
                      </Link>
                    </Button>
                  )}
                  {isPending ? (
                    UserSkeleton
                  ) : user ? (
                    <NavUser user={user} hideInfo={true} />
                  ) : (
                    <Button asChild variant="outline">
                      <Link href="/sign-in" className="text-black">
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            )}
          </header>
        )}

        <div className="flex min-h-[calc(100svh-4rem)] flex-1 flex-col gap-4">
          {children}
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell;
