const API_BASE = import.meta.env.VITE_API_URL || 'http://aim-arcade.vercel.app';

export const apiFetch = async (path, { method = 'GET', body, token } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  const authToken = token || localStorage.getItem('token');
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // send cookies for Google-auth users
  });
  if (!res.ok) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await res.json().catch(()=>({}));
      const msg = data.message || res.statusText || `HTTP ${res.status}`;
      throw new Error(msg);
    } else {
      const msg = await res.text();
      throw new Error(msg || `HTTP ${res.status}`);
    }
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
};

export const setToken = (t) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');
export const getToken = () => localStorage.getItem('token');
export const API_BASE_URL = API_BASE;
