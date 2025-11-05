import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function MyRegs(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ apiFetch('/api/registrations/mine').then(setItems).catch(()=>{}); },[]);
  
  const del = async (id)=>{
    const ok = confirm('Delete this team?');
    if (!ok) return;
    await apiFetch(`/api/registrations/${id}`, { method:'DELETE' });
    const updated = await apiFetch('/api/registrations/mine');
    setItems(updated);
  };

  const copyInvite = (link) => {
    navigator.clipboard.writeText(link);
    alert('Invite link copied!');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <TopNav />
      
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            My Teams
          </div>
          <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Team Registrations
          </h1>
          <p className="text-sm md:text-base text-zinc-500 mt-2">Manage your tournament teams and invitations</p>
        </div>

        {/* Teams Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-zinc-400 mb-2">No Teams Yet</h3>
            <p className="text-xs md:text-sm text-zinc-600 mb-4 px-4">Register for a tournament to create your first team</p>
            <Link to="/tournaments" className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Browse Tournaments
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4">
            {items.map(r=> (
              <div key={r._id} className="group relative bg-gradient-to-br from-zinc-900/70 to-black/70 rounded-xl border border-zinc-800/50 hover:border-orange-500/30 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative p-4 md:p-5">
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-3">
                    {/* Team Header */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-purple-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white truncate">
                          {r.teamName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {r.players.length}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {r.paymentStatus || 'pending'}
                          </span>
                        </div>
                        {/* Tournament Info + Amount (Mobile) */}
                        {r.tournamentId && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-zinc-500">Tournament</span>
                              <Link to={`/t/${r.tournamentId._id || r.tournamentId}`} className="text-orange-400 hover:underline truncate max-w-[60%] text-right">
                                {r.tournamentId.name || '-'}
                              </Link>
                            </div>
                            <div className="flex justify-between text-xs text-zinc-400">
                              <span>Date</span>
                              <span>{r.tournamentId.date ? new Date(r.tournamentId.date).toLocaleDateString() : '-'}</span>
                            </div>
                            <div className="flex justify-between text-xs text-zinc-400">
                              <span>Time</span>
                              <span>{r.tournamentId.time || '-'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-zinc-500">Amount Paid</span>
                              <span className={`${(r.paymentStatus==='paid' || r.manualPayment?.status==='approved') ? 'text-green-400' : 'text-zinc-400'} font-medium`}>
                                ₹{(r.paymentStatus==='paid' 
                                  ? (r.tournamentId?.entryFee || 0) 
                                  : (r.manualPayment?.status==='approved' 
                                      ? (r.manualPayment?.amount || r.tournamentId?.entryFee || 0) 
                                      : 0))}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Invite Link */}
                    {r.inviteLink && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                        <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="text-xs text-zinc-500 truncate flex-1 font-mono">{r.inviteLink.split('/').pop()}</span>
                        <button 
                          onClick={() => copyInvite(r.inviteLink)}
                          className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/team/${r._id}`} 
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500/50 rounded-lg text-xs font-semibold text-orange-400 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </Link>
                      <button 
                        onClick={()=>del(r._id)} 
                        className="flex items-center justify-center w-10 h-10 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all group/btn"
                        title="Delete team"
                      >
                        <svg className="w-4 h-4 text-zinc-500 group-hover/btn:text-zinc-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-start justify-between gap-4">
                    {/* Team Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-purple-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                            {r.teamName}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              {r.players.length} Players
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {r.paymentStatus || 'pending'}
                            </span>
                          </div>
                          {/* Tournament Info + Amount (Desktop) */}
                          {r.tournamentId && (
                            <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
                              <div className="col-span-1">
                                <div className="text-zinc-500">Tournament</div>
                                <Link to={`/t/${r.tournamentId._id || r.tournamentId}`} className="text-orange-400 hover:underline truncate block">
                                  {r.tournamentId.name || '-'}
                                </Link>
                              </div>
                              <div className="col-span-1">
                                <div className="text-zinc-500">Date</div>
                                <div className="text-zinc-300">{r.tournamentId.date ? new Date(r.tournamentId.date).toLocaleDateString() : '-'}</div>
                              </div>
                              <div className="col-span-1">
                                <div className="text-zinc-500">Time</div>
                                <div className="text-zinc-300">{r.tournamentId.time || '-'}</div>
                              </div>
                              <div className="col-span-3">
                                <div className="text-zinc-500">Amount Paid</div>
                                <div className={`${(r.paymentStatus==='paid' || r.manualPayment?.status==='approved') ? 'text-green-400' : 'text-zinc-400'} font-medium`}>
                                  ₹{(r.paymentStatus==='paid' 
                                    ? (r.tournamentId?.entryFee || 0) 
                                    : (r.manualPayment?.status==='approved' 
                                        ? (r.manualPayment?.amount || r.tournamentId?.entryFee || 0) 
                                        : 0))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Invite Link */}
                      {r.inviteLink && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                          <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="text-xs text-zinc-500 truncate flex-1">{r.inviteLink}</span>
                          <button 
                            onClick={() => copyInvite(r.inviteLink)}
                            className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/team/${r._id}`} 
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500/50 rounded-lg text-xs font-semibold text-orange-400 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Details
                      </Link>
                      <button 
                        onClick={()=>del(r._id)} 
                        className="flex items-center justify-center w-9 h-9 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all group/btn"
                        title="Delete team"
                      >
                        <svg className="w-4 h-4 text-zinc-500 group-hover/btn:text-zinc-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}