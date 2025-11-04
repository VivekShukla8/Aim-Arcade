import { API_BASE_URL } from '../api/client';

export const loadRazorpay = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve(window.Razorpay);
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = () => resolve(window.Razorpay);
  s.onerror = reject;
  document.body.appendChild(s);
});

export const openCheckout = async ({ key, order, prefill, notes, handler }) => {
  const Razorpay = await loadRazorpay();
  const rzp = new Razorpay({
    key,
    order_id: order.id,
    name: 'Esports Tournaments',
    theme: { color: '#111827' },
    prefill,
    notes,
    handler,
  });
  rzp.open();
};
