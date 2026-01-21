'use client';

import Link from 'next/link';

export function Pricing() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-24">
      <div className="flex flex-col gap-4 mb-16 items-center text-center">
        <h2 className="text-white text-4xl lg:text-5xl font-black tracking-tight">Simple, Developer-First Pricing</h2>
        <p className="text-slate-400 text-lg">Choose the plan that fits your security needs, from side projects to enterprise clusters.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Community Plan */}
        <div className="glass-card p-10 rounded-2xl flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Community</h3>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black tracking-tight">$0</span>
              <span className="text-slate-500 text-lg font-medium">/mo</span>
            </div>
          </div>
          <Link
            href="/signup"
            className="w-full py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-center"
          >
            Get Started
          </Link>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3 text-sm text-slate-300">
              <span className="material-symbols-outlined text-[#07b6d5] text-[20px]">check_circle</span>
              1 Domain Monitoring
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-300">
              <span className="material-symbols-outlined text-[#07b6d5] text-[20px]">check_circle</span>
              Basic CSP Scanning
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-300">
              <span className="material-symbols-outlined text-[#07b6d5] text-[20px]">check_circle</span>
              7 Days Data Retention
            </li>
              <li className="flex items-center gap-3 text-sm text-slate-500 line-through">
                AI Policy Generation (Coming Soon)
              </li>
          </ul>
        </div>

        {/* Professional Plan */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-[#07b6d5] to-[#6366F1] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative glass-card p-10 rounded-2xl flex flex-col gap-8 border-[#07b6d5]/40 bg-[#0A0F1E]/80">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="text-[#07b6d5] text-sm font-bold uppercase tracking-widest">Professional</h3>
                <span className="bg-[#07b6d5]/20 text-[#07b6d5] text-[10px] font-black px-2 py-1 rounded tracking-tighter uppercase">Popular</span>
              </div>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-5xl font-black tracking-tight">$49</span>
                <span className="text-slate-500 text-lg font-medium">/mo</span>
              </div>
            </div>
            <Link
              href="/signup"
              className="w-full py-4 rounded-xl bg-[#07b6d5] text-[#0A0F1E] font-black transition-all hover:scale-[1.02] shadow-xl shadow-[#07b6d5]/20 text-center"
            >
              Go Pro
            </Link>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#07b6d5] text-[20px] fill-1">check_circle</span>
                10 Domains Monitoring
              </li>
              <li className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#07b6d5] text-[20px] fill-1">schedule</span>
                AI Policy Generation (Next Version)
              </li>
              <li className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#07b6d5] text-[20px] fill-1">check_circle</span>
                30 Days Data Retention
              </li>
              <li className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="material-symbols-outlined text-[#07b6d5] text-[20px] fill-1">check_circle</span>
                API & Webhook Access
              </li>
            </ul>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="glass-card p-10 rounded-2xl flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enterprise</h3>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black tracking-tight">$199</span>
              <span className="text-slate-500 text-lg font-medium">/mo</span>
            </div>
          </div>
          <Link
            href="/login"
            className="w-full py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-center"
          >
            Contact Sales
          </Link>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3 text-sm text-slate-300">
              <span className="material-symbols-outlined text-[#07b6d5] text-[20px]">check_circle</span>
              Unlimited Domains
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-300">
              <span className="material-symbols-outlined text-[#07b6d5] text-[20px]">check_circle</span>
              Custom Data Retention
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-300">
              <span className="material-symbols-outlined text-[#07b6d5] text-[20px]">check_circle</span>
              SAML SSO Integration
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-300">
              <span className="material-symbols-outlined text-[#07b6d5] text-[20px]">check_circle</span>
              Dedicated Security Engineer
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
