'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuth } from '../lib/auth';
import { api } from '../lib/api';
import { IconHome, IconHistory, IconSwitch, IconLogout } from '../lib/icons';

interface Props {
  role: 'ADMIN' | 'USER';
}

const itemBase =
  'flex items-center gap-[0.6rem] px-3 py-[0.6rem] rounded-lg text-[0.9rem] cursor-pointer bg-transparent no-underline transition-[background-color,color] duration-150 hover:bg-nav-active hover:text-[#111] sm:max-lg:justify-center sm:max-lg:p-[0.7rem] max-sm:px-[0.55rem] max-sm:py-[0.55rem]';

export default function Sidebar({ role }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await api.post('/auth/logout', {}).catch(() => {});
    clearAuth();
    router.push('/login');
  }

  const isAdmin = role === 'ADMIN';

  return (
    <aside className="bg-white flex flex-col sticky top-0 h-screen px-4 py-7 w-47.5 min-w-47.5 sm:max-lg:w-16 sm:max-lg:min-w-16 sm:max-lg:px-2 sm:max-lg:py-5 sm:max-lg:items-center max-sm:w-full max-sm:min-w-0 max-sm:h-auto max-sm:flex-row max-sm:px-4 max-sm:py-[0.6rem] max-sm:z-100 max-sm:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="text-2xl font-extrabold text-[#111] mb-6 pl-2 sm:max-lg:hidden max-sm:mb-0 max-sm:mr-auto max-sm:text-base max-sm:pl-0">
        {isAdmin ? 'Admin' : 'User'}
      </div>

      <nav className="flex flex-col gap-1 flex-1 sm:max-lg:items-center max-sm:flex-row max-sm:flex-none max-sm:gap-[0.15rem]">
        <Link
          href={isAdmin ? '/admin' : '/'}
          className={`${itemBase} ${(isAdmin ? pathname === '/admin' : pathname === '/') ? 'bg-nav-active text-[#111]' : 'text-muted'}`}
        >
          <IconHome size={16} />
          <span className="sm:max-lg:hidden max-sm:hidden">Home</span>
        </Link>

        {isAdmin && (
          <Link
            href="/admin/history"
            className={`${itemBase} ${pathname === '/admin/history' ? 'bg-nav-active text-[#111]' : 'text-muted'}`}
          >
            <IconHistory size={16} />
            <span className="sm:max-lg:hidden max-sm:hidden">History</span>
          </Link>
        )}

        <Link href={isAdmin ? '/' : '/admin'} className={`${itemBase} text-muted`}>
          <IconSwitch size={16} />
          <span className="sm:max-lg:hidden max-sm:hidden">{isAdmin ? 'Switch to user' : 'Switch to Admin'}</span>
        </Link>
      </nav>

      <button
        className="flex items-center gap-[0.6rem] px-3 py-[0.6rem] text-muted text-[0.9rem] cursor-pointer bg-transparent border-none text-left w-full mt-auto rounded-lg transition-colors duration-150 hover:text-coral sm:max-lg:justify-center sm:max-lg:p-[0.7rem] max-sm:mt-0 max-sm:px-[0.55rem] max-sm:py-[0.55rem]"
        onClick={logout}
      >
        <IconLogout size={16} />
        <span className="sm:max-lg:hidden max-sm:hidden">Logout</span>
      </button>
    </aside>
  );
}
