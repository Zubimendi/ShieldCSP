'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side - Content */}
        <div className="flex flex-col gap-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#07b6d5]/10 border border-[#07b6d5]/20 px-3 py-1 rounded-full w-fit">
            <span className="flex h-2 w-2 rounded-full bg-[#07b6d5] animate-pulse"></span>
            <span className="text-xs font-bold text-[#07b6d5] tracking-widest uppercase">
              Security Middleware & CSP Scanner
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
            Stop XSS Attacks <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07b6d5] to-[#6366F1]">Before They Start</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-400 max-w-[540px] leading-relaxed">
            Automated Content Security Policy (CSP) management for modern web applications. Scan, monitor, and fix vulnerabilities in real-time with enterprise-grade precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="bg-[#07b6d5] hover:bg-[#07b6d5]/90 text-[#0A0F1E] px-8 py-4 rounded-xl text-base font-bold transition-all shadow-xl shadow-[#07b6d5]/20 flex items-center gap-2"
            >
              Scan Your Site Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-base font-bold transition-all flex items-center gap-2"
            >
              View Demo
            </Link>
          </div>

          {/* Trust Indicator */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              <div className="size-10 rounded-full border-2 border-[#0A0F1E] bg-slate-800 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsVR3vD37Eng3xpHHCnOi4u-tbL9tjogHQAc4U3vaq4wLoXoNL7kGThpYuIxj6urDgazw0gD2Jq7fiyq_lZ1EczJS15jGY0Ftmrj79CXTueRhu4I7N6QNiG6WRNRBsYi9HNXdWyuZ8G4m4aELry1LogLj8qtc1g-RSNVq_quMjNFwrDyDsnCLJ48zVS6Iq-kI2BRU0Npc12VXip6-tg-DMrpSS2leSQ7Z9R_cZnb4SDYCbihM1NgysHnKBgx7W9JciUyxb4qJ3Ugsc')" }}></div>
              <div className="size-10 rounded-full border-2 border-[#0A0F1E] bg-slate-800 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB11xftxbe0_KdIT7fENxtKcoTq4kczUOALOipDBaOu0sghaJuA3VbZvAf_oUkiHH2x6fzUnzUS8-8Ai7SSTbhbN7r-NGKhLewU3neVxpCjZma45xJO3m9JNlDKWIcAt7f_j6VEFPI9luIUuI0UhxXdx1Ds5Xfc54ffGCCBGzlQ4wVlgya6U8rYMCsp-QoSk1zHRwWtWdAuZpEJDwNEf_vbOVkW_tmgZe5TI1-Kjf4lpR29rTEuSTRh5oatCBehiE_A3DUnqnYraCvz')" }}></div>
              <div className="size-10 rounded-full border-2 border-[#0A0F1E] bg-slate-800 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZFok8j3gOtFc69A1N9EttfNvslDLdL1bnmqBx-MdhfI3v6TpeEma6KVWYcegOEtUhIMaBsfBEsX7cVJI9EGxkqcuQI_lkyjnfBqKIMzUO-c54r5nCeVb0EPfVuK8duoxzsPZ027ZWVRCUS0_Ln16UOed8Cyi6FkTpP99Ztsj8s-DTT4Xpl2VpYs1CfsEAYbnei503r4o6R71ugo4PMMucp9BHVoItJAe6x4pGKwAgLVm4UHb6AGvYqm7w9rZ_PTwUXAPZ9UKHh21-')" }}></div>
            </div>
            <p className="text-sm text-slate-500 font-medium">Trusted by 5,000+ security engineers</p>
          </div>
        </div>

        {/* Right Side - Terminal Visual */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#07b6d5]/20 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative glass-card rounded-xl overflow-hidden terminal-glow">
            {/* Terminal Header */}
            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/50"></div>
                <div className="size-3 rounded-full bg-yellow-500/50"></div>
                <div className="size-3 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-[11px] font-mono text-slate-500 tracking-wider">csp-analyzer --live</span>
              <div className="size-3"></div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <div className="flex gap-4 mb-2">
                <span className="text-slate-600">01</span>
                <span className="text-[#07b6d5]">analyze</span>
                <span className="text-white">https://app.secure.io</span>
              </div>
              <div className="flex gap-4 mb-2">
                <span className="text-slate-600">02</span>
                <span className="text-slate-400">[info] Fetching current headers...</span>
              </div>
              <div className="flex gap-4 mb-2">
                <span className="text-slate-600">03</span>
                <span className="text-yellow-400">[warn] Missing 'script-src' directive</span>
              </div>
              <div className="flex gap-4 mb-2">
                <span className="text-slate-600">04</span>
                <span className="text-slate-400">[info] AI generating optimal policy...</span>
              </div>
              <div className="flex gap-4 mb-4">
                <span className="text-slate-600">05</span>
                <span className="text-green-400 font-bold">✔ Success: Policy hardened</span>
              </div>

              {/* CSP Policy Box */}
              <div className="bg-[#07b6d5]/5 p-4 rounded border border-[#07b6d5]/20">
                <p className="text-slate-300 break-all">
                  <span className="text-[#6366F1] font-bold">Content-Security-Policy:</span> default-src 'self'; script-src 'self' https://trusted.cdn.com; object-src 'none'; upgrade-insecure-requests;
                </p>
              </div>

              {/* Cursor */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[#07b6d5] italic">_</span>
                <span className="w-2 h-4 bg-[#07b6d5] animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
