import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function Home(){
  const [me,setMe]=useState(null);
  const [upcoming,setUpcoming]=useState([]);
  const [past,setPast]=useState([]);
  useEffect(()=>{
    apiFetch('/api/users/me').then(setMe).catch(()=>setMe(null));
    apiFetch('/api/tournaments?status=upcoming').then(setUpcoming).catch(()=>setUpcoming([]));
    apiFetch('/api/tournaments?status=completed').then(setPast).catch(()=>setPast([]));
  },[]);
  return (
    <div className="min-h-screen">
      <TopNav />
      <section className="relative bg-hero h-[70vh] md:h-[80vh]">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-6xl mx-auto h-full flex flex-col items-center justify-center text-center px-4">
          <div className="uppercase tracking-widest text-xs text-zinc-300 mb-2">Welcome to</div>
          <div className="text-5xl md:text-7xl font-extrabold">AimArcade</div>
          <div className="text-sm md:text-base text-zinc-300 mt-3 max-w-2xl">Aim, enter, and win — register teams, invite players, and manage payments in a mobile-first esports hub.</div>
          <div className="mt-6 flex gap-3">
            <Link to="/tournaments" className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-5 py-3 rounded">Browse Tournaments</Link>
            <Link to="/about" className="bg-zinc-900 border border-zinc-700 px-5 py-3 rounded">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
