import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch, setToken, getToken, clearToken, API_BASE_URL } from '../api/client';

export default function Login(){
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
