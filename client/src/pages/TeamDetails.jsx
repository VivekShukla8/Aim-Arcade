import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function TeamDetails(){
  const { registrationId } = useParams();
  const nav = useNavigate();
  const [mine,setMine]=useState([]);
  useEffect(()=>{ apiFetch('/api/registrations/mine').then(setMine).catch(()=>{}); },[]);
  const reg = mine.find(r=> r._id===registrationId);
  if (!reg) return <div className="min-h-screen"><TopNav /><div className="p-4 text-sm text-zinc-300 max-w-5xl mx-auto">Not found in your registrations.</div></div>;
  const t = reg.tournamentId || {};
  const canSeeRoom = (reg.paymentStatus==='paid');
  const removePlayer = async (email)=>{
    if (!email) return;
    const ok = confirm(`Remove player ${email}?`);
    if (!ok) return;
    await apiFetch(`/api/registrations/${registrationId}/remove-player`, { method:'PATCH', body:{ email } });
    const updated = await apiFetch('/api/registrations/mine');
    setMine(updated);
  };
  const deleteTeam = async ()=>{
    const ok = confirm('Delete this team? This cannot be undone.');
    if (!ok) return;
    await apiFetch(`/api/registrations/${registrationId}`, { method:'DELETE' });
    nav('/my');
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        <div className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
          <div className="font-medium mb-2">Tournament: {t.name}</div>
          <div className="text-xs text-zinc-400">{t.mode} · {t.type} · ₹{t.entryFee}</div>
        </div>
        <div className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
          <div className="font-medium mb-2">Players</div>
          <ul className="space-y-1 text-sm">
            {reg.players.map((p,i)=> (
              <li key={i} className="flex items-center justify-between gap-3">
                <span>{p.name} <span className="text-zinc-500">({p.inGameName})</span></span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${p.paid?'text-green-400':'text-zinc-500'}`}>{p.paid?'Paid':'Unpaid'}</span>
                  {p.email && <button onClick={()=>removePlayer(p.email)} className="text-[11px] px-2 py-1 rounded bg-zinc-800 border border-zinc-700">Remove</button>}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={deleteTeam} className="mt-3 text-xs px-3 py-2 rounded bg-red-600">Delete Team</button>
        </div>
        {canSeeRoom && (t.roomId || t.roomPassword) && (
          <div className="rounded bg-black/40 border border-zinc-800 p-3">
            <div className="text-xs text-zinc-400">Room Credentials</div>
            {t.roomId && <div>Room ID: <span className="font-mono">{t.roomId}</span></div>}
            {t.roomPassword && <div>Password: <span className="font-mono">{t.roomPassword}</span></div>}
          </div>
        )}
      </div>
    </div>
  );
}
