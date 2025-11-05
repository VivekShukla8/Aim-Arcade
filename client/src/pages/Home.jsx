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
      
      {/* Hero Section */}
      <section className="relative bg-hero min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-bold text-orange-400 uppercase tracking-wider mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Welcome to the Arena
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
              COMPETE.
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
              CONQUER.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Aim, enter, and win — register teams, invite players, and manage payments in a mobile-first esports hub.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tournaments" className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-sm uppercase tracking-wider overflow-hidden hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300">
              <span className="relative z-10">Browse Tournaments</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link to="/about" className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-zinc-950/50 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Players", value: "15K+" },
              { label: "Tournaments", value: upcoming.length + past.length + "+" },
              { label: "Prize Pool", value: "$500K+" },
              { label: "Teams", value: "3K+" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-xl border border-zinc-800/50 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      {upcoming.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Upcoming Tournaments
                </h2>
                <p className="text-zinc-500">Join the action and compete for glory</p>
              </div>
              <Link to="/tournaments" className="hidden md:block text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                View All →
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.slice(0, 3).map((t) => (
                <Link key={t.id} to={`/t/${t.id}`} className="group relative bg-gradient-to-br from-zinc-900/90 to-black/90 rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">{t.game || 'Esports'}</div>
                        <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
                      </div>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500 rounded-full text-xs font-bold text-green-400">
                        Open
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="font-semibold text-orange-400">{t.prize || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="w-full py-2.5 bg-gradient-to-r from-orange-500/10 to-red-600/10 group-hover:from-orange-500 group-hover:to-red-600 border border-orange-500/30 group-hover:border-orange-500 rounded-lg font-semibold text-sm text-orange-400 group-hover:text-white transition-all duration-300 text-center">
                      View Details
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Tournaments */}
      {past.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-zinc-950/30 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Completed Tournaments
                </h2>
                <p className="text-zinc-500">Check out past champions and results</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.slice(0, 3).map((t) => (
                <Link key={t.id} to={`/t/${t.id}`} className="group relative bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl overflow-hidden border border-zinc-800/30 hover:border-purple-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">{t.game || 'Esports'}</div>
                        <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
                      </div>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs font-bold text-zinc-400">
                        Ended
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="w-full py-2.5 bg-zinc-800/30 border border-zinc-700/50 rounded-lg font-semibold text-sm text-zinc-400 transition-all duration-300 text-center group-hover:border-purple-500/50 group-hover:text-purple-400">
                      View Results
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-purple-600/20 border border-orange-500/30 p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzFmMWYxZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Ready to Compete?
              </h2>
              <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
                Join thousands of players competing in the most exciting esports tournaments. Register your team today.
              </p>
              <Link to="/tournaments" className="inline-block px-10 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20">
                Start Competing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}