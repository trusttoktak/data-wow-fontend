import Cookies from 'js-cookie';

export type Role = 'ADMIN' | 'USER';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = Cookies.get('user_info');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveAuth(user: AuthUser) {
  Cookies.set('user_info', JSON.stringify(user), { path: '/', expires: 7, sameSite: 'Lax' });
}

export function clearAuth() {
  Cookies.remove('user_info', { path: '/' });
}
