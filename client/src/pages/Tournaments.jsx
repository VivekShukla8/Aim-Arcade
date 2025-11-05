
// Tournaments.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';
import battleRoyalImg from '../assets/battleRoyalImg.png';
import clashSquadImg from '../assets/clashSquad.png';
import loneWolfImg from '../assets/loneWolf.png';

export default function Tournaments(){
  const [tab,setTab]=useState('upcoming');
  const [items, setItems] = useState([]);
  const [teamCode,setTeamCode]=useState('');
  const [me,setMe]=useState(null);
  const load = async ()=>{
    const list = await apiFetch(`/api/tournaments?status=${tab}`);
    setItems(list);
  };
  useEffect(()=>{ load().catch(()=>{}); },[tab]);
  useEffect(()=>{ apiFetch('/api/users/me').then(setMe).catch(()=>setMe(null)); },[]);
  const deleteTournament = async (id)=>{
    const ok = confirm('Delete this tournament? This cannot be undone.');
    if (!ok) return;
    await apiFetch(`/api/tournaments/${id}`, { method:'DELETE' });
    await load();
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        {/* Tab Bar */}
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={()=>setTab('upcoming')} 
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              tab==='upcoming'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-orange-500/50'
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={()=>setTab('completed')} 
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              tab==='completed'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-orange-500/50'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Quick Join */}
        <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-4">
          <div className="flex gap-2 text-sm">
            <input 
              className="flex-1 bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 placeholder:text-zinc-600 focus:border-orange-500/50 focus:outline-none transition-colors" 
              placeholder="Join by Team Code" 
              value={teamCode} 
              onChange={e=>setTeamCode(e.target.value)} 
            />
            <Link 
              to={teamCode? `/join/${teamCode}`: '#'} 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 font-medium transition-all cursor-pointer"
            >
              Join
            </Link>
          </div>
        </div>

        {/* Tournament Cards */}
        <div className="grid gap-3">
          {items.map(t=> {
            const img = t.mode==='clash_squad' ? clashSquadImg : battleRoyalImg;
            return (
              <div 
                key={t._id} 
                className="group rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-orange-500/50 transition-all p-3"
              >
                <div className="flex gap-3 items-center">
                  {/* Image */}
                  <Link 
                    to={`/t/${t._id}`}
                    className="cursor-pointer"
                  >
                    <div className="w-28 h-16 md:w-40 md:h-24 overflow-hidden rounded border border-zinc-800 group-hover:border-orange-500/50 bg-black/40 flex-shrink-0 transition-all">
                      <img 
                        src={img} 
                        alt="mode" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link 
                        to={`/t/${t._id}`} 
                        className="font-medium text-white group-hover:text-orange-500 truncate hover:underline transition-colors cursor-pointer"
                      >
                        {t.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <div className="text-[11px] px-2 py-0.5 rounded bg-orange-600/20 border border-orange-500/30 text-orange-500 uppercase font-medium">
                          {t.status}
                        </div>
                        {tab==='completed' && me?.role==='owner' && (
                          <button 
                            onClick={()=>deleteTournament(t._id)} 
                            className="text-[11px] px-2 py-1 rounded bg-red-600 hover:bg-red-700 font-medium transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-zinc-800 uppercase font-medium">{t.mode}</span>
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-zinc-800 uppercase font-medium">{t.type}</span>
                      <span className="px-2 py-0.5 rounded bg-green-600/20 border border-green-500/30 text-green-400 font-medium">₹{t.entryFee}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}