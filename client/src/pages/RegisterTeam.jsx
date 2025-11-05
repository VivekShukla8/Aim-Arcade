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

  if (!t) return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 text-sm text-zinc-300 max-w-5xl mx-auto">Loading...</div>
    </div>
  );

  if (t.status === 'completed') return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        <div className="text-sm p-3 rounded-lg bg-red-600/10 border border-red-500/30 text-red-400">
          Registration is closed for this tournament.
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        {/* Message */}
        {message && (
          <div className={`text-xs p-3 rounded-lg ${
            message.includes('created') 
              ? 'bg-green-600/20 border border-green-500/30 text-green-400' 
              : 'bg-red-600/20 border border-red-500/30 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={submit} className="space-y-3">
          <input 
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500/50 focus:outline-none rounded-lg px-3 py-2.5 text-sm placeholder:text-zinc-600 transition-colors" 
            placeholder="Team name" 
            value={teamName} 
            onChange={e=>setTeamName(e.target.value)}
            required
          />
          <input 
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500/50 focus:outline-none rounded-lg px-3 py-2.5 text-sm placeholder:text-zinc-600 transition-colors" 
            placeholder="IGL name" 
            value={iglName} 
            onChange={e=>setIglName(e.target.value)}
            required
          />
          
          {/* Players */}
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            {players.map((p,i)=> (
              <div key={i} className="p-3 bg-zinc-900/50 border-b border-zinc-800 last:border-0 space-y-2">
                <div className="text-xs text-orange-500 font-medium uppercase">Player {i+1}</div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="bg-black/60 border border-zinc-800 focus:border-orange-500/50 focus:outline-none rounded px-2.5 py-2 text-xs placeholder:text-zinc-600 transition-colors" 
                    placeholder="Name" 
                    value={p.name} 
                    onChange={e=>onChangePlayer(i,'name',e.target.value)}
                    required
                  />
                  <input 
                    className="bg-black/60 border border-zinc-800 focus:border-orange-500/50 focus:outline-none rounded px-2.5 py-2 text-xs placeholder:text-zinc-600 transition-colors" 
                    placeholder="In-game name" 
                    value={p.inGameName} 
                    onChange={e=>onChangePlayer(i,'inGameName',e.target.value)}
                    required
                  />
                  <input 
                    className="bg-black/60 border border-zinc-800 focus:border-orange-500/50 focus:outline-none rounded px-2.5 py-2 text-xs placeholder:text-zinc-600 transition-colors" 
                    placeholder="Player ID" 
                    value={p.playerId} 
                    onChange={e=>onChangePlayer(i,'playerId',e.target.value)}
                    required
                  />
                  <input 
                    type="email"
                    className="bg-black/60 border border-zinc-800 focus:border-orange-500/50 focus:outline-none rounded px-2.5 py-2 text-xs placeholder:text-zinc-600 transition-colors" 
                    placeholder="Email" 
                    value={p.email} 
                    onChange={e=>onChangePlayer(i,'email',e.target.value)}
                    required
                  />
                  <input 
                    className="bg-black/60 border border-zinc-800 focus:border-orange-500/50 focus:outline-none rounded px-2.5 py-2 text-xs placeholder:text-zinc-600 transition-colors col-span-2" 
                    placeholder="UPI ID" 
                    value={p.upiId} 
                    onChange={e=>onChangePlayer(i,'upiId',e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Option */}
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={payForAll} 
              onChange={e=>setPayForAll(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-zinc-700 bg-zinc-900 checked:bg-orange-600 focus:ring-2 focus:ring-orange-500/50 transition-all cursor-pointer"
            />
            Pay for all players now
          </label>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg py-2.5 text-sm font-medium transition-all cursor-pointer"
          >
            Create Team
          </button>
        </form>
      </div>
    </div>
  );
}