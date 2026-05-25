import { redirect } from 'next/navigation';
import { getServerUser } from '../../lib/serverAuth';
import { serverApi } from '../../lib/serverApi';
import Sidebar from '../../components/Sidebar';
import AdminContent from '../../components/admin/AdminContent';

interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  reservedSeats: number;
}

interface Reservation {
  id: string;
  status: 'ACTIVE' | 'CANCELLED';
}

export default async function AdminPage() {
  const user = await getServerUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/');

  let concerts: Concert[] = [];
  let reservations: Reservation[] = [];

  try {
    [concerts, reservations] = await Promise.all([
      serverApi.get<Concert[]>('/concerts'),
      serverApi.get<Reservation[]>('/reservations/admin/all'),
    ]);
  } catch (e) {
    if (e instanceof Error && (e.message.includes('401') || e.message.includes('Unauthorized'))) {
      redirect('/login');
    }
    throw e;
  }

  return (
    <div className="flex min-h-screen bg-app-bg max-sm:flex-col">
      <Sidebar role="ADMIN" />
      <AdminContent concerts={concerts} reservations={reservations} />
    </div>
  );
}
