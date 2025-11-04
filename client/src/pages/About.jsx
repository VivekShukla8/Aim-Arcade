import TopNav from '../components/TopNav.jsx';

export default function About(){
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
