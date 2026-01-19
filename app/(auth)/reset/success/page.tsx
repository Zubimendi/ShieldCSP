'use client';

import Link from 'next/link';
import { Shield, CheckCircle2 } from 'lucide-react';

export default function ResetSuccessPage() {
  return (
    <div className="min-h-screen bg-[#02151a] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#07b6d5] to-[#0369a1] flex items-center justify-center text-white shadow-lg shadow-[#07b6d5]/40">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-sm font-black tracking-tight">ShieldCSP</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-amber-200" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-xl">
          <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent opacity-10 pointer-events-none" />
          <div className="relative bg-[#041c21]/95 border border-white/10 rounded-[28px] px-10 py-10 shadow-2xl shadow-black/50 max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3">Password updated successfully</h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
              Your account security has been updated. You can now use your new password to sign in to the ShieldCSP
              platform.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full max-w-xs rounded-full bg-[#07b6d5] hover:bg-[#07b6d5]/90 text-slate-950 font-semibold py-3.5 text-sm shadow-lg shadow-[#07b6d5]/30"
            >
              Back to Sign In
            </Link>
            <p className="mt-6 text-xs text-slate-500">
              Didn&apos;t perform this action?{' '}
              <Link href="/docs" className="text-[#07b6d5] hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 flex flex-col items-center gap-4 text-[11px] text-slate-500">
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/docs" className="hover:text-[#07b6d5] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/docs" className="hover:text-[#07b6d5] transition-colors">
            Terms of Service
          </Link>
          <Link href="/docs" className="hover:text-[#07b6d5] transition-colors">
            Security Documentation
          </Link>
        </div>
        <p className="text-[10px] text-slate-600 mt-2">
          © 2024 ShieldCSP Cybersecurity Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
