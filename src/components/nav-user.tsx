'use client';

import { ChevronsUpDown, Link2, LogOut, ThumbsUp, UserCircle } from 'lucide-react';

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
import AdminIcon from '@/icons/AdminIcon';

type NavUserProps = { user: User; hideInfo?: boolean; isInSidebar?: boolean };

function formatDisplayName(fullName?: string): string {
  const name = (fullName || '').trim();
  if (!name) return '';
  const parts = name.split(/\s+/);
  return parts.slice(0, 3).join(' ');
}

type UserWithRole = User & { role?: string };
const NavUser = ({ user, hideInfo, isInSidebar }: NavUserProps) => {
  const isAdmin = (user as UserWithRole)?.role === 'ADMIN';
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
                  {formatDisplayName(user?.name)}
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
        side={isInSidebar || hideInfo ? 'bottom' : 'right'}
        align="center"
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
                {formatDisplayName(user.name)}
              </span>
              <span className="truncate text-xs text-white">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link
              href="/profile"
              className="hover:bg-accent flex gap-4 px-3 py-2"
            >
              <UserCircle />
              Perfil
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isAdmin && (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="hover:cursor-pointer">
              <Link
                href="/admin/users"
                className="hover:bg-accent flex gap-4 px-3 py-2"
              >
                <AdminIcon fill="#737373" />
                Admin
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link
              href="https://drive.google.com/file/d/1DMEPOsndcWtGgCq5xJL9HJxaQ9eaXol7/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-accent flex gap-4 px-3 py-2"
            >
              <Link2 />
              Guia de Uso
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link
              href="https://forms.gle/xtWj19USpXt9Pqow6"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-accent flex gap-4 px-3 py-2"
            >
              <ThumbsUp />
              Avalie a Plataforma
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="m-0" />
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
