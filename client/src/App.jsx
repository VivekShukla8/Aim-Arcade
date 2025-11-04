import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './index.css';
// Bottom Navbar removed across app; using TopNav only
// import Navbar from './components/Navbar.jsx';
import TopNav from './components/TopNav.jsx';
import HeaderBar from './components/HeaderBar.jsx';
import { apiFetch, setToken, getToken, clearToken, API_BASE_URL } from './api/client';
import { openCheckout } from './utils/razorpay';
import { useEffect, useState } from 'react';
import upiQr from './assets/upi-qr.png';

const Container = ({ children }) => (
  <div className="bg-black text-zinc-200 min-h-screen pb-16 max-w-5xl mx-auto px-4">{children}</div>
);

const Header = ({ title }) => (<HeaderBar title={title} />);

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/users/login', { method: 'POST', body: { email, password } });
      setToken(res.token);
      nav('/');
    } catch (err) { setError('Login failed'); }
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-sm mx-auto">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <form onSubmit={login} className="space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm"/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm"/>
          <button className="w-full bg-indigo-600 rounded py-3 text-sm font-medium">Login</button>
        </form>
        <a href={`${API_BASE_URL}/api/auth/google`} className="block text-center w-full bg-zinc-800 rounded py-3 text-sm">Continue with Google</a>
        {getToken() && <button onClick={()=>{clearToken(); nav('/');}} className="w-full text-zinc-400 text-xs">Logout (clear token)</button>}
      </div>
    </div>
  );
}

