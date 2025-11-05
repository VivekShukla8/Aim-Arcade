import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';

export default function OwnerParticipants(){
  const { tournamentId } = useParams();
  const [teams,setTeams]=useState([]);
  useEffect(()=>{ 
    apiFetch(`/api/registrations/tournament/${tournamentId}`)
      .then(setTeams)
      .catch(()=>{}); 
  },[tournamentId]);
  
  const deleteTeam = async (teamId) => {
    const ok = confirm('Delete this team? This cannot be undone.');
    if(!ok) return;
    try {
      await apiFetch(`/api/registrations/${teamId}`, { method:'DELETE' });
      const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`);
      setTeams(refreshed);
    } catch(e) {
      alert('Failed to delete team');
    }
  };

  const approvePayment = async (teamId) => {
    try {
      await apiFetch(`/api/payments/manual/${teamId}/approve`, { method:'POST' });
      const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`);
      setTeams(refreshed);
    } catch(e) {
      alert('Failed to approve payment');
    }
  };

  const rejectPayment = async (teamId) => {
    const reason = prompt('Reason for rejection (optional):');
    if(reason === null) return;
    try {
      await apiFetch(`/api/payments/manual/${teamId}/reject`, { method:'POST', body:{ reason } });
      const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`);
      setTeams(refreshed);
    } catch(e) {
      alert('Failed to reject payment');
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-100">Registered Teams</h1>
          <p className="text-sm text-zinc-400 mt-1">{teams.length} {teams.length === 1 ? 'team' : 'teams'} registered</p>
        </div>

        {teams.length === 0 && (
          <div className="text-center py-20">
            <div className="text-zinc-500 text-sm">No teams registered yet</div>
            <div className="text-zinc-600 text-xs mt-1">Teams will appear here once they register</div>
          </div>
        )}

        <div className="space-y-4">
          {teams.map(team => (
            <div key={team._id} className="rounded-lg bg-zinc-900/80 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors">
              {/* Team Header */}
              <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-zinc-100">{team.teamName}</h3>
                    <span className={`text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wide ${
                      team.paymentStatus === 'paid' 
                        ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50' 
                        : 'bg-amber-900/30 text-amber-300 border border-amber-700/50'
                    }`}>
                      {team.paymentStatus || 'pending'}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTeam(team._id)} 
                    className="text-xs px-3 py-1.5 rounded-md bg-orange-900/30 text-orange-300 border border-orange-700/50 hover:bg-orange-900/50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Players List */}
              <div className="px-4 py-3">
                <div className="grid md:grid-cols-2 gap-2">
                  {team.players.map((p, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-900/50 border border-zinc-800">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-zinc-200 truncate">{p.name}</div>
                        <div className="text-xs text-zinc-500 truncate">@{p.inGameName}</div>
                      </div>
                      <span className={`ml-2 text-[10px] px-2 py-1 rounded font-medium ${
                        p.paid 
                          ? 'bg-emerald-900/40 text-emerald-400' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {p.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Payment Proof */}
              {team.manualPayment?.submitted && (
                <div className="mx-4 mb-4 rounded-lg bg-zinc-950/50 border border-zinc-800 overflow-hidden">
                  <div className="px-4 py-2.5 bg-zinc-900/50 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-400">Manual Payment Proof</span>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wide ${
                        team.manualPayment?.status === 'approved' 
                          ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50'
                          : team.manualPayment?.status === 'rejected'
                          ? 'bg-orange-900/30 text-orange-300 border border-orange-700/50'
                          : 'bg-amber-900/30 text-amber-300 border border-amber-700/50'
                      }`}>
                        {team.manualPayment?.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 space-y-2 text-xs">
                    {team.manualPayment?.amount != null && (
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Amount:</span>
                        <span className="text-zinc-200 font-medium">₹{team.manualPayment.amount}</span>
                      </div>
                    )}
                    {team.manualPayment?.note && (
                      <div>
                        <span className="text-zinc-500">Note:</span>
                        <p className="text-zinc-300 mt-1 break-words">{team.manualPayment.note}</p>
                      </div>
                    )}
                    {team.manualPayment?.proof && (
                      <div className="mt-3">
                        <img 
                          src={team.manualPayment.proof} 
                          alt="Payment Proof" 
                          className="max-h-64 rounded-lg border border-zinc-700 cursor-pointer hover:border-zinc-600 transition-colors"
                          onClick={() => window.open(team.manualPayment.proof, '_blank')}
                        />
                      </div>
                    )}
                    
                    {team.manualPayment?.status === 'pending' && (
                      <div className="flex gap-2 pt-3">
                        <button 
                          onClick={() => approvePayment(team._id)} 
                          className="flex-1 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-sm font-medium transition-colors"
                        >
                          Approve Payment
                        </button>
                        <button 
                          onClick={() => rejectPayment(team._id)} 
                          className="flex-1 px-3 py-2 rounded-md bg-orange-900/30 text-orange-300 border border-orange-700/50 hover:bg-orange-900/50 text-sm font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}