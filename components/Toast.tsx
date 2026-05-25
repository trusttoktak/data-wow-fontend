'use client';

import { useEffect, useState } from 'react';

interface ToastItem { id: number; message: string; type: 'success' | 'error'; }

let listeners: Array<(t: ToastItem) => void> = [];

export function toast(message: string, type: 'success' | 'error' = 'success') {
  listeners.forEach((fn) => fn({ id: Date.now(), message, type }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3500);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter((fn) => fn !== handler); };
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="fixed top-6 right-6 flex flex-col gap-2 z-9999">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-[0.6rem] py-[0.7rem] px-4 rounded-lg text-sm font-medium animate-[slide-in_0.2s_ease] min-w-50 max-w-xs shadow-[0_4px_16px_rgba(0,0,0,0.12)] cursor-pointer bg-white border border-border text-[#111]"
          onClick={() => dismiss(t.id)}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${t.type === 'success' ? 'bg-[#4caf50]' : 'bg-coral'}`} />
          <span>{t.message}</span>
          <span className="ml-auto text-muted text-base leading-none">×</span>
        </div>
      ))}
    </div>
  );
}
