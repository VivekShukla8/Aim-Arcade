import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch, setToken, API_BASE_URL } from '../api/client';

export default function Auth(){
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
