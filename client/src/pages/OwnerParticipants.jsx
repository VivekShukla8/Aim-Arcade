import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function OwnerParticipants(){
  const { tournamentId } = useParams();
  const [teams,setTeams]=useState([]);
  useEffect(()=>{ apiFetch(`/api/registrations/tournament/${tournamentId}`).then(setTeams).catch(()=>{}); },[tournamentId]);
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-3 max-w-5xl mx-auto">
        {teams.length===0 && (
          <div className="text-center text-sm text-zinc-400 py-16">No teams registered yet</div>
        )}
        {teams.map(team => (
          <div key={team._id} className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">{team.teamName}</div>
              <div className="flex items-center gap-2">
                <div className={`text-xs ${team.paymentStatus==='paid'?'text-green-400':'text-zinc-500'}`}>{team.paymentStatus || 'pending'}</div>
                <button onClick={async()=>{ const ok = confirm('Delete this team?'); if(!ok) return; await apiFetch(`/api/registrations/${team._id}`, { method:'DELETE' }); const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`); setTeams(refreshed); }} className="text-[11px] px-2 py-1 rounded bg-red-600">Delete</button>
              </div>
            </div>
            <ul className="mt-2 grid md:grid-cols-2 gap-1 text-xs text-zinc-300">
              {team.players.map((p,i)=> (
                <li key={i} className="flex items-center justify-between">
                  <span>{p.name} ({p.inGameName})</span>
                  <span className={`${p.paid?'text-green-400':'text-zinc-500'}`}>{p.paid?'Paid':'Unpaid'}</span>
                </li>
              ))}
            </ul>
            {team.manualPayment?.submitted && (
              <div className="mt-3 p-2 rounded bg-black/40 border border-zinc-800 text-xs">
                <div className="text-zinc-400">Manual proof: <span className={`ml-1 ${team.manualPayment?.status==='approved'?'text-green-400': team.manualPayment?.status==='rejected'?'text-red-400':'text-yellow-400'}`}>{team.manualPayment?.status}</span></div>
                {team.manualPayment?.amount!=null && <div>Amount: ₹{team.manualPayment.amount}</div>}
                {team.manualPayment?.note && <div className="break-all">Note: {team.manualPayment.note}</div>}
                {team.manualPayment?.proof && <img src={team.manualPayment.proof} alt="Proof" className="mt-2 max-h-48 rounded border border-zinc-700" />}
                {team.manualPayment?.status==='pending' && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={async()=>{ await apiFetch(`/api/payments/manual/${team._id}/approve`, { method:'POST' }); const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`); setTeams(refreshed); }} className="px-3 py-1 rounded bg-green-600">Approve</button>
                    <button onClick={async()=>{ const reason = prompt('Reason (optional)'); await apiFetch(`/api/payments/manual/${team._id}/reject`, { method:'POST', body:{ reason } }); const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`); setTeams(refreshed); }} className="px-3 py-1 rounded bg-red-600">Reject</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
