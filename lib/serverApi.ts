import { getServerToken } from './serverAuth';

const INTERNAL_API =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000';

async function serverRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getServerToken();

  const res = await fetch(`${INTERNAL_API}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as { message?: string | string[] })?.message || 'Something went wrong';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return data as T;
}

export const serverApi = {
  get: <T>(path: string) => serverRequest<T>(path, { method: 'GET' }),
};
