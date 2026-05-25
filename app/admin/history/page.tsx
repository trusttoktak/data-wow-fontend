import { redirect } from 'next/navigation';
import { getServerUser } from '../../../lib/serverAuth';
import { serverApi } from '../../../lib/serverApi';
import Sidebar from '../../../components/Sidebar';

interface Reservation {
  id: string;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string;
  user: { id: string; username: string };
  concert: { id: string; name: string };
}

export default async function AdminHistoryPage() {
  const user = await getServerUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/');

  let reservations: Reservation[] = [];

  try {
    reservations = await serverApi.get<Reservation[]>('/reservations/admin/all');
  } catch (e) {
    if (e instanceof Error && (e.message.includes('401') || e.message.includes('Unauthorized'))) {
      redirect('/login');
    }
    throw e;
  }

  return (
    <div className="flex min-h-screen bg-app-bg max-sm:flex-col">
      <Sidebar role="ADMIN" />

      <main className="flex-1 p-8 pl-6 overflow-y-auto sm:max-lg:px-5 sm:max-lg:py-6 max-sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="text-left text-[#111] font-semibold py-[0.85rem] px-4 border-b border-border bg-white">Date time</th>
                <th className="text-left text-[#111] font-semibold py-[0.85rem] px-4 border-b border-border bg-white">Username</th>
                <th className="text-left text-[#111] font-semibold py-[0.85rem] px-4 border-b border-border bg-white">Concert name</th>
                <th className="text-left text-[#111] font-semibold py-[0.85rem] px-4 border-b border-border bg-white">Action</th>
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
                  <td className="py-3 px-4 border-b border-border text-[#111] group-hover:bg-[#f7fbfe]">{r.user?.username ?? '—'}</td>
                  <td className="py-3 px-4 border-b border-border text-[#111] group-hover:bg-[#f7fbfe]">{r.concert?.name ?? '—'}</td>
                  <td className="py-3 px-4 border-b border-border text-[#111] group-hover:bg-[#f7fbfe]">{r.status === 'CANCELLED' ? 'Cancel' : 'Reserve'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
