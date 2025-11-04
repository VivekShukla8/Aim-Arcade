import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';
import battleRoyalImg from '../assets/battleRoyalImg.png';
import clashSquadImg from '../assets/clashSquad.png';
import loneWolfImg from '../assets/loneWolf.png';

export default function Owner(){
  const today = new Date();
  const toDate = () => {
    const y = today.getFullYear();
    const m = String(today.getMonth()+1).padStart(2,'0');
    const d = String(today.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  };
  const deleteTournament = async (id)=>{
    const ok = confirm('Delete this tournament? This cannot be undone.');
    if (!ok) return;
    try{
      await apiFetch(`/api/tournaments/${id}`, { method:'DELETE' });
      await load();
    }catch{
      setMsg('Delete failed');
    }
  };
  const toTime = () => {
    const h = String(today.getHours()).padStart(2,'0');
    const min = String(today.getMinutes()).padStart(2,'0');
    return `${h}:${min}`;
  };
  const [form,setForm]=useState({ name:'', mode:'classic', type:'solo', entryFee:50, map:'Erangel', date:toDate(), time:toTime(), maxTeams:16, status:'upcoming' });
  const [selMode,setSelMode]=useState('br'); // br, cs, lw
  const [msg,setMsg]=useState('');
  const [list,setList]=useState([]);
  const [editId,setEditId]=useState('');
  const [edit,setEdit]=useState({ name:'', mode:'classic', type:'solo', entryFee:50, map:'', date:toDate(), time:toTime(), maxTeams:16, status:'upcoming' });
  const computeStatus = (dStr, tStr)=>{
    if (!dStr || !tStr) return 'upcoming';
    try{
      const [y,m,d] = dStr.split('-').map(Number);
      const [hh,mm] = tStr.split(':').map(Number);
      const when = new Date(y, (m||1)-1, d||1, hh||0, mm||0, 0, 0);
      return (new Date() > when) ? 'completed' : 'upcoming';
    }catch{ return 'upcoming'; }
  };
  const load = async ()=>{ 
    const data = await apiFetch('/api/tournaments'); 
    setList(data);
    // background sync: patch status if out-of-date
    const mismatches = data.filter(t => (t.status||'upcoming') !== computeStatus(t.date, t.time));
    if (mismatches.length){
      await Promise.allSettled(mismatches.map(t=> apiFetch(`/api/tournaments/${t._id}`, { method:'PATCH', body:{ status: computeStatus(t.date, t.time) } })));
      const refreshed = await apiFetch('/api/tournaments');
      setList(refreshed);
    }
  };
  useEffect(()=>{ load().catch(()=>{}); },[]);
  const create = async (e)=>{
    e.preventDefault();
    try { 
      const status = computeStatus(form.date, form.time);
      await apiFetch('/api/tournaments', { method:'POST', body: { ...form, status, entryFee:Number(form.entryFee), maxTeams:Number(form.maxTeams) }}); 
      setMsg('Created'); 
      await load(); 
    }
    catch { setMsg('Failed'); }
  };
  const onPickMode = (m)=>{
    setSelMode(m);
    if (m==='br') setForm(f=>({...f, mode:'classic', type:f.type||'solo'}));
    if (m==='cs') setForm(f=>({...f, mode:'clash_squad', type:'squad'}));
    if (m==='lw') setForm(f=>({...f, mode:'classic', type:'solo'}));
  };
  const previewImg = selMode==='br' ? battleRoyalImg : selMode==='cs' ? clashSquadImg : loneWolfImg;
  const startEdit = (t)=>{
    setEditId(t._id);
    setEdit({
      name: t.name||'',
      mode: t.mode||'classic',
      type: t.type||'solo',
      entryFee: t.entryFee??50,
      map: t.map||'',
      date: t.date||toDate(),
      time: t.time||toTime(),
      maxTeams: t.maxTeams??16,
      status: t.status||'upcoming'
    });
  };
  const saveEdit = async (e)=>{
    e.preventDefault();
    try{
      const status = computeStatus(edit.date, edit.time);
      await apiFetch(`/api/tournaments/${editId}`, { method:'PATCH', body:{ ...edit, status, entryFee:Number(edit.entryFee), maxTeams:Number(edit.maxTeams) } });
      setMsg('Updated');
      setEditId('');
      await load();
    }catch{ setMsg('Update failed'); }
  };
  const cancelEdit = ()=>{ setEditId(''); };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {msg && <div className="text-xs text-zinc-300">{msg}</div>}
        <form onSubmit={create} className="space-y-3 text-sm order-3 md:order-1">
          <div className="rounded bg-zinc-900/70 border border-zinc-800 p-3">
            <div className="text-xs text-zinc-400 mb-2">Select a mode</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button type="button" onClick={()=>onPickMode('br')} className={`group rounded overflow-hidden border ${selMode==='br'?'border-indigo-500 ring-2 ring-indigo-500':'border-zinc-800'}`}>
                <div className="aspect-[16/9] bg-black flex items-center justify-center">
                  <img src={battleRoyalImg} alt="Battle Royale" className="w-full h-full object-contain" />
                </div>
                <div className="px-2 py-2 text-left">
                  <div className="text-[11px] tracking-wide text-zinc-300">BATTLE ROYALE</div>
                  <div className="text-[10px] text-zinc-500">Solo / Duo / Squad</div>
                </div>
              </button>
              <button type="button" onClick={()=>onPickMode('cs')} className={`group rounded overflow-hidden border ${selMode==='cs'?'border-indigo-500 ring-2 ring-indigo-500':'border-zinc-800'}`}>
                <div className="aspect-[16/9] bg-black flex items-center justify-center">
                  <img src={clashSquadImg} alt="Clash Squad" className="w-full h-full object-contain" />
                </div>
                <div className="px-2 py-2 text-left">
                  <div className="text-[11px] tracking-wide text-zinc-300">CLASH SQUAD</div>
                  <div className="text-[10px] text-zinc-500">4v4 Round-based</div>
                </div>
              </button>
              <button type="button" onClick={()=>onPickMode('lw')} className={`group rounded overflow-hidden border ${selMode==='lw'?'border-indigo-500 ring-2 ring-indigo-500':'border-zinc-800'}`}>
                <div className="aspect-[16/9] bg-black flex items-center justify-center">
                  <img src={loneWolfImg} alt="Lone Wolf" className="w-full h-full object-contain" />
                </div>
                <div className="px-2 py-2 text-left">
                  <div className="text-[11px] tracking-wide text-zinc-300">LONE WOLF</div>
                  <div className="text-[10px] text-zinc-500">1v1 Duels</div>
                </div>
              </button>
            </div>
          </div>
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Map" value={form.map} onChange={e=>setForm({...form,map:e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
            <input type="time" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}>
              <option value="classic">classic (Battle Royale/Lone Wolf)</option>
              <option value="clash_squad">clash_squad</option>
            </select>
            <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="solo">solo</option>
              <option value="duo">duo</option>
              <option value="squad">squad</option>
            </select>
            <input type="number" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Entry Fee" value={form.entryFee} onChange={e=>setForm({...form,entryFee:e.target.value})} />
            <input type="number" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Max Teams (max 25)" value={form.maxTeams} onChange={e=>setForm({...form,maxTeams:e.target.value})} />
          </div>
          <button className="w-full bg-indigo-600 rounded py-3 text-sm font-medium">Create</button>
        </form>
        {editId && (
          <form onSubmit={saveEdit} className="space-y-3 text-sm order-2 md:order-2 bg-zinc-900/70 border border-zinc-800 rounded p-3">
            <div className="text-sm font-semibold">Edit Tournament</div>
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Name" value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})} />
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Map" value={edit.map} onChange={e=>setEdit({...edit,map:e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={edit.date} onChange={e=>setEdit({...edit,date:e.target.value})} />
              <input type="time" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={edit.time} onChange={e=>setEdit({...edit,time:e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={edit.mode} onChange={e=>setEdit({...edit,mode:e.target.value})}>
                <option value="classic">classic</option>
                <option value="clash_squad">clash_squad</option>
              </select>
              <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={edit.type} onChange={e=>setEdit({...edit,type:e.target.value})}>
                <option value="solo">solo</option>
                <option value="duo">duo</option>
                <option value="squad">squad</option>
              </select>
              <input type="number" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Entry Fee" value={edit.entryFee} onChange={e=>setEdit({...edit,entryFee:e.target.value})} />
              <input type="number" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Max Teams (max 25)" value={edit.maxTeams} onChange={e=>setEdit({...edit,maxTeams:e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-green-600 rounded py-2 text-sm">Save</button>
              <button type="button" onClick={cancelEdit} className="flex-1 bg-zinc-800 border border-zinc-700 rounded py-2 text-sm">Cancel</button>
            </div>
          </form>
        )}
        <div className="space-y-3 order-1 md:order-3">
          <div className="text-sm font-semibold">All Tournaments</div>
          <div className="space-y-2">
            {list.map(t=> (
              <div key={t._id} className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-zinc-400">{t.mode} · {t.type} · ₹{t.entryFee}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${t.status==='completed'?'border-zinc-700 text-zinc-400':'border-zinc-700 text-zinc-500'}`}>{t.status}</span>
                    <Link to={`/owner/t/${t._id}/participants`} className="text-xs text-indigo-400">Participants →</Link>
                    <button onClick={()=>startEdit(t)} className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700">Edit</button>
                    {t.status==='completed' && (
                      <button onClick={()=>deleteTournament(t._id)} className="text-xs px-2 py-1 rounded bg-red-600">Delete</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
