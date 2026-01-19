'use client';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-xs font-semibold text-emerald-300 uppercase tracking-widest">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          All systems operational
        </div>
        <h1 className="text-3xl font-black mb-2">ShieldCSP Status</h1>
        <p className="text-sm text-slate-400 mb-8">
          All core services (Dashboard, Scanner, Violations, Policies, and Lab) are running normally. No incidents
          reported in the last 24 hours.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-left">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-slate-400 mb-1">Scanner</p>
            <p className="text-emerald-400 font-semibold">Healthy</p>
            <p className="text-[10px] text-slate-500 mt-2">Last check: &lt; 1 min ago</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-slate-400 mb-1">Violations Ingest</p>
            <p className="text-emerald-400 font-semibold">Healthy</p>
            <p className="text-[10px] text-slate-500 mt-2">Processing CSP reports in real time</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-slate-400 mb-1">Policy API</p>
            <p className="text-emerald-400 font-semibold">Healthy</p>
            <p className="text-[10px] text-slate-500 mt-2">99.99% uptime (rolling 30 days)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

