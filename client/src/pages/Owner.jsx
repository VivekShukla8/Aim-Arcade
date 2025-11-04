import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function Owner(){
  const today = new Date();
  const toDate = () => {
    const y = today.getFullYear();
    const m = String(today.getMonth()+1).padStart(2,'0');
    const d = String(today.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  };
  const toTime = () => {
    const h = String(today.getHours()).padStart(2,'0');
    const min = String(today.getMinutes()).padStart(2,'0');
    return `${h}:${min}`;
  };
  const [form,setForm]=useState({ name:'', mode:'classic', type:'solo', entryFee:50, map:'Erangel', date:toDate(), time:toTime(), maxTeams:16, status:'upcoming' });
  const [msg,setMsg]=useState('');
  const [list,setList]=useState([]);
  const [editId,setEditId]=useState('');
  const [edit,setEdit]=useState({ name:'', mode:'classic', type:'solo', entryFee:50, map:'', date:toDate(), time:toTime(), maxTeams:16, status:'upcoming' });
  const load = async ()=>{ const data = await apiFetch('/api/tournaments'); setList(data); };
  useEffect(()=>{ load().catch(()=>{}); },[]);
  const create = async (e)=>{
    e.preventDefault();
    try { await apiFetch('/api/tournaments', { method:'POST', body: { ...form, entryFee:Number(form.entryFee), maxTeams:Number(form.maxTeams) }}); setMsg('Created'); await load(); }
    catch { setMsg('Failed'); }
  };
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
      await apiFetch(`/api/tournaments/${editId}`, { method:'PATCH', body:{ ...edit, entryFee:Number(edit.entryFee), maxTeams:Number(edit.maxTeams) } });
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
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Map" value={form.map} onChange={e=>setForm({...form,map:e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
            <input type="time" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}>
              <option value="classic">classic</option>
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
                    <Link to={`/owner/t/${t._id}/participants`} className="text-xs text-indigo-400">Participants →</Link>
                    <button onClick={()=>startEdit(t)} className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700">Edit</button>
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
