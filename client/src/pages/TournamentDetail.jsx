import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function TournamentDetail(){
  const { id } = useParams();
  const [t, setT] = useState(null);
  const [me,setMe]=useState(null);
  const [myRegs,setMyRegs]=useState([]);
  useEffect(()=>{
    apiFetch(`/api/tournaments/${id}`).then(setT).catch(()=>{});
    apiFetch('/api/users/me').then(setMe).catch(()=>setMe(null));
    apiFetch('/api/registrations/mine').then(setMyRegs).catch(()=>setMyRegs([]));
  },[id]);
  if (!t) return <div className="min-h-screen"><TopNav /><div className="p-4 text-sm text-zinc-300 max-w-5xl mx-auto">Loading...</div></div>;
  const myTeam = myRegs.find(r => r.tournamentId && (r.tournamentId._id===t._id || r.tournamentId===t._id));
  const canSeeRoom = me?.role==='owner' || (myTeam && (myTeam.paymentStatus==='paid'));
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-3 max-w-5xl mx-auto">
        <div className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
          <div>Mode: {t.mode}</div>
          <div>Type: {t.type}</div>
          <div>Entry Fee: ₹{t.entryFee}</div>
          <div>Max Teams: {t.maxTeams}</div>
          {canSeeRoom && (t.roomId || t.roomPassword) && (
            <div className="mt-2 p-2 rounded bg-black/40 border border-zinc-800">
              <div className="text-xs text-zinc-400">Room Credentials</div>
              {t.roomId && <div>Room ID: <span className="font-mono">{t.roomId}</span></div>}
              {t.roomPassword && <div>Password: <span className="font-mono">{t.roomPassword}</span></div>}
            </div>
          )}
        </div>
        <Link to={`/register/${t._id}`} className="inline-block text-center bg-indigo-600 rounded px-4 py-2 text-sm font-medium">Register Team</Link>
      </div>
    </div>
  );
}
