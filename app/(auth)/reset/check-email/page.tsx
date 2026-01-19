'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function ResetCheckEmailPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-200 flex flex-col">
      {/* Header */}
      <header className="h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center justify-center">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#07b6d5] to-[#0369a1] flex items-center justify-center text-white shadow-lg shadow-[#07b6d5]/40 transition-transform group-hover:scale-105">
              <span className="text-xl font-semibold">🛡️</span>
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#050816]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black tracking-wider uppercase text-white">ShieldCSP</span>
            <span className="text-[10px] font-bold text-[#07b6d5] tracking-widest uppercase mt-0.5">
              Platform
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <Link href="/" className="hover:text-white transition-colors">
            Status
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-10">
        <div className="bg-white/5/10 glass-card w-full max-w-md rounded-2xl p-8 md:p-12 text-center relative overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#07b6d5]/50 to-transparent" />

          <div className="mb-8 inline-flex items-center justify-center h-20 w-20 rounded-full bg-[#07b6d5]/10 border border-[#07b6d5]/20 text-[#07b6d5] shadow-[0_0_25px_rgba(7,182,213,0.4)]">
            <Mail className="h-10 w-10" />
          </div>

          <h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">Check your email</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 px-2">
            We have sent a password reset link to your email address. Please click the link in the email to continue.
          </p>

          <div className="space-y-4">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              Open Gmail
            </button>
            <div className="pt-2">
              <p className="text-xs text-slate-500">
                Didn&apos;t receive the email?
                <button className="text-[#07b6d5] hover:text-cyan-400 font-bold ml-1 transition-colors">
                  Resend email
                </button>
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              <span className="text-sm">←</span>
              Back to Sign In
            </Link>
          </div>
        </div>

        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#07b6d5]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          © 2024 ShieldCSP Cybersecurity Inc. • Secure Access Node:{' '}
          <span className="text-emerald-500/80">Active</span>
        </p>
      </footer>
    </div>
  );
}
