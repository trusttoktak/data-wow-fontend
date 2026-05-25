import { redirect } from 'next/navigation';
import { getServerUser } from '../../lib/serverAuth';
import { serverApi } from '../../lib/serverApi';
import Sidebar from '../../components/Sidebar';
import HistoryContent from '../../components/history/HistoryContent';

interface Reservation {
  id: string;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string;
  concert: { id: string; name: string };
}

export default async function HistoryPage() {
  const user = await getServerUser();
  if (!user) redirect('/login');
  if (user.role !== 'USER') redirect('/admin');

  let reservations: Reservation[] = [];

  try {
    reservations = await serverApi.get<Reservation[]>('/reservations/my/history');
  } catch (e) {
    if (e instanceof Error && (e.message.includes('401') || e.message.includes('Unauthorized'))) {
      redirect('/login');
    }
    throw e;
  }

  return (
    <div className="flex min-h-screen bg-app-bg max-sm:flex-col">
      <Sidebar role="USER" />
      <HistoryContent reservations={reservations} />
    </div>
  );
}
