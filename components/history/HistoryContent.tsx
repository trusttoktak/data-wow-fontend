'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { toast } from '../Toast';

interface Reservation {
  id: string;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string;
  concert: { id: string; name: string };
}

interface Props {
  reservations: Reservation[];
}

export default function HistoryContent({ reservations }: Props) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function cancel(id: string) {
    setCancelling(id);
    await api.delete(`/reservations/${id}`)
      .then(() => { toast('Reservation cancelled.'); router.refresh(); })
      .catch((e: Error) => toast(e.message, 'error'))
      .finally(() => setCancelling(null));
  }

  return (
    <main className="flex-1 p-8 pl-6 overflow-y-auto sm:max-lg:px-5 sm:max-lg:py-6 max-sm:p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="text-left text-[#111] font-semibold py-[0.85rem] px-4 border-b border-border bg-white">Date time</th>
              <th className="text-left text-[#111] font-semibold py-[0.85rem] px-4 border-b border-border bg-white">Concert name</th>
              <th className="text-left text-[#111] font-semibold py-[0.85rem] px-4 border-b border-border bg-white">Action</th>
              <th className="text-left text-[#111] font-semibold py-[0.85rem] px-4 border-b border-border bg-white"></th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted py-8">No reservations yet.</td>
              </tr>
            )}
            {reservations.map((r) => (
              <tr key={r.id} className="group [&:last-child>td]:border-b-0">
                <td className="py-3 px-4 border-b border-border text-[#111] group-hover:bg-[#f7fbfe]">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4 border-b border-border text-[#111] group-hover:bg-[#f7fbfe]">{r.concert?.name ?? '—'}</td>
                <td className="py-3 px-4 border-b border-border text-[#111] group-hover:bg-[#f7fbfe]">{r.status === 'CANCELLED' ? 'Cancel' : 'Reserve'}</td>
                <td className="py-3 px-4 border-b border-border text-[#111] group-hover:bg-[#f7fbfe]">
                  {r.status === 'ACTIVE' && (
                    <button
                      className="inline-flex items-center justify-center gap-[0.4rem] border-0 rounded-lg py-[0.35rem] px-[0.85rem] text-[0.8rem] font-semibold cursor-pointer transition-[background-color,opacity] duration-200 disabled:opacity-55 disabled:cursor-not-allowed bg-coral text-white hover:bg-coral-dark"
                      disabled={cancelling === r.id}
                      onClick={() => cancel(r.id)}
                    >
                      {cancelling === r.id ? '…' : 'Cancel'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
