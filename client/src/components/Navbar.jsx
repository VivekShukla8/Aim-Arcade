import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export default function Navbar() {
  const { pathname } = useLocation();
  const [me,setMe]=useState(null);
  useEffect(()=>{ apiFetch('/api/users/me').then(u=>setMe(u)).catch(()=>setMe(null)); },[]);
  const Item = ({ to, label, active }) => (
    <Link to={to} className={`flex-1 text-center py-3 text-xs uppercase tracking-wide ${active?'text-white':'text-zinc-400'}`}>{label}</Link>
  );
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-black/70 backdrop-blur border-t border-zinc-800 flex max-w-5xl mx-auto">
      <Item to="/" label="About" active={pathname==='/'} />
      <Item to="/tournaments" label="Tournaments" active={pathname.startsWith('/tournaments') || pathname.startsWith('/t/')} />
      <Item to="/my" label="My Team" active={pathname==='/my' || pathname.startsWith('/team/')} />
      {me?.role==='owner' && <Item to="/manage" label="Manage" active={pathname.startsWith('/manage') || pathname.startsWith('/owner')} />}
    </nav>
  );
}
