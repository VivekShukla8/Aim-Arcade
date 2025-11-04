import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function RegisterTeam(){
  const { tournamentId } = useParams();
  const [t, setT] = useState(null);
  const [teamName,setTeamName]=useState('');
  const [iglName,setIglName]=useState('');
  const [payForAll,setPayForAll]=useState(false);
  const [players,setPlayers]=useState([]);
  const [message,setMessage]=useState('');

  useEffect(()=>{
    apiFetch(`/api/tournaments/${tournamentId}`).then((tt)=>{
      setT(tt);
      const size = tt.type==='solo'?1: tt.type==='duo'?2:4;
      setPlayers(Array.from({length:size},()=>({name:'',inGameName:'',playerId:'',email:'',upiId:''})));
    });
  },[tournamentId]);

  const onChangePlayer = (i, key, val)=>{
    setPlayers(prev=> prev.map((p,idx)=> idx===i? {...p,[key]:val}: p));
  };

  const submit = async (e)=>{
    e.preventDefault();
    try {
      const reg = await apiFetch('/api/registrations', { method:'POST', body:{ tournamentId, teamName, iglName, players, payForAll }});
      if (payForAll) {
        window.location.href = `/pay/team/${reg._id}`;
      } else {
        setMessage(`Team created. Share invite: ${reg.inviteLink}`);
      }
    } catch (err) { setMessage('Failed to register'); }
  };

  if (!t) return <div className="min-h-screen"><TopNav /><div className="p-4 text-sm text-zinc-300 max-w-5xl mx-auto">Loading...</div></div>;
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        {message && <div className="text-xs text-zinc-300">{message}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Team name" value={teamName} onChange={e=>setTeamName(e.target.value)} />
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="IGL name" value={iglName} onChange={e=>setIglName(e.target.value)} />
          <div className="rounded border border-zinc-800">
            {players.map((p,i)=> (
              <div key={i} className="p-3 grid grid-cols-2 gap-2 border-b border-zinc-800 last:border-0">
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs" placeholder="Name" value={p.name} onChange={e=>onChangePlayer(i,'name',e.target.value)} />
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs" placeholder="In-game name" value={p.inGameName} onChange={e=>onChangePlayer(i,'inGameName',e.target.value)} />
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs" placeholder="Player ID" value={p.playerId} onChange={e=>onChangePlayer(i,'playerId',e.target.value)} />
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs" placeholder="Email" value={p.email} onChange={e=>onChangePlayer(i,'email',e.target.value)} />
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs col-span-2" placeholder="UPI ID" value={p.upiId} onChange={e=>onChangePlayer(i,'upiId',e.target.value)} />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={payForAll} onChange={e=>setPayForAll(e.target.checked)} /> Pay for all players now
          </label>
          <button className="w-full bg-indigo-600 rounded py-3 text-sm font-medium">Create Team</button>
        </form>
      </div>
    </div>
  );
}
