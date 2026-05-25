'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { toast } from '../Toast';
import { IconUsers, IconAward, IconXCircle, IconTrash, IconSave, IconSeat, IconX } from '../../lib/icons';

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

type Tab = 'overview' | 'create';

interface Props {
  concerts: Concert[];
  reservations: Reservation[];
}

const btnBase = 'inline-flex items-center justify-center gap-[0.4rem] border-0 rounded-lg py-[0.55rem] px-5 text-sm font-semibold cursor-pointer transition-[background-color,opacity] duration-200 disabled:opacity-55 disabled:cursor-not-allowed';

export default function AdminContent({ concerts, reservations }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Concert | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function createConcert(e: { preventDefault(): void }) {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    await api.post('/concerts', { name, description, totalSeats: Number(totalSeats) })
      .then(() => {
        toast('Create successfully');
        setName(''); setDescription(''); setTotalSeats('');
        setTab('overview');
        router.refresh();
      })
      .catch((e: Error) => setFormError(e.message))
      .finally(() => setCreating(false));
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await api.delete(`/concerts/${deleteTarget.id}`)
      .then(() => { toast('Delete successfully'); setDeleteTarget(null); router.refresh(); })
      .catch((e: Error) => { toast(e.message, 'error'); setDeleteTarget(null); })
      .finally(() => setDeleting(false));
  }

  const totalSeatsSum = concerts.reduce((s, c) => s + c.totalSeats, 0);
  const reserveCount = reservations.filter((r) => r.status === 'ACTIVE').length;
  const cancelCount = reservations.filter((r) => r.status === 'CANCELLED').length;

  return (
    <main className="flex-1 p-8 pl-6 overflow-y-auto sm:max-lg:px-5 sm:max-lg:py-6 max-sm:p-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 max-sm:grid-cols-1 sm:max-lg:grid-cols-2">
        <div className="rounded-lg p-5 px-6 text-white flex flex-col items-center gap-[0.4rem] bg-[#1565c0]">
          <div className="opacity-85 mb-[0.1rem]"><IconUsers size={24} /></div>
          <div className="text-[0.85rem] opacity-90">Total of seats</div>
          <div className="text-[2.25rem] font-bold leading-none">{totalSeatsSum.toLocaleString()}</div>
        </div>
        <div className="rounded-lg p-5 px-6 text-white flex flex-col items-center gap-[0.4rem] bg-[#00897b]">
          <div className="opacity-85 mb-[0.1rem]"><IconAward size={24} /></div>
          <div className="text-[0.85rem] opacity-90">Reserve</div>
          <div className="text-[2.25rem] font-bold leading-none">{reserveCount}</div>
        </div>
        <div className="rounded-lg p-5 px-6 text-white flex flex-col items-center gap-[0.4rem] bg-coral">
          <div className="opacity-85 mb-[0.1rem]"><IconXCircle size={24} /></div>
          <div className="text-[0.85rem] opacity-90">Cancel</div>
          <div className="text-[2.25rem] font-bold leading-none">{cancelCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-5">
        <button
          className={`bg-transparent border-0 py-[0.6rem] text-[0.95rem] cursor-pointer border-b-2 -mb-px transition-[color,border-color] duration-150 hover:text-[#111] ${tab === 'overview' ? 'text-primary border-b-primary font-medium' : 'text-muted border-transparent'}`}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>
        <button
          className={`bg-transparent border-0 py-[0.6rem] text-[0.95rem] cursor-pointer border-b-2 -mb-px transition-[color,border-color] duration-150 hover:text-[#111] ${tab === 'create' ? 'text-primary border-b-primary font-medium' : 'text-muted border-transparent'}`}
          onClick={() => setTab('create')}
        >
          Create
        </button>
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-4">
          {concerts.length === 0 && (
            <div className="text-center py-12 px-8 text-muted">
              <h3 className="text-base mb-2 text-[#111]">No concerts yet</h3>
              <p>Switch to Create tab to add one.</p>
            </div>
          )}
          {concerts.map((c) => (
            <div key={c.id} className="bg-white border border-border rounded-lg p-5 px-6">
              <div className="text-[1.05rem] font-bold text-primary mb-3 pb-3 border-b border-border">{c.name}</div>
              <p className="text-sm text-[#111] leading-relaxed mb-4">{c.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-[0.4rem] text-sm text-[#111]">
                  <IconSeat size={16} />
                  {c.totalSeats.toLocaleString()}
                </span>
                <button className={`${btnBase} bg-coral text-white hover:bg-coral-dark`} onClick={() => setDeleteTarget(c)}>
                  <IconTrash size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create */}
      {tab === 'create' && (
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="text-[1.1rem] font-bold text-primary mb-4 pb-3 border-b border-border">Create</div>
          <form onSubmit={createConcert}>
            <div className="grid grid-cols-2 gap-4 mb-4 max-sm:grid-cols-1">
              <div className="flex flex-col gap-[0.35rem]">
                <label className="text-[0.85rem] font-medium text-[#111]">Concert Name</label>
                <input
                  className="border border-border rounded-lg px-3 py-[0.55rem] text-[0.9rem] text-[#111] bg-white w-full transition-[border-color] duration-200 outline-none focus:border-primary placeholder:text-[#aaa]"
                  placeholder="Please input concert name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-[0.35rem]">
                <label className="text-[0.85rem] font-medium text-[#111]">Total of seat</label>
                <div className="relative flex items-center">
                  <input
                    className="border border-border rounded-lg px-3 py-[0.55rem] text-[0.9rem] text-[#111] bg-white w-full transition-[border-color] duration-200 outline-none focus:border-primary placeholder:text-[#aaa] pr-10"
                    type="number"
                    min={1}
                    placeholder="500"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    required
                  />
                  <span className="absolute right-3 text-muted pointer-events-none"><IconSeat size={16} /></span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[0.35rem] mb-4">
              <label className="text-[0.85rem] font-medium text-[#111]">Description</label>
              <textarea
                className="border border-border rounded-lg px-3 py-[0.55rem] text-[0.9rem] text-[#111] bg-white w-full transition-[border-color] duration-200 outline-none focus:border-primary placeholder:text-[#aaa] resize-y"
                rows={4}
                placeholder="Please input description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {formError && <p className="text-coral text-[0.8rem] mt-[0.35rem]">{formError}</p>}
            <div className="flex justify-end mt-4">
              <button className={`${btnBase} bg-primary text-white hover:bg-primary-dark`} type="submit" disabled={creating}>
                <IconSave size={14} />
                {creating ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-1000" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl p-8 px-10 max-w-95 w-[90%] text-center shadow-[0_8px_40px_rgba(0,0,0,0.18)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div className="w-13 h-13 bg-coral rounded-full flex items-center justify-center">
                <IconX size={28} />
              </div>
            </div>
            <div className="text-base font-bold mb-[0.35rem]">Are you sure to delete?</div>
            <div className="text-[0.9rem] text-muted mb-6">&ldquo;{deleteTarget.name}&rdquo;</div>
            <div className="flex gap-3 justify-center">
              <button
                className={`${btnBase} bg-transparent text-[#111] border border-border hover:border-[#aaa]`}
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className={`${btnBase} bg-coral text-white hover:bg-coral-dark`} onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
