import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function MyRegs(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ apiFetch('/api/registrations/mine').then(setItems).catch(()=>{}); },[]);
  const del = async (id)=>{
    const ok = confirm('Delete this team?');
    if (!ok) return;
    await apiFetch(`/api/registrations/${id}`, { method:'DELETE' });
    const updated = await apiFetch('/api/registrations/mine');
    setItems(updated);
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-3 max-w-5xl mx-auto">
        {items.map(r=> (
          <div key={r._id} className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.teamName}</div>
                <div className="text-xs text-zinc-400">Players: {r.players.length} · Status: {r.paymentStatus || 'pending'}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/team/${r._id}`} className="text-xs text-indigo-400">Details →</Link>
                <button onClick={()=>del(r._id)} className="text-xs px-2 py-1 rounded bg-red-600">Delete</button>
              </div>
            </div>
            {r.inviteLink && <div className="text-[10px] text-zinc-500 break-all mt-1">Invite: {r.inviteLink}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
