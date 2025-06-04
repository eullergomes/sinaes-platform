'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  LayoutDashboard,
  BookOpen,
  Users,
  Home,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const linkClass = (href: string) =>
    `flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 ${
      (pathname?.startsWith(href) ? 'bg-gray-200 font-semibold' : '')
    }`;

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col justify-between border-r border-gray-200 bg-[#2b5f30] p-4 transition-all duration-300`}
    >
      <div className="space-y-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xl font-bold">
            <Home size={24} color='white'/>
            {!isCollapsed && <span className='text-white'>SINAES IFMA</span>}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded p-1 hover:bg-red-700"
          >
            <Menu size={20} color='white' />
          </button>
        </div>

        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard" className={linkClass('/dashboard')}>
            <LayoutDashboard size={20} color='white' />
            {!isCollapsed && <span className='text-white'>Dashboard</span>}
          </Link>

          <Link href="/dimension-1" className={linkClass('/dimension-1')}>
            <BookOpen size={20} color='white'/>
            {!isCollapsed && <span className='text-white'>Dimensão 1</span>}
          </Link>

          <Link href="/dimension-2" className={linkClass('/dimension-2')}>
            <Users size={20} color='white'/>
            {!isCollapsed && <span className='text-white'>Dimensão 2</span>}
          </Link>

          <Link href="/dimension-3" className={linkClass('/dimension-3')}>
            <Users size={20} color='white'/>
            {!isCollapsed && <span className='text-white'>Dimensão 3</span>}
          </Link>
        </nav>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600">
          <Image
            src="/profile.jpg"
            alt="Profile"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
          {!isCollapsed && <span className='text-white'>Usuário IFMA</span>}
        </div>

        <button
          className="flex items-center space-x-2 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => alert('Logout!')}
        >
          <LogOut size={20} color='white'/>
          {!isCollapsed && <span className='text-white'>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
