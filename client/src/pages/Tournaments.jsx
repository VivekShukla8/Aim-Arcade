import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function Tournaments(){
  const [tab,setTab]=useState('upcoming');
  const [items, setItems] = useState([]);
  const [teamCode,setTeamCode]=useState('');
  useEffect(()=>{ apiFetch(`/api/tournaments?status=${tab}`).then(setItems).catch(()=>{}); },[tab]);
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
        {items.map(t=> (
          <Link to={`/t/${t._id}`} key={t._id} className="block rounded-lg bg-zinc-900/80 border border-zinc-800 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-zinc-400">{t.mode.toUpperCase()} · {t.type.toUpperCase()} · Fee ₹{t.entryFee}</div>
              </div>
              <div className="text-xs text-zinc-500">{t.status}</div>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}
