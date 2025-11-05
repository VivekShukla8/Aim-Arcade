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
  
  if (!t) return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 text-sm text-zinc-300 max-w-5xl mx-auto">Loading...</div>
    </div>
  );

  const myTeam = myRegs.find(r => r.tournamentId && (r.tournamentId._id===t._id || r.tournamentId===t._id));
  const canSeeRoom = me?.role==='owner' || (myTeam && (myTeam.paymentStatus==='paid'));

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-3 max-w-5xl mx-auto">
        {/* Tournament Info Card */}
        <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Mode</span>
            <span className="text-white font-medium uppercase">{t.mode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Type</span>
            <span className="text-white font-medium uppercase">{t.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Entry Fee</span>
            <span className="text-green-400 font-medium">₹{t.entryFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Max Teams</span>
            <span className="text-white font-medium">{t.maxTeams}</span>
          </div>

          {/* Room Credentials */}
          {canSeeRoom && (t.roomId || t.roomPassword) && (
            <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
              <div className="text-xs text-orange-500 uppercase font-medium">Room Credentials</div>
              {t.roomId && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs w-20">Room ID:</span>
                  <code className="flex-1 bg-black/60 border border-zinc-800 rounded px-2 py-1.5 font-mono text-xs text-white">
                    {t.roomId}
                  </code>
                  <button className="p-1.5 rounded bg-zinc-800 border border-zinc-700 hover:border-green-500/50 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              )}
              {t.roomPassword && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs w-20">Password:</span>
                  <code className="flex-1 bg-black/60 border border-zinc-800 rounded px-2 py-1.5 font-mono text-xs text-white">
                    {t.roomPassword}
                  </code>
                  <button className="p-1.5 rounded bg-zinc-800 border border-zinc-700 hover:border-green-500/50 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Register Button */}
        <Link 
          to={`/register/${t._id}`} 
          className="inline-block text-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg px-5 py-2.5 text-sm font-medium transition-all cursor-pointer"
        >
          Register Team
        </Link>
      </div>
    </div>
  );
}