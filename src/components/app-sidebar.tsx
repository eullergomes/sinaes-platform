'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';

import {
  LayoutDashboard,
  BookOpen,
  Users,
  PanelLeftIcon,
  X,
  ChartNoAxesCombinedIcon,
  ArrowLeftCircle,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import NavUser from './nav-user';
import { User } from 'better-auth';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  currentCourseId?: string | null;
  currentCourseName?: string | null;
  user: User | null;
};

function buildNav(currentCourseId?: string | null) {
  const prefix = currentCourseId ? `/courses/${currentCourseId}` : '';

  return [
    {
      title: 'Dashboard',
      items: [
        {
          title: 'Dashboard',
          url: `${prefix}/dashboard`,
          icon: ChartNoAxesCombinedIcon
        }
      ]
    },
    {
      title: 'Dimensões',
      items: [
        {
          title: 'Dimensão 1',
          url: `${prefix}/dimensions/1`,
          icon: LayoutDashboard
        },
        {
          title: 'Dimensão 2',
          url: `${prefix}/dimensions/2`,
          icon: BookOpen
        },
        { title: 'Dimensão 3', url: `${prefix}/dimensions/3`, icon: Users }
      ]
    },
    {
      title: 'Outros Documentos',
      items: [
        {
          title: 'Outros Documentos',
          url: `${prefix}/other-documents`,
          icon: FileText
        }
      ]
    }
  ] as const;
}

const AppSidebar = ({
  currentCourseId,
  currentCourseName,
  user,
  ...props
}: AppSidebarProps) => {
  const { open, toggleSidebar, isMobile } = useSidebar();
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  const nav = buildNav(currentCourseId);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <button
                onClick={() => {
                  if (!open) toggleSidebar();
                }}
                aria-label={!open ? 'Abrir sidebar' : 'Ícone do header'}
                className="flex h-8 w-8 items-center justify-center rounded p-0 hover:bg-white/10"
              >
                <LayoutDashboard size={20} color="white" />
              </button>
            ) : (
              <button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => {
                  if (!open) toggleSidebar();
                }}
                aria-label={!open ? 'Abrir sidebar' : 'Ícone do header'}
                className="flex h-8 w-8 items-center justify-center rounded p-0 hover:bg-white/10"
              >
                {!open && hovered ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <PanelLeftIcon size={20} color="white" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {!open ? 'Abrir barra lateral' : 'Fechar barra lateral'}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Image
                    src="/assets/imgs/ifma-avalia-logo.png"
                    alt="IFMA Avalia Logo"
                    width={20}
                    height={20}
                    className="brightness-0 invert"
                  />
                )}
              </button>
            )}

            <span className="text-2xl font-bold text-white transition-all duration-200 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:opacity-0">
              IFMA Avalia
            </span>
          </div>

          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleSidebar()}
              aria-label={
                !open ? 'Abrir barra lateral' : 'Fechar barra lateral'
              }
              className="ml-2"
            >
              <X className={!open ? 'rotate-180' : ''} color="white" />
            </Button>
          ) : open ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSidebar()}
                  aria-label={
                    !open ? 'Abrir barra lateral' : 'Fechar barra lateral'
                  }
                  className="ml-2 hover:bg-white/10"
                >
                  <PanelLeftIcon
                    className={`${!open ? 'rotate-180' : ''}`}
                    color="white"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {!open ? 'Abrir barra lateral' : 'Fechar barra lateral'}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>

        <div className="mt-1 transition-all duration-200 ease-linear group-data-[collapsible=icon]:hidden">
          <Link
            href={`/courses/${currentCourseId}/dimensions`}
            className="inline-flex w-full max-w-full items-center gap-2 truncate rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
          >
            <span className="opacity-80">Curso:</span>
            <span className="font-medium">
              {currentCourseName ?? currentCourseId ?? '—'}
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {nav.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-white">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url.split('?')[0]);
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <Icon size={20} color="white" />
                          <span className="text-[18px] font-semibold text-white">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu> 
          <SidebarMenuItem className="space-y-2">
            <SidebarMenuButton
              className="flex w-full items-center gap-4 border border-white/20 bg-white/10"
              asChild
            >
              <Link href="/courses" className="flex items-center gap-4">
                <ArrowLeftCircle color="white" />
                <span className="font-semibold text-white">
                  Voltar aos cursos
                </span>
              </Link>
            </SidebarMenuButton>

            {user && <NavUser user={user} />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
