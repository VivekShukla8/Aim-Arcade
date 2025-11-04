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
        <div className="flex items-center gap-2 text-sm">
          <button onClick={()=>setTab('upcoming')} className={`px-3 py-2 rounded ${tab==='upcoming'?'bg-indigo-600':'bg-zinc-900 border border-zinc-800'}`}>Upcoming</button>
          <button onClick={()=>setTab('completed')} className={`px-3 py-2 rounded ${tab==='completed'?'bg-indigo-600':'bg-zinc-900 border border-zinc-800'}`}>Completed</button>
        </div>
        <div className="flex gap-2 text-sm">
          <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder="Join by Team Code" value={teamCode} onChange={e=>setTeamCode(e.target.value)} />
          <Link to={teamCode? `/join/${teamCode}`: '#'} className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700">Join</Link>
        </div>
        <div className="grid gap-3">
        {items.map(t=> {
          const img = t.mode==='clash_squad' ? clashSquadImg : battleRoyalImg;
          return (
            <div key={t._id} className="block rounded-lg bg-zinc-900/80 border border-zinc-800 p-3">
              <div className="flex gap-3 items-center">
                <div className="w-28 h-16 md:w-40 md:h-24 overflow-hidden rounded border border-zinc-800 bg-black/40 flex-shrink-0">
                  <Link to={`/t/${t._id}`}> 
                    <img src={img} alt="mode" className="w-full h-full object-cover" />
                  </Link>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Link to={`/t/${t._id}`} className="font-medium truncate hover:underline">{t.name}</Link>
                    <div className="flex items-center gap-2">
                      <div className="text-[11px] text-zinc-500 uppercase">{t.status}</div>
                      {tab==='completed' && me?.role==='owner' && (
                        <button onClick={()=>deleteTournament(t._id)} className="text-[11px] px-2 py-1 rounded bg-red-600">Delete</button>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-black/40 border border-zinc-800 uppercase">{t.mode}</span>
                    <span className="px-2 py-0.5 rounded bg-black/40 border border-zinc-800 uppercase">{t.type}</span>
                    <span className="px-2 py-0.5 rounded bg-black/40 border border-zinc-800">₹{t.entryFee}</span>
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
