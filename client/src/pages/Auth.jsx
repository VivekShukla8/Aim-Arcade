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
        {/* Left Side - Gaming Background */}
        <div className="auth-left hidden md:block relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Content Overlay */}
          <div className="relative h-full flex flex-col justify-center px-12 lg:px-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-bold text-orange-400 uppercase tracking-wider backdrop-blur-sm">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Join the Arena
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  Compete at the
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
                  Highest Level
                </span>
              </h1>
              
              <p className="text-lg text-zinc-300 max-w-md leading-relaxed">
                Join thousands of players, register your team, and compete in the most exciting esports tournaments.
              </p>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">15K+</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">200+</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Tournaments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">$500K+</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Prize Pool</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-black text-zinc-200 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background effects for mobile */}
          <div className="absolute inset-0 md:hidden">
            <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="w-full max-w-sm space-y-6 relative z-10">
            {/* Header */}
            <div className="text-center md:text-left">
              <div className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                {mode === 'login' ? 'Welcome Back!' : 'Join AimArcade'}
              </div>
              <div className="text-sm text-zinc-400">
                {mode === 'login' ? 'Sign in to continue competing' : 'Create your account and start competing today'}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Google Sign In */}
            <a 
              href={`${API_BASE_URL}/api/auth/google`} 
              className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold bg-white text-black hover:bg-zinc-100 transition-all border-2 border-transparent hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </a>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-zinc-500">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">
              {mode==='signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</label>
                  <input 
                    value={name} 
                    onChange={e=>setName(e.target.value)} 
                    placeholder="Enter your name" 
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all backdrop-blur-sm"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</label>
                <input 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  type="email"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  placeholder="Enter your password" 
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all backdrop-blur-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all hover:shadow-xl hover:shadow-orange-500/30 transform hover:scale-[1.02]"
              >
                {mode==='login'? '🎮 Sign In' : '🚀 Create Account'}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center">
              <button 
                onClick={toggle} 
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {mode==='login'? 
                  <span>Don't have an account? <span className="text-orange-500 font-semibold">Sign up</span></span> : 
                  <span>Already have an account? <span className="text-orange-500 font-semibold">Sign in</span></span>
                }
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-zinc-600 leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}