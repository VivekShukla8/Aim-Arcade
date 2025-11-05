import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, clearToken } from '../api/client';

export default function HeaderBar({ title }){
  const [me,setMe]=useState(null);
  const [open,setOpen]=useState(false);
  useEffect(()=>{ apiFetch('/api/users/me').then(setMe).catch(()=>setMe(null)); },[]);
  const initial = me?.name?.[0]?.toUpperCase() || me?.email?.[0]?.toUpperCase() || 'U';
  return (
    <div className="sticky top-0 z-20 bg-black/70 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="relative">
        <button onClick={()=>setOpen(v=>!v)} className="w-8 h-8 rounded-full bg-zinc-800 text-xs font-bold flex items-center justify-center">
          {initial}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded bg-zinc-900 border border-zinc-800 text-sm overflow-hidden">
            {me ? (
              <>
                <div className="px-3 py-2 text-zinc-400">{me.name || me.email}</div>
                <Link to="/profile" className="block px-3 py-2 hover:bg-zinc-800">Profile</Link>
                <button onClick={()=>{clearToken(); setOpen(false);}} className="w-full text-left px-3 py-2 hover:bg-zinc-800">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 hover:bg-zinc-800">Login</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
