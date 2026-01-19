'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isFeaturesPage = pathname === '/features';

  return (
    <header className="border-b border-white/5 bg-[#0b1416]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="logo-container size-10 bg-gradient-to-br from-[#07b6d5] to-cyan-600 rounded-xl flex items-center justify-center text-[#0b1416] shadow-[0_0_20px_rgba(7,182,213,0.3)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(7,182,213,0.5)] group-hover:scale-105">
            <span className="material-symbols-outlined font-bold !text-[26px]">shield_lock</span>
          </div>
          <div className="flex flex-col -gap-1">
            <h1 className="text-xl font-black tracking-tighter leading-none text-white">ShieldCSP</h1>
            <span className="text-[9px] font-bold text-[#07b6d5] uppercase tracking-[0.2em] leading-none mt-1">
              {isFeaturesPage ? 'Cybersecurity' : 'Enterprise'}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 border-l border-white/10 ml-2 pl-10">
          <Link href="/dashboard" className="text-sm font-semibold opacity-60 hover:opacity-100 transition-all text-white">
            Dashboard
          </Link>
          <Link 
            href="/features" 
            className={`text-sm font-semibold transition-all ${
              isFeaturesPage ? 'opacity-100 text-[#07b6d5]' : 'opacity-60 hover:opacity-100 text-white'
            }`}
          >
            Features
          </Link>
          <Link href="/docs" className="text-sm font-semibold opacity-60 hover:opacity-100 transition-all text-white">
            Docs
          </Link>
          <Link href="#" className="text-sm font-semibold opacity-60 hover:opacity-100 transition-all text-white">
            Enterprise
          </Link>
        </nav>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <button 
          className="text-sm font-bold px-4 py-2 hover:text-[#07b6d5] transition-colors text-white"
          onClick={() => window.location.href = '/login'}
        >
          Sign In
        </button>
        <button 
          className="bg-[#07b6d5] text-[#0b1416] px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#07b6d5]/20 hover:scale-105 transition-transform"
          onClick={() => window.location.href = '/signup'}
        >
          Get Started
        </button>
      </div>
    </header>
  );
}
