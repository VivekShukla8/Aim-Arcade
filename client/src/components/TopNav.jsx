import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch, clearToken } from '../api/client';
import logo from '../assets/aimarcade-logo.svg';

export default function TopNav(){
  const { pathname } = useLocation();
  const [me,setMe]=useState(null);
  useEffect(()=>{ apiFetch('/api/users/me').then(setMe).catch(()=>setMe(null)); },[]);
  const Item = ({to,label,match}) => (
    <Link to={to} className={`px-4 py-2 text-xs font-semibold tracking-wide ${match? 'text-white bg-white/5':'text-zinc-400'} hover:text-white hover:bg-white/5 transition-all rounded-lg`}>{label}</Link>
  );
  const [open,setOpen]=useState(false);
  const [mobile,setMobile]=useState(false);
  return (
    <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between overflow-visible">
        <Link to="/" aria-label="AimArcade" className="flex items-center gap-2 min-w-0 overflow-visible group">
          <img src={logo} alt="AimArcade" className="w-[200px] md:w-[240px] h-auto flex-shrink-0 object-contain group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.5)] transition-all duration-300"/>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Item to="/" label="HOME" match={pathname==='/'}/>
          <Item to="/about" label="ABOUT" match={pathname==='/about'}/>
          <Item to="/tournaments" label="TOURNAMENT" match={pathname.startsWith('/tournaments')||pathname.startsWith('/t/')}/>
          {/* TEAM removed from top nav; accessible via avatar menu only */}
          <Item to="/contact" label="CONTACT" match={pathname==='/contact'}/>
          {me?.role==='owner' && <Item to="/owner" label="MANAGE" match={pathname.startsWith('/owner')}/>}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={()=>setMobile(v=>!v)} className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded bg-zinc-900/60 border border-zinc-700 hover:border-orange-500/50 hover:bg-zinc-800/60 transition-all">
            <span className="sr-only">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-zinc-200">
              <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="relative">
          {me ? (
            <button onClick={()=>setOpen(v=>!v)} className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 border border-orange-500/50 text-xs font-bold text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all hover:scale-110">
              {(me.name?.[0] || me.email?.[0] || 'U').toUpperCase()}
            </button>
          ) : (
            <Link to="/auth?mode=login" className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 border border-orange-500/50 text-xs font-bold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all hover:scale-105">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              LOG-IN
            </Link>
          )}
          {open && me && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-black/95 backdrop-blur-xl border border-zinc-800 text-sm overflow-hidden shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 text-zinc-300 truncate border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold">
                  {(me.name?.[0] || me.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="truncate">{me.name || me.email}</span>
              </div>
              <Link to="/my" className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-900/70 transition-colors text-zinc-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                My Teams
              </Link>
              <Link to="/tournaments" className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-900/70 transition-colors text-zinc-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Tournaments
              </Link>
              {me.role==='owner' && (
                <Link to="/owner" className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-900/70 transition-colors text-zinc-300 border-t border-zinc-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Manage
                </Link>
              )}
              <button onClick={()=>{clearToken(); setOpen(false); setMe(null); window.location.href = '/';}} className="w-full flex items-center gap-2 text-left px-4 py-2.5 hover:bg-red-900/20 transition-colors text-red-400 border-t border-zinc-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
      {mobile && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-xl shadow-2xl">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1 text-sm">
            <Link onClick={()=>setMobile(false)} to="/" className="flex items-center gap-2 px-3 py-3 hover:bg-zinc-900/50 rounded-lg transition-colors text-zinc-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              HOME
            </Link>
            <Link onClick={()=>setMobile(false)} to="/about" className="flex items-center gap-2 px-3 py-3 hover:bg-zinc-900/50 rounded-lg transition-colors text-zinc-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ABOUT
            </Link>
            <Link onClick={()=>setMobile(false)} to="/tournaments" className="flex items-center gap-2 px-3 py-3 hover:bg-zinc-900/50 rounded-lg transition-colors text-zinc-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              TOURNAMENT
            </Link>
            <Link onClick={()=>setMobile(false)} to="/contact" className="flex items-center gap-2 px-3 py-3 hover:bg-zinc-900/50 rounded-lg transition-colors text-zinc-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              CONTACT
            </Link>
            {me?.role==='owner' && (
              <Link onClick={()=>setMobile(false)} to="/owner" className="flex items-center gap-2 px-3 py-3 hover:bg-zinc-900/50 rounded-lg transition-colors text-zinc-300 border-t border-zinc-800 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                MANAGE
              </Link>
            )}
            {!me && (
              <Link onClick={()=>setMobile(false)} to="/auth?mode=login" className="flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold mt-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                LOG-IN
              </Link>
            )}
            {me && (
              <>
                <Link onClick={()=>setMobile(false)} to="/my" className="flex items-center gap-2 px-3 py-3 hover:bg-zinc-900/50 rounded-lg transition-colors text-zinc-300 border-t border-zinc-800 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  My Teams
                </Link>
                <button onClick={()=>{clearToken(); setMe(null); window.location.href='/';}} className="flex items-center gap-2 text-left px-3 py-3 hover:bg-red-900/20 rounded-lg transition-colors text-red-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}