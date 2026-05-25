'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuth, getUser } from '../lib/auth';

export default function Navbar() {
  const router = useRouter();
  usePathname(); // subscribe to route changes so Navbar re-renders on navigation
  const user = typeof window !== 'undefined' ? getUser() : null;

  function logout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/">Concert Tickets</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-username">{user.username}</span>
            <span className={`navbar-role role-${user.role.toLowerCase()}`}>{user.role}</span>
            {user.role === 'ADMIN' ? (
              <Link href="/admin">Admin</Link>
            ) : (
              <Link href="/history">My History</Link>
            )}
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <Link href="/login" className="btn-login">Login</Link>
        )}
      </div>
    </nav>
  );
}
