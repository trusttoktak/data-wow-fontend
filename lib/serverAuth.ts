import { cookies } from 'next/headers';
import type { AuthUser } from './auth';

export async function getServerUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const raw = store.get('user_info')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function getServerToken(): Promise<string | null> {
  const store = await cookies();
  return store.get('access_token')?.value ?? null;
}
