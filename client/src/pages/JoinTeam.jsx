import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function JoinTeam(){
  const { teamCode } = useParams();
  const [form,setForm]=useState({name:'',inGameName:'',playerId:'',email:'',upiId:''});
  const [message,setMessage]=useState('');
  const join = async (e)=>{
    e.preventDefault();
    try {
      const reg = await apiFetch(`/api/registrations/join/${teamCode}`, { method:'POST', body: form });
      window.location.href = `/pay/player/${reg._id}?email=${encodeURIComponent(form.email||'')}`;
    } catch (err) { setMessage('Failed to join/pay'); }
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-3 max-w-sm mx-auto">
        {message && <div className="text-xs text-zinc-300">{message}</div>}
        <form onSubmit={join} className="space-y-3">
          {['name','inGameName','playerId','email','upiId'].map(k=> (
            <input key={k} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} />
          ))}
          <button className="w-full bg-indigo-600 rounded py-3 text-sm font-medium">Join & Pay</button>
        </form>
      </div>
    </div>
  );
}
