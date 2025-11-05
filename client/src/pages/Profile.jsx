import { useEffect, useState } from 'react';
import TopNav from '../components/TopNav.jsx';
import { apiFetch, clearToken } from '../api/client';

export default function Profile(){
  const [me,setMe]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    (async()=>{
      try{
        const u = await apiFetch('/api/users/me');
        setMe(u);
      }catch(e){ setError(e?.message||'Failed to load profile'); }
      finally{ setLoading(false); }
    })();
  },[]);
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Profile</h1>
        {loading && <div className="text-sm text-zinc-400">Loading...</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {me && (
          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-bold">
                {(me.name?.[0] || me.email?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{me.name || 'Unnamed User'}</div>
                <div className="text-zinc-400 text-xs">{me.email}</div>
              </div>
            </div>
            {me.role && (
              <div className="text-xs text-zinc-400">Role: <span className="text-zinc-300 font-mono">{me.role}</span></div>
            )}
            <button onClick={()=>{ clearToken(); window.location.href='/'; }} className="mt-2 px-3 py-2 rounded bg-red-600 text-sm">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
