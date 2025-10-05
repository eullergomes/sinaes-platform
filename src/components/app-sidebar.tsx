'use client';

import * as React from 'react';

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
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';

import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  PanelLeftIcon,
  MenuIcon,
  X,
  LayoutDashboardIcon,
  ChartNoAxesCombinedIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { useState } from 'react';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          isActive: false,
          icon: ChartNoAxesCombinedIcon
        },
      ]
    },
    {
      title: 'Dimensões',
      url: '#',
      items: [
        {
          title: 'Dimensão 1',
          url: '/dimension-1',
          isActive: true,
          icon: LayoutDashboard
        },
        {
          title: 'Dimensão 2',
          url: '/dimension-2',
          isActive: false,
          icon: BookOpen
        },
        {
          title: 'Dimensão 3',
          url: '/dimension-3',
          isActive: false,
          icon: Users
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, toggleSidebar, isMobile } = useSidebar();
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

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
                  <LayoutDashboard size={20} color="white" />
                )}
              </button>
            )}

            <span className="text-2xl font-bold text-white transition-all duration-200 ease-linear group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:opacity-0">
              SINAES
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
              <X
                className={!open ? 'rotate-180' : ''}
                color="white"
              />
            </Button>
          ) :
          open ? (
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
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-white">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {item.items.map((navItem) => {
                  const isActive = !!(
                    pathname && pathname.startsWith(navItem.url)
                  );
                  return (
                    <SidebarMenuItem key={navItem.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a
                          href={navItem.url}
                          className="flex items-center gap-2"
                        >
                          <navItem.icon size={20} color="white" />
                          <span className="text-[18px] font-medium text-white">
                            {navItem.title}
                          </span>
                        </a>
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
              className="flex w-full items-center gap-4 bg-gray-600"
              asChild
            >
              <Link href="#" className="flex items-center gap-4">
                <Users color="white" />
                <span className="font-semibold text-white">Perfil</span>
              </Link>
            </SidebarMenuButton>

            <SidebarMenuButton className="flex w-full items-center gap-4 bg-gray-600">
              <LogOut color="white" />
              <span className="font-semibold text-white">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
