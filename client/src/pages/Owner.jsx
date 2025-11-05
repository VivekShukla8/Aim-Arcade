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
  const [selMode,setSelMode]=useState('br');
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
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {msg && (
          <div className="mb-4 px-4 py-2 bg-emerald-900/30 border border-emerald-700/50 rounded-lg text-sm text-emerald-300 max-w-md">
            {msg}
          </div>
        )}
        
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Create Tournament */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Create Tournament</h2>
              <form onSubmit={create} className="space-y-4 text-sm">
                <div className="rounded-lg bg-zinc-900/70 border border-zinc-800 p-4">
                  <div className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wide">Select Mode</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button" 
                      onClick={()=>onPickMode('br')} 
                      className={`rounded-lg overflow-hidden border-2 transition-all ${selMode==='br'?'border-indigo-500 shadow-lg shadow-indigo-500/20':'border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="aspect-[4/3] bg-black flex items-center justify-center">
                        <img src={battleRoyalImg} alt="Battle Royale" className="w-full h-full object-contain" />
                      </div>
                      <div className="px-2 py-1.5 bg-zinc-900/50">
                        <div className="text-[10px] font-medium tracking-wide text-zinc-300">BR</div>
                      </div>
                    </button>
                    <button 
                      type="button" 
                      onClick={()=>onPickMode('cs')} 
                      className={`rounded-lg overflow-hidden border-2 transition-all ${selMode==='cs'?'border-indigo-500 shadow-lg shadow-indigo-500/20':'border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="aspect-[4/3] bg-black flex items-center justify-center">
                        <img src={clashSquadImg} alt="Clash Squad" className="w-full h-full object-contain" />
                      </div>
                      <div className="px-2 py-1.5 bg-zinc-900/50">
                        <div className="text-[10px] font-medium tracking-wide text-zinc-300">CS</div>
                      </div>
                    </button>
                    <button 
                      type="button" 
                      onClick={()=>onPickMode('lw')} 
                      className={`rounded-lg overflow-hidden border-2 transition-all ${selMode==='lw'?'border-indigo-500 shadow-lg shadow-indigo-500/20':'border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="aspect-[4/3] bg-black flex items-center justify-center">
                        <img src={loneWolfImg} alt="Lone Wolf" className="w-full h-full object-contain" />
                      </div>
                      <div className="px-2 py-1.5 bg-zinc-900/50">
                        <div className="text-[10px] font-medium tracking-wide text-zinc-300">LW</div>
                      </div>
                    </button>
                  </div>
                </div>

                <input 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
                  placeholder="Tournament Name" 
                  value={form.name} 
                  onChange={e=>setForm({...form,name:e.target.value})} 
                />
                
                <input 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
                  placeholder="Map Name" 
                  value={form.map} 
                  onChange={e=>setForm({...form,map:e.target.value})} 
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
                      value={form.date} 
                      onChange={e=>setForm({...form,date:e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Time</label>
                    <input 
                      type="time" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
                      value={form.time} 
                      onChange={e=>setForm({...form,time:e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Mode</label>
                    <select 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
                      value={form.mode} 
                      onChange={e=>setForm({...form,mode:e.target.value})}
                    >
                      <option value="classic">Classic</option>
                      <option value="clash_squad">Clash Squad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Type</label>
                    <select 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
                      value={form.type} 
                      onChange={e=>setForm({...form,type:e.target.value})}
                    >
                      <option value="solo">Solo</option>
                      <option value="duo">Duo</option>
                      <option value="squad">Squad</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Entry Fee (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
                      placeholder="50" 
                      value={form.entryFee} 
                      onChange={e=>setForm({...form,entryFee:e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1.5">Max Teams</label>
                    <input 
                      type="number" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none transition-colors" 
                      placeholder="16" 
                      value={form.maxTeams} 
                      onChange={e=>setForm({...form,maxTeams:e.target.value})} 
                    />
                  </div>
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg py-2.5 text-sm font-medium">
                  Create Tournament
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Tournament List & Edit */}
          <div className="lg:col-span-7 space-y-6">
            {editId && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Edit Tournament</h2>
                <form onSubmit={saveEdit} className="space-y-4 text-sm bg-zinc-900/70 border border-zinc-800 rounded-lg p-4">
                  <input 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                    placeholder="Tournament Name" 
                    value={edit.name} 
                    onChange={e=>setEdit({...edit,name:e.target.value})} 
                  />
                  
                  <input 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                    placeholder="Map Name" 
                    value={edit.map} 
                    onChange={e=>setEdit({...edit,map:e.target.value})} 
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                        value={edit.date} 
                        onChange={e=>setEdit({...edit,date:e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Time</label>
                      <input 
                        type="time" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                        value={edit.time} 
                        onChange={e=>setEdit({...edit,time:e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Mode</label>
                      <select 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                        value={edit.mode} 
                        onChange={e=>setEdit({...edit,mode:e.target.value})}
                      >
                        <option value="classic">Classic</option>
                        <option value="clash_squad">Clash Squad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Type</label>
                      <select 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                        value={edit.type} 
                        onChange={e=>setEdit({...edit,type:e.target.value})}
                      >
                        <option value="solo">Solo</option>
                        <option value="duo">Duo</option>
                        <option value="squad">Squad</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Entry Fee (₹)</label>
                      <input 
                        type="number" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                        value={edit.entryFee} 
                        onChange={e=>setEdit({...edit,entryFee:e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1.5">Max Teams</label>
                      <input 
                        type="number" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none transition-colors" 
                        value={edit.maxTeams} 
                        onChange={e=>setEdit({...edit,maxTeams:e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-lg py-2.5 text-sm font-medium">
                      Save Changes
                    </button>
                    <button type="button" onClick={cancelEdit} className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors rounded-lg py-2.5 text-sm font-medium">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">All Tournaments</h2>
              <div className="space-y-3">
                {list.map(t=> (
                  <div key={t._id} className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-4 hover:border-zinc-700 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-zinc-100 mb-1">{t.name}</div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span className="px-2 py-0.5 bg-zinc-800 rounded">{t.mode}</span>
                          <span className="px-2 py-0.5 bg-zinc-800 rounded">{t.type}</span>
                          <span className="px-2 py-0.5 bg-zinc-800 rounded">₹{t.entryFee}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wide ${t.status==='completed'?'bg-zinc-800 text-zinc-400 border border-zinc-700':'bg-blue-900/30 text-blue-300 border border-blue-700/50'}`}>
                          {t.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/owner/t/${t._id}/participants`} 
                            className="text-xs px-3 py-1.5 rounded-md bg-indigo-900/30 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/50 transition-colors"
                          >
                            View
                          </Link>
                          <button 
                            onClick={()=>startEdit(t)} 
                            className="text-xs px-3 py-1.5 rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors"
                          >
                            Edit
                          </button>
                          {t.status==='completed' && (
                            <button 
                              onClick={()=>deleteTournament(t._id)} 
                              className="text-xs px-3 py-1.5 rounded-md bg-orange-900/30 text-orange-300 border border-orange-700/50 hover:bg-orange-900/50 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}