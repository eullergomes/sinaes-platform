'use client';
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
import { AppContext } from '@/context/AppContext';
import { canViewPendingAlerts } from '@/lib/permissions';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCourseInfo } from '@/hooks/useCourseInfo';
import { extractCourseId } from '@/utils/extractCourseId';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isAuthPage =
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/profile' ||
    pathname === '/admin/users' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';
  const hideSidebar =
    pathname === '/courses' ||
    pathname === '/courses/new' ||
    /\/courses\/.+\/edit$/.test(pathname) ||
    isAuthPage;
  const hideFooter = pathname === '/profile' || pathname === '/admin/users';
  const currentCourseId = extractCourseId(pathname);

  const { data, isPending } = useSession();

  const user = data?.user ?? null;
  const hasRole = (u: unknown): u is { role?: UserRole } => {
    return (
      !!u && typeof u === 'object' && 'role' in (u as Record<string, unknown>)
    );
  };
  const isAdmin = hasRole(user) && user.role === UserRole.ADMIN;
  const userId =
    user &&
    typeof user === 'object' &&
    'id' in (user as Record<string, unknown>)
      ? (user as { id?: string }).id
      : undefined;
  const role = hasRole(user) ? user.role : undefined;

  const { info, loading } = useCourseInfo(currentCourseId);
  const courseName = info.name;
  const courseCoordinatorId = info.coordinatorId;
  const courseInfoLoading = loading;

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

      <SidebarInset className="w-[calc(100%-var(--sidebar-width))]">
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
                      <Link href="/admin/users" className="hidden text-black">
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
                  {currentCourseId &&
                    canViewPendingAlerts({
                      role,
                      userId: userId ?? null,
                      courseCoordinatorId
                    }) && <PendingAlerts />}
                  {isAdmin && !isMobile && (
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

        <AppContext.Provider
          value={{
            userId,
            role,
            isAdmin,
            currentCourseId,
            courseCoordinatorId,
            courseInfoLoading,
            sessionPending: isPending
          }}
        >
          <div
            className={`flex flex-1 flex-col gap-4 ${hideFooter ? 'min-h-dvh' : 'min-h-[calc(100dvh-4rem)]'}`}
          >
            {children}
          </div>
        </AppContext.Provider>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppShell;
