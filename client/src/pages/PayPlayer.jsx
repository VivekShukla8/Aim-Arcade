import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TopNav from '../components/TopNav.jsx';
import { apiFetch } from '../api/client';
import { openCheckout } from '../utils/razorpay';
import upiQr from '../assets/upi-qr.png';

export default function PayPlayer(){
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
        const payeeName = import.meta.env.VITE_PAYEE_NAME || 'AimArcade';
        const siteUrl = window.location.origin;
        if (upiIdEnv) {
          const noteText = `Player ${registrationId}`.slice(0, 40);
          const tid = (order && order.order && order.order.id) ? order.order.id : `AA-${registrationId}`;
          const link = `upi://pay?pa=${encodeURIComponent(upiIdEnv)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amt.toFixed(2))}&cu=INR&tn=${encodeURIComponent(noteText)}&tr=${encodeURIComponent('AA-'+registrationId)}&tid=${encodeURIComponent(tid)}&url=${encodeURIComponent(siteUrl)}`;
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
        <div className="text-xs text-zinc-400">Facing problems using the app? Pay using QR or UPI below.</div>
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
