'use client';

import { ChevronsUpDown, LogOut, UserCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import type { User } from 'better-auth';
import { Button } from './ui/button';
import { signOut } from '@/lib/auth-client';
import Link from 'next/link';

type NavUserProps = { user: User; hideInfo?: boolean };

const NavUser = ({ user, hideInfo }: NavUserProps) => {
  // const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer ${hideInfo ? 'w-auto' : 'w-full'}`}
        >
          <Avatar className="h-8 w-8 rounded-full border-1 border-gray-500">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? ''}
            />
            <AvatarFallback className="bg-gray-200">
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </AvatarFallback>
          </Avatar>
          {!hideInfo && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className={`truncate font-medium ${hideInfo ? 'text-black' : 'text-white'}`}
                >
                  {user?.name}
                </span>
                <span
                  className={`truncate text-xs ${hideInfo ? 'text-black' : 'text-white'}`}
                >
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown
                className={`ml-auto size-4 ${hideInfo ? 'text-black' : 'text-white'}`}
              />
            </>
          )}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg p-0"
        side={hideInfo ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="bg-green-600 p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-full border-1 border-[#e5e5e5]">
              <AvatarImage
                src={user?.image ?? undefined}
                alt={user?.name ?? ''}
              />
              <AvatarFallback className="bg-gray-400 text-white">
                {user?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-white">
                {user.name}
              </span>
              <span className="truncate text-xs text-white">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link href="/profile" className="flex gap-4">
              <UserCircle />
              Perfil
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-start hover:cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOut />
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUser;
