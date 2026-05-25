'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { toast } from '../Toast';
import { IconSeat } from '../../lib/icons';

interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  reservedSeats: number;
}

interface MyReservation {
  id: string;
  concertId: string;
  status: 'ACTIVE' | 'CANCELLED';
}

interface Props {
  concerts: Concert[];
  reservations: MyReservation[];
}

export default function HomeContent({ concerts, reservations }: Props) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reserve(concertId: string) {
    setBusyId(concertId);
    await api.post(`/reservations/${concertId}`, {})
      .then(() => { toast('Seat reserved successfully!'); router.refresh(); })
      .catch((e: Error) => toast(e.message, 'error'))
      .finally(() => setBusyId(null));
  }

  async function cancel(reservationId: string, concertId: string) {
    setBusyId(concertId);
    await api.delete(`/reservations/${reservationId}`)
      .then(() => { toast('Reservation cancelled.'); router.refresh(); })
      .catch((e: Error) => toast(e.message, 'error'))
      .finally(() => setBusyId(null));
  }

  function getMyActiveReservation(concertId: string) {
    return reservations.find((r) => r.concertId === concertId && r.status === 'ACTIVE');
  }

  if (concerts.length === 0) {
    return (
      <main className="flex-1 p-8 pl-6 overflow-y-auto sm:max-lg:px-5 sm:max-lg:py-6 max-sm:p-4">
        <div className="text-center py-12 px-8 text-muted">
          <h3 className="text-base mb-2 text-[#111]">No concerts yet</h3>
          <p>Check back later for upcoming events.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 pl-6 overflow-y-auto sm:max-lg:px-5 sm:max-lg:py-6 max-sm:p-4">
      <div className="flex flex-col gap-4">
        {concerts.map((c) => {
          const myRes = getMyActiveReservation(c.id);
          const busy = busyId === c.id;
          const isFull = c.reservedSeats >= c.totalSeats;

          return (
            <div key={c.id} className="bg-white border border-border rounded-lg p-5 px-6">
              <div className="text-[1.05rem] font-bold text-primary mb-3 pb-3 border-b border-border">{c.name}</div>
              <p className="text-sm text-[#111] leading-relaxed mb-4">{c.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-[0.4rem] text-sm text-[#111]">
                  <IconSeat size={16} />
                  {c.totalSeats.toLocaleString()}
                </span>
                {myRes ? (
                  <button
                    className="inline-flex items-center justify-center gap-[0.4rem] border-0 rounded-lg py-[0.55rem] px-5 text-sm font-semibold cursor-pointer transition-[background-color,opacity] duration-200 disabled:opacity-55 disabled:cursor-not-allowed bg-coral text-white hover:bg-coral-dark"
                    disabled={busy}
                    onClick={() => cancel(myRes.id, c.id)}
                  >
                    {busy ? 'Cancelling…' : 'Cancel'}
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center justify-center gap-[0.4rem] border-0 rounded-lg py-[0.55rem] px-5 text-sm font-semibold cursor-pointer transition-[background-color,opacity] duration-200 disabled:opacity-55 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-dark"
                    disabled={isFull || busy}
                    onClick={() => reserve(c.id)}
                  >
                    {busy ? 'Reserving…' : isFull ? 'Full' : 'Reserve'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
