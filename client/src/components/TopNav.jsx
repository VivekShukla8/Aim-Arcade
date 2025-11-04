import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch, clearToken } from '../api/client';
import logo from '../assets/aimarcade-logo.svg';

export default function TopNav(){
  const { pathname } = useLocation();
  const [me,setMe]=useState(null);
  useEffect(()=>{ apiFetch('/api/users/me').then(setMe).catch(()=>setMe(null)); },[]);
  const Item = ({to,label,match}) => (
    <Link to={to} className={`px-4 py-2 text-xs tracking-wide ${match? 'text-white':'text-zinc-300'} hover:text-white`}>{label}</Link>
  );
  const [open,setOpen]=useState(false);
  const [mobile,setMobile]=useState(false);
  return (
    <header className="sticky top-0 z-30 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between overflow-visible">
        <Link to="/" aria-label="AimArcade" className="flex items-center gap-2 min-w-0 overflow-visible">
          <img src={logo} alt="AimArcade" className="w-[200px] md:w-[240px] h-auto flex-shrink-0 object-contain"/>
        </Link>
        <nav className="hidden md:flex items-center">
          <Item to="/" label="HOME" match={pathname==='/'}/>
          <Item to="/about" label="ABOUT" match={pathname==='/about'}/>
          <Item to="/tournaments" label="TOURNAMENT" match={pathname.startsWith('/tournaments')||pathname.startsWith('/t/')}/>
          {/* TEAM removed from top nav; accessible via avatar menu only */}
          <Item to="/contact" label="CONTACT" match={pathname==='/contact'}/>
          {me?.role==='owner' && <Item to="/owner" label="MANAGE" match={pathname.startsWith('/owner')}/>}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={()=>setMobile(v=>!v)} className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded bg-black/60 border border-zinc-600">
            <span className="sr-only">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-zinc-200"><path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
          </button>
          <div className="relative">
          {me ? (
            <button onClick={()=>setOpen(v=>!v)} className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/60 border border-zinc-600 text-xs font-bold">
              {(me.name?.[0] || me.email?.[0] || 'U').toUpperCase()}
            </button>
          ) : (
            <Link to="/auth?mode=login" className="hidden md:inline-block bg-black/50 border border-zinc-600 text-xs px-3 py-2 rounded">LOG-IN</Link>
          )}
          {open && me && (
            <div className="absolute right-0 mt-2 w-44 rounded bg-black/80 border border-zinc-700 text-sm overflow-hidden">
              <div className="px-3 py-2 text-zinc-400 truncate">{me.name || me.email}</div>
              <Link to="/my" className="block px-3 py-2 hover:bg-black/60">My Teams</Link>
              <Link to="/tournaments" className="block px-3 py-2 hover:bg-black/60">Tournaments</Link>
              {me.role==='owner' && <Link to="/owner" className="block px-3 py-2 hover:bg-black/60">Manage</Link>}
              <button onClick={()=>{clearToken(); setOpen(false); setMe(null); window.location.href = '/';}} className="w-full text-left px-3 py-2 hover:bg-black/60">Logout</button>
            </div>
          )}
          </div>
        </div>
      </div>
      {mobile && (
        <div className="md:hidden border-t border-zinc-800 bg-black/80">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-1 text-sm">
            <Link onClick={()=>setMobile(false)} to="/" className="px-2 py-2 hover:bg-black/60 rounded">HOME</Link>
            <Link onClick={()=>setMobile(false)} to="/about" className="px-2 py-2 hover:bg-black/60 rounded">ABOUT</Link>
            <Link onClick={()=>setMobile(false)} to="/tournaments" className="px-2 py-2 hover:bg-black/60 rounded">TOURNAMENT</Link>
            <Link onClick={()=>setMobile(false)} to="/contact" className="px-2 py-2 hover:bg-black/60 rounded">CONTACT</Link>
            {me?.role==='owner' && <Link onClick={()=>setMobile(false)} to="/owner" className="px-2 py-2 hover:bg-black/60 rounded">MANAGE</Link>}
            {!me && <Link onClick={()=>setMobile(false)} to="/auth?mode=login" className="px-2 py-2 hover:bg-black/60 rounded">LOG-IN</Link>}
            {me && (
              <>
                <Link onClick={()=>setMobile(false)} to="/my" className="px-2 py-2 hover:bg-black/60 rounded">My Teams</Link>
                <button onClick={()=>{clearToken(); setMe(null); window.location.href='/';}} className="text-left px-2 py-2 hover:bg-black/60 rounded">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