function Contact(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const mailto = () => {
    const to = 'vivekshukla8823@gmail.com';
    const subject = encodeURIComponent(`Contact from ${name||'Guest'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };
  
  return (
    <div className="min-h-screen">
      <TopNav />
      <section className="max-w-md md:max-w-lg mx-auto px-4 py-10 space-y-4">
        <div className="text-2xl font-bold">Contact Us</div>
        <div className="rounded bg-zinc-900/80 border border-zinc-800 p-4 space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm"/>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm"/>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message" rows={5} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm"/>
          <button onClick={mailto} className="w-full bg-indigo-600 rounded py-3 text-sm font-medium">Send</button>
        </div>
        <div className="text-sm text-zinc-400">Or reach us on WhatsApp: <a className="text-indigo-400" href="https://wa.me/919424938202" target="_blank">+91 9424938202</a></div>
        <div className="text-sm text-zinc-400">Email: <a className="text-indigo-400" href="mailto:vivekshukla8823@gmail.com">vivekshukla8823@gmail.com</a></div>
      </section>
    </div>
  );
}

function Auth() {
  const nav = useNavigate();
  const [params,setParams] = useSearchParams();
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode,setMode]=useState(initialMode);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');

  useEffect(()=>{ setMode(params.get('mode') === 'signup' ? 'signup' : 'login'); },[params]);

  const submit = async (e)=>{
    e.preventDefault();
    try {
      if (mode==='signup') {
        await apiFetch('/api/users/register', { method:'POST', body:{ name, email, password } });
      }
      const res = await apiFetch('/api/users/login', { method:'POST', body:{ email, password } });
      setToken(res.token);
      nav('/');
    } catch (err) { setError(mode==='signup' ? 'Sign up failed' : 'Sign in failed'); }
  };
  const toggle = ()=>{
    const next = mode==='login' ? 'signup' : 'login';
    setMode(next);
    setParams({ mode: next });
  };
  return (
    <div className="min-h-screen max-w-none">
      <div className="grid md:grid-cols-2 min-h-screen">
        <div className="auth-left hidden md:block relative">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="bg-black text-zinc-200 flex items-center justify-center p-6">
          <div className="w-full max-w-sm space-y-6">
            <div>
              <div className="text-3xl font-extrabold">Happening now</div>
              <div className="text-sm text-zinc-400">Join today.</div>
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <a href={`${API_BASE_URL}/api/auth/google`} className="block text-center w-full rounded-full py-3 text-sm bg-white text-black">Continue with Google</a>
            <div className="text-center text-xs text-zinc-500">OR</div>
            {mode==='signup' && (
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm"/>
            )}
            <form onSubmit={submit} className="space-y-3">
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm"/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm"/>
              <button className="w-full rounded-full py-3 text-sm font-medium bg-indigo-600">{mode==='login'?'Sign In':'Create account'}</button>
            </form>
            <button onClick={toggle} className="w-full rounded-full py-3 text-sm bg-zinc-900 border border-zinc-800">
              {mode==='login'? 'Create account' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
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

function AboutPage(){
  return (
    <div className="min-h-screen">
      <TopNav />
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-8">
          <div className="text-xs text-yellow-400 mb-2">ABOUT AIMARCADE</div>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">An esports platform for creating and managing teams</h2>
          <p className="mt-4 text-zinc-300">AimArcade streamlines registrations, team invites, and payments with Razorpay and UPI. Owners get powerful controls to approve proofs, manage participants, and keep lobbies organized. Players get a clean, mobile-first flow.</p>
          <ul className="mt-4 text-sm text-zinc-400 space-y-2 list-disc pl-5">
            <li>Register teams in seconds and invite by code</li>
            <li>Pay via UPI or Card/Wallet (Razorpay)</li>
            <li>Owner dashboards for approvals and deletions</li>
            <li>Responsive UI for phones and desktops</li>
          </ul>
        </div>
        <div className="rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-center p-8">
          <div className="text-4xl md:text-5xl font-extrabold text-zinc-600">Clutch the win.</div>
        </div>
      </section>
    </div>
  );
}

function Tournaments() {
  const [tab,setTab]=useState('upcoming');
  const [items, setItems] = useState([]);
  const [teamCode,setTeamCode]=useState('');
  useEffect(()=>{ apiFetch(`/api/tournaments?status=${tab}`).then(setItems).catch(()=>{}); },[tab]);
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={()=>setTab('upcoming')} className={`px-3 py-2 rounded ${tab==='upcoming'?'bg-indigo-600':'bg-zinc-900 border border-zinc-800'}`}>Upcoming</button>
          <button onClick={()=>setTab('completed')} className={`px-3 py-2 rounded ${tab==='completed'?'bg-indigo-600':'bg-zinc-900 border border-zinc-800'}`}>Completed</button>
        </div>
        <div className="flex gap-2 text-sm">
          <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2" placeholder="Join by Team Code" value={teamCode} onChange={e=>setTeamCode(e.target.value)} />
          <Link to={teamCode? `/join/${teamCode}`: '#'} className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700">Join</Link>
        </div>
        <div className="grid gap-3">
        {items.map(t=> (
          <Link to={`/t/${t._id}`} key={t._id} className="block rounded-lg bg-zinc-900/80 border border-zinc-800 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-zinc-400">{t.mode.toUpperCase()} · {t.type.toUpperCase()} · Fee ₹{t.entryFee}</div>
              </div>
              <div className="text-xs text-zinc-500">{t.status}</div>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
}

function TournamentDetail() {
  const { id } = useParams();
  const [t, setT] = useState(null);
  const [me,setMe]=useState(null);
  const [myRegs,setMyRegs]=useState([]);
  useEffect(()=>{
    apiFetch(`/api/tournaments/${id}`).then(setT).catch(()=>{});
    apiFetch('/api/users/me').then(setMe).catch(()=>setMe(null));
    apiFetch('/api/registrations/mine').then(setMyRegs).catch(()=>setMyRegs([]));
  },[id]);
  if (!t) return <div className="min-h-screen"><TopNav /><div className="p-4 text-sm text-zinc-300 max-w-5xl mx-auto">Loading...</div></div>;
  const myTeam = myRegs.find(r => r.tournamentId && (r.tournamentId._id===t._id || r.tournamentId===t._id));
  const canSeeRoom = me?.role==='owner' || (myTeam && (myTeam.paymentStatus==='paid'));
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-3 max-w-5xl mx-auto">
        <div className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
          <div>Mode: {t.mode}</div>
          <div>Type: {t.type}</div>
          <div>Entry Fee: ₹{t.entryFee}</div>
          <div>Max Teams: {t.maxTeams}</div>
          {canSeeRoom && (t.roomId || t.roomPassword) && (
            <div className="mt-2 p-2 rounded bg-black/40 border border-zinc-800">
              <div className="text-xs text-zinc-400">Room Credentials</div>
              {t.roomId && <div>Room ID: <span className="font-mono">{t.roomId}</span></div>}
              {t.roomPassword && <div>Password: <span className="font-mono">{t.roomPassword}</span></div>}
            </div>
          )}
        </div>
        <Link to={`/register/${t._id}`} className="inline-block text-center bg-indigo-600 rounded px-4 py-2 text-sm font-medium">Register Team</Link>
      </div>
    </div>
  );
}

function RegisterTeam() {
  const { tournamentId } = useParams();
  const [t, setT] = useState(null);
  const [teamName,setTeamName]=useState('');
  const [iglName,setIglName]=useState('');
  const [payForAll,setPayForAll]=useState(false);
  const [players,setPlayers]=useState([]);
  const [message,setMessage]=useState('');

  useEffect(()=>{
    apiFetch(`/api/tournaments/${tournamentId}`).then((tt)=>{
      setT(tt);
      const size = tt.type==='solo'?1: tt.type==='duo'?2:4;
      setPlayers(Array.from({length:size},()=>({name:'',inGameName:'',playerId:'',email:'',upiId:''})));
    });
  },[tournamentId]);

  const onChangePlayer = (i, key, val)=>{
    setPlayers(prev=> prev.map((p,idx)=> idx===i? {...p,[key]:val}: p));
  };

  const submit = async (e)=>{
    e.preventDefault();
    try {
      const reg = await apiFetch('/api/registrations', { method:'POST', body:{ tournamentId, teamName, iglName, players, payForAll }});
      if (payForAll) {
        // Route to dedicated payment page for team payments
        window.location.href = `/pay/team/${reg._id}`;
      } else {
        setMessage(`Team created. Share invite: ${reg.inviteLink}`);
      }
    } catch (err) { setMessage('Failed to register'); }
  };

  if (!t) return <div className="min-h-screen"><TopNav /><div className="p-4 text-sm text-zinc-300 max-w-5xl mx-auto">Loading...</div></div>;
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        {message && <div className="text-xs text-zinc-300">{message}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Team name" value={teamName} onChange={e=>setTeamName(e.target.value)} />
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="IGL name" value={iglName} onChange={e=>setIglName(e.target.value)} />
          <div className="rounded border border-zinc-800">
            {players.map((p,i)=> (
              <div key={i} className="p-3 grid grid-cols-2 gap-2 border-b border-zinc-800 last:border-0">
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs" placeholder="Name" value={p.name} onChange={e=>onChangePlayer(i,'name',e.target.value)} />
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs" placeholder="In-game name" value={p.inGameName} onChange={e=>onChangePlayer(i,'inGameName',e.target.value)} />
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs" placeholder="Player ID" value={p.playerId} onChange={e=>onChangePlayer(i,'playerId',e.target.value)} />
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs" placeholder="Email" value={p.email} onChange={e=>onChangePlayer(i,'email',e.target.value)} />
                <input className="bg-zinc-900 rounded px-3 py-2 text-xs col-span-2" placeholder="UPI ID" value={p.upiId} onChange={e=>onChangePlayer(i,'upiId',e.target.value)} />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={payForAll} onChange={e=>setPayForAll(e.target.checked)} /> Pay for all players now
          </label>
          <button className="w-full bg-indigo-600 rounded py-3 text-sm font-medium">Create Team</button>
        </form>
      </div>
    </div>
  );
}

function JoinTeam() {
  const { teamCode } = useParams();
  const [form,setForm]=useState({name:'',inGameName:'',playerId:'',email:'',upiId:''});
  const [message,setMessage]=useState('');
  const join = async (e)=>{
    e.preventDefault();
    try {
      const reg = await apiFetch(`/api/registrations/join/${teamCode}`, { method:'POST', body: form });
      // Route to dedicated player payment page
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

function MyRegs(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ apiFetch('/api/registrations/mine').then(setItems).catch(()=>{}); },[]);
  const del = async (id)=>{
    const ok = confirm('Delete this team?');
    if (!ok) return;
    await apiFetch(`/api/registrations/${id}`, { method:'DELETE' });
    const updated = await apiFetch('/api/registrations/mine');
    setItems(updated);
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-3 max-w-5xl mx-auto">
        {items.map(r=> (
          <div key={r._id} className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.teamName}</div>
                <div className="text-xs text-zinc-400">Players: {r.players.length} · Status: {r.paymentStatus || 'pending'}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/team/${r._id}`} className="text-xs text-indigo-400">Details →</Link>
                <button onClick={()=>del(r._id)} className="text-xs px-2 py-1 rounded bg-red-600">Delete</button>
              </div>
            </div>
            {r.inviteLink && <div className="text-[10px] text-zinc-500 break-all mt-1">Invite: {r.inviteLink}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Owner(){
  const today = new Date();
  const toDate = () => {
    const y = today.getFullYear();
    const m = String(today.getMonth()+1).padStart(2,'0');
    const d = String(today.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  };
  const toTime = () => {
    const h = String(today.getHours()).padStart(2,'0');
    const min = String(today.getMinutes()).padStart(2,'0');
    return `${h}:${min}`;
  };
  const [form,setForm]=useState({ name:'', mode:'classic', type:'solo', entryFee:50, map:'Erangel', date:toDate(), time:toTime(), maxTeams:16, status:'upcoming' });
  const [msg,setMsg]=useState('');
  const [list,setList]=useState([]);
  const [editId,setEditId]=useState('');
  const [edit,setEdit]=useState({ name:'', mode:'classic', type:'solo', entryFee:50, map:'', date:toDate(), time:toTime(), maxTeams:16, status:'upcoming' });
  const load = async ()=>{ const data = await apiFetch('/api/tournaments'); setList(data); };
  useEffect(()=>{ load().catch(()=>{}); },[]);
  const create = async (e)=>{
    e.preventDefault();
    try { const t = await apiFetch('/api/tournaments', { method:'POST', body: { ...form, entryFee:Number(form.entryFee), maxTeams:Number(form.maxTeams) }}); setMsg('Created'); }
    catch { setMsg('Failed'); }
  };
  const startEdit = (t)=>{
    setEditId(t._id);
    setEdit({
      name: t.name||'',
      mode: t.mode||'classic',
      type: t.type||'solo',
      entryFee: t.entryFee??50,
      map: t.map||'',
      date: t.date||toDate(),
      time: t.time||toTime(),
      maxTeams: t.maxTeams??16,
      status: t.status||'upcoming'
    });
  };
  const saveEdit = async (e)=>{
    e.preventDefault();
    try{
      await apiFetch(`/api/tournaments/${editId}`, { method:'PATCH', body:{ ...edit, entryFee:Number(edit.entryFee), maxTeams:Number(edit.maxTeams) } });
      setMsg('Updated');
      setEditId('');
      await load();
    }catch{ setMsg('Update failed'); }
  };
  const cancelEdit = ()=>{ setEditId(''); };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {msg && <div className="text-xs text-zinc-300">{msg}</div>}
        <form onSubmit={create} className="space-y-3 text-sm order-3 md:order-1">
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Map" value={form.map} onChange={e=>setForm({...form,map:e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
            <input type="time" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.mode} onChange={e=>setForm({...form,mode:e.target.value})}>
              <option value="classic">classic</option>
              <option value="clash_squad">clash_squad</option>
            </select>
            <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="solo">solo</option>
              <option value="duo">duo</option>
              <option value="squad">squad</option>
            </select>
            <input type="number" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Entry Fee" value={form.entryFee} onChange={e=>setForm({...form,entryFee:e.target.value})} />
            <input type="number" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Max Teams (max 25)" value={form.maxTeams} onChange={e=>setForm({...form,maxTeams:e.target.value})} />
          </div>
          <button className="w-full bg-indigo-600 rounded py-3 text-sm font-medium">Create</button>
        </form>
        {editId && (
          <form onSubmit={saveEdit} className="space-y-3 text-sm order-2 md:order-2 bg-zinc-900/70 border border-zinc-800 rounded p-3">
            <div className="text-sm font-semibold">Edit Tournament</div>
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Name" value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})} />
            <input className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Map" value={edit.map} onChange={e=>setEdit({...edit,map:e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={edit.date} onChange={e=>setEdit({...edit,date:e.target.value})} />
              <input type="time" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={edit.time} onChange={e=>setEdit({...edit,time:e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={edit.mode} onChange={e=>setEdit({...edit,mode:e.target.value})}>
                <option value="classic">classic</option>
                <option value="clash_squad">clash_squad</option>
              </select>
              <select className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" value={edit.type} onChange={e=>setEdit({...edit,type:e.target.value})}>
                <option value="solo">solo</option>
                <option value="duo">duo</option>
                <option value="squad">squad</option>
              </select>
              <input type="number" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Entry Fee" value={edit.entryFee} onChange={e=>setEdit({...edit,entryFee:e.target.value})} />
              <input type="number" className="bg-zinc-900 border border-zinc-800 rounded px-3 py-3 text-sm" placeholder="Max Teams (max 25)" value={edit.maxTeams} onChange={e=>setEdit({...edit,maxTeams:e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-green-600 rounded py-2 text-sm">Save</button>
              <button type="button" onClick={cancelEdit} className="flex-1 bg-zinc-800 border border-zinc-700 rounded py-2 text-sm">Cancel</button>
            </div>
          </form>
        )}
        <div className="space-y-3 order-1 md:order-3">
          <div className="text-sm font-semibold">All Tournaments</div>
          <div className="space-y-2">
            {list.map(t=> (
              <div key={t._id} className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-zinc-400">{t.mode} · {t.type} · ₹{t.entryFee}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/owner/t/${t._id}/participants`} className="text-xs text-indigo-400">Participants →</Link>
                    <button onClick={()=>startEdit(t)} className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700">Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamDetails(){
  const { registrationId } = useParams();
  const nav = useNavigate();
  const [mine,setMine]=useState([]);
  useEffect(()=>{ apiFetch('/api/registrations/mine').then(setMine).catch(()=>{}); },[]);
  const reg = mine.find(r=> r._id===registrationId);
  if (!reg) return <div className="min-h-screen"><TopNav /><div className="p-4 text-sm text-zinc-300 max-w-5xl mx-auto">Not found in your registrations.</div></div>;
  const t = reg.tournamentId || {};
  const canSeeRoom = (reg.paymentStatus==='paid');
  const removePlayer = async (email)=>{
    if (!email) return;
    const ok = confirm(`Remove player ${email}?`);
    if (!ok) return;
    await apiFetch(`/api/registrations/${registrationId}/remove-player`, { method:'PATCH', body:{ email } });
    const updated = await apiFetch('/api/registrations/mine');
    setMine(updated);
  };
  const deleteTeam = async ()=>{
    const ok = confirm('Delete this team? This cannot be undone.');
    if (!ok) return;
    await apiFetch(`/api/registrations/${registrationId}`, { method:'DELETE' });
    nav('/my');
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        <div className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
          <div className="font-medium mb-2">Tournament: {t.name}</div>
          <div className="text-xs text-zinc-400">{t.mode} · {t.type} · ₹{t.entryFee}</div>
        </div>
        <div className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
          <div className="font-medium mb-2">Players</div>
          <ul className="space-y-1 text-sm">
            {reg.players.map((p,i)=> (
              <li key={i} className="flex items-center justify-between gap-3">
                <span>{p.name} <span className="text-zinc-500">({p.inGameName})</span></span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${p.paid?'text-green-400':'text-zinc-500'}`}>{p.paid?'Paid':'Unpaid'}</span>
                  {p.email && <button onClick={()=>removePlayer(p.email)} className="text-[11px] px-2 py-1 rounded bg-zinc-800 border border-zinc-700">Remove</button>}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={deleteTeam} className="mt-3 text-xs px-3 py-2 rounded bg-red-600">Delete Team</button>
        </div>
        {canSeeRoom && (t.roomId || t.roomPassword) && (
          <div className="rounded bg-black/40 border border-zinc-800 p-3">
            <div className="text-xs text-zinc-400">Room Credentials</div>
            {t.roomId && <div>Room ID: <span className="font-mono">{t.roomId}</span></div>}
            {t.roomPassword && <div>Password: <span className="font-mono">{t.roomPassword}</span></div>}
          </div>
        )}
      </div>
    </div>
  );
}

function OwnerParticipants(){
  const { tournamentId } = useParams();
  const [teams,setTeams]=useState([]);
  useEffect(()=>{ apiFetch(`/api/registrations/tournament/${tournamentId}`).then(setTeams).catch(()=>{}); },[tournamentId]);
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="p-4 space-y-3 max-w-5xl mx-auto">
        {teams.length===0 && (
          <div className="text-center text-sm text-zinc-400 py-16">No teams registered yet</div>
        )}
        {teams.map(team=> (
          <div key={team._id} className="rounded bg-zinc-900/80 border border-zinc-800 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">{team.teamName}</div>
              <div className="flex items-center gap-2">
                <div className={`text-xs ${team.paymentStatus==='paid'?'text-green-400':'text-zinc-500'}`}>{team.paymentStatus || 'pending'}</div>
                <button onClick={async()=>{ const ok = confirm('Delete this team?'); if(!ok) return; await apiFetch(`/api/registrations/${team._id}`, { method:'DELETE' }); const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`); setTeams(refreshed); }} className="text-[11px] px-2 py-1 rounded bg-red-600">Delete</button>
              </div>
            </div>
            <ul className="mt-2 grid md:grid-cols-2 gap-1 text-xs text-zinc-300">
              {team.players.map((p,i)=> (
                <li key={i} className="flex items-center justify-between">
                  <span>{p.name} ({p.inGameName})</span>
                  <span className={`${p.paid?'text-green-400':'text-zinc-500'}`}>{p.paid?'Paid':'Unpaid'}</span>
                </li>
              ))}
            </ul>
            {team.manualPayment?.submitted && (
              <div className="mt-3 p-2 rounded bg-black/40 border border-zinc-800 text-xs">
                <div className="text-zinc-400">Manual proof: <span className={`ml-1 ${team.manualPayment?.status==='approved'?'text-green-400': team.manualPayment?.status==='rejected'?'text-red-400':'text-yellow-400'}`}>{team.manualPayment?.status}</span></div>
                {team.manualPayment?.amount!=null && <div>Amount: ₹{team.manualPayment.amount}</div>}
                {team.manualPayment?.note && <div className="break-all">Note: {team.manualPayment.note}</div>}
                {team.manualPayment?.proof && <img src={team.manualPayment.proof} alt="Proof" className="mt-2 max-h-48 rounded border border-zinc-700" />}
                {team.manualPayment?.status==='pending' && (
                  <div className="mt-2 flex gap-2">
                    <button onClick={async()=>{ await apiFetch(`/api/payments/manual/${team._id}/approve`, { method:'POST' }); const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`); setTeams(refreshed); }} className="px-3 py-1 rounded bg-green-600">Approve</button>
                    <button onClick={async()=>{ const reason = prompt('Reason (optional)'); await apiFetch(`/api/payments/manual/${team._id}/reject`, { method:'POST', body:{ reason } }); const refreshed = await apiFetch(`/api/registrations/tournament/${tournamentId}`); setTeams(refreshed); }} className="px-3 py-1 rounded bg-red-600">Reject</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Payment pages (top-level)
function PayTeam(){
  const { registrationId } = useParams();
  const [error,setError]=useState('');
  const [amount,setAmount]=useState(null);
  const [upiLink,setUpiLink]=useState('');
  const [order,setOrder]=useState(null);
  const [proof,setProof]=useState('');
  const [note,setNote]=useState('');
  const [subMsg,setSubMsg]=useState('');
  useEffect(()=>{
    (async()=>{
      try{
        const { order, key } = await apiFetch('/api/payments/team-order', { method:'POST', body:{ registrationId } });
        setOrder({ order, key });
        const amt = (order?.amount || 0)/100;
        setAmount(amt);
        const upiIdEnv = import.meta.env.VITE_RECEIVER_UPI_ID;
        if (upiIdEnv) {
          const link = `upi://pay?pa=${encodeURIComponent(upiIdEnv)}&pn=${encodeURIComponent('GAMEX')}&am=${encodeURIComponent(String(amt))}&cu=INR&tn=${encodeURIComponent('Tournament registration '+registrationId)}`;
          setUpiLink(link);
        }
      }catch(e){ setError('Unable to start payment: '+(e?.message||'Error')); }
    })();
  },[registrationId]);
  const upiId = import.meta.env.VITE_RECEIVER_UPI_ID;
  const payRazorpay = async ()=>{
    if (!order) return;
    const { order: ord, key } = order;
    await openCheckout({ key, order: ord, notes:{ registrationId, scope:'team' }, handler: async (resp)=>{
      await apiFetch('/api/payments/verify', { method:'POST', body:{ ...resp, registrationId, scope:'team' }});
      window.location.href = '/my';
    }});
  };
  const onFile = async (e)=>{
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ()=> setProof(String(reader.result||''));
    reader.readAsDataURL(file);
  };
  const submitProof = async ()=>{
    try{
      await apiFetch('/api/payments/manual-proof', { method:'POST', body:{ registrationId, amount, note, proof } });
      setSubMsg('Submitted for review');
    }catch(err){ setSubMsg(err.message); }
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-md mx-auto p-4 space-y-3">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {amount!=null && <div className="text-xs text-zinc-400">Amount: ₹{amount}</div>}
        <div className="flex gap-2">
          {upiLink && <a href={upiLink} className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-sm">Pay by UPI</a>}
          <button onClick={payRazorpay} className="px-3 py-2 rounded bg-indigo-600 text-sm">Pay by Card/Wallet</button>
        </div>
        {upiId && (
          <div className="mt-4 rounded bg-black/50 border border-zinc-700 p-3">
            <div className="text-xs text-zinc-400 mb-1">UPI option</div>
            <div className="text-sm">Send to: <span className="font-mono">{upiId}</span></div>
            {upiLink && <a href={upiLink} className="inline-block mt-2 px-3 py-2 rounded bg-indigo-600 text-sm">Pay via UPI app</a>}
            <img src={upiQr} alt="UPI QR" className="mt-2 w-48 h-48 object-contain" />
          </div>
        )}
        <div className="mt-4 rounded bg-zinc-900/70 border border-zinc-800 p-3">
          <div className="text-xs text-zinc-400 mb-2">Confirm payment (upload screenshot)</div>
          <input type="file" accept="image/*" onChange={onFile} className="text-xs"/>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Note / UTR (optional)" className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs"/>
          <button onClick={submitProof} disabled={!proof} className="mt-2 px-3 py-2 rounded bg-green-600 text-sm disabled:opacity-50">Submit for approval</button>
          {subMsg && <div className="mt-2 text-xs text-zinc-400">{subMsg}</div>}
        </div>
      </div>
    </div>
  );
}

function PayPlayer(){
  const { registrationId } = useParams();
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [error,setError]=useState('');
  const [amount,setAmount]=useState(null);
  const [upiLink,setUpiLink]=useState('');
  const [order,setOrder]=useState(null);
  const [proof,setProof]=useState('');
  const [note,setNote]=useState('');
  const [subMsg,setSubMsg]=useState('');
  useEffect(()=>{
    (async()=>{
      try{
        const { order, key } = await apiFetch('/api/payments/player-order', { method:'POST', body:{ registrationId } });
        setOrder({ order, key });
        const amt = (order?.amount || 0)/100;
        setAmount(amt);
        const upiIdEnv = import.meta.env.VITE_RECEIVER_UPI_ID;
        if (upiIdEnv) {
          const link = `upi://pay?pa=${encodeURIComponent(upiIdEnv)}&pn=${encodeURIComponent('GAMEX')}&am=${encodeURIComponent(String(amt))}&cu=INR&tn=${encodeURIComponent('Player registration '+registrationId)}`;
          setUpiLink(link);
        }
      }catch(e){ setError('Unable to start payment: '+(e?.message||'Error')); }
    })();
  },[registrationId,email]);
  const upiId = import.meta.env.VITE_RECEIVER_UPI_ID;
  const payRazorpay = async ()=>{
    if (!order) return;
    const { order: ord, key } = order;
    await openCheckout({ key, order: ord, notes:{ registrationId, scope:'player', playerEmail: email }, prefill:{ email }, handler: async (resp)=>{
      await apiFetch('/api/payments/verify', { method:'POST', body:{ ...resp, registrationId, scope:'player', playerEmail: email }});
      window.location.href = `/team/${registrationId}`;
    }});
  };
  const onFile = async (e)=>{
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ()=> setProof(String(reader.result||''));
    reader.readAsDataURL(file);
  };
  const submitProof = async ()=>{
    try{
      await apiFetch('/api/payments/manual-proof', { method:'POST', body:{ registrationId, amount, note, proof } });
      setSubMsg('Submitted for review');
    }catch(err){ setSubMsg(err.message); }
  };
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-md mx-auto p-4 space-y-3">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {amount!=null && <div className="text-xs text-zinc-400">Amount: ₹{amount}</div>}
        <div className="flex gap-2">
          {upiLink && <a href={upiLink} className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-sm">Pay by UPI</a>}
          <button onClick={payRazorpay} className="px-3 py-2 rounded bg-indigo-600 text-sm">Pay by Card/Wallet</button>
        </div>
        {upiId && (
          <div className="mt-4 rounded bg-black/50 border border-zinc-700 p-3">
            <div className="text-xs text-zinc-400 mb-1">UPI option</div>
            <div className="text-sm">Send to: <span className="font-mono">{upiId}</span></div>
            {upiLink && <a href={upiLink} className="inline-block mt-2 px-3 py-2 rounded bg-indigo-600 text-sm">Pay via UPI app</a>}
            <img src={upiQr} alt="UPI QR" className="mt-2 w-48 h-48 object-contain" />
          </div>
        )}
        <div className="mt-4 rounded bg-zinc-900/70 border border-zinc-800 p-3">
          <div className="text-xs text-zinc-400 mb-2">Confirm payment (upload screenshot)</div>
          <input type="file" accept="image/*" onChange={onFile} className="text-xs"/>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Note / UTR (optional)" className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs"/>
          <button onClick={submitProof} disabled={!proof} className="mt-2 px-3 py-2 rounded bg-green-600 text-sm disabled:opacity-50">Submit for approval</button>
          {subMsg && <div className="mt-2 text-xs text-zinc-400">{subMsg}</div>}
        </div>
      </div>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/tournaments" element={<Tournaments/>} />
        <Route path="/t/:id" element={<TournamentDetail/>} />
        <Route path="/register/:tournamentId" element={<RegisterTeam/>} />
        <Route path="/join/:teamCode" element={<JoinTeam/>} />
        <Route path="/team/:registrationId" element={<TeamDetails/>} />
        <Route path="/pay/team/:registrationId" element={<PayTeam/>} />
        <Route path="/pay/player/:registrationId" element={<PayPlayer/>} />
        <Route path="/owner/t/:tournamentId/participants" element={<OwnerParticipants/>} />
        <Route path="/my" element={<MyRegs/>} />
        <Route path="/owner" element={<Owner/>} />
        <Route path="/user" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}
