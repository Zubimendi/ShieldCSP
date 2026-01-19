'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0A0F1E]/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="size-8 bg-[#07b6d5] rounded-lg flex items-center justify-center text-[#0A0F1E]">
            <Shield className="h-5 w-5 font-bold" />
          </div>
          <h2 className="text-white text-xl font-black tracking-tight">ShieldCSP</h2>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-[#07b6d5] transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-400 hover:text-[#07b6d5] transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="text-sm font-medium text-slate-400 hover:text-[#07b6d5] transition-colors">
            Docs
          </Link>
          <Link href="#" className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span className="text-xs font-bold text-white">12.4k</span>
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:block px-4 py-2 text-sm font-bold text-white hover:text-[#07b6d5] transition-colors" onClick={() => window.location.href = '/login'}>
            Login
          </button>
          <button 
            className="bg-[#07b6d5] hover:bg-[#07b6d5]/90 text-[#0A0F1E] px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#07b6d5]/20"
            onClick={() => window.location.href = '/signup'}
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
