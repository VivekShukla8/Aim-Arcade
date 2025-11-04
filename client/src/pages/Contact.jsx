import TopNav from '../components/TopNav.jsx';
import { useState } from 'react';

export default function Contact(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const mailto = () => {
    const to = 'vivekshukla8823@gmail.com';
    const subject = encodeURIComponent(`Contact from ${name||'Guest'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const whatsapp = () => {
    const to = '+919424938202';
    const text = encodeURIComponent(`Contact from ${name||'Guest'}: ${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `https://wa.me/${to}?text=${text}`;
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
