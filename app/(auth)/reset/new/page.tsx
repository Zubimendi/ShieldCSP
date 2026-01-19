'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export default function SetNewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const score = Math.min(100, Math.floor((password.length / 16) * 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 12) {
      setError('Password must be at least 12 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    router.push('/reset/success');
  };

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
        <div className="flex items-center gap-6 text-xs">
          <span className="text-slate-500">
            Status:{' '}
            <span className="text-emerald-400 font-semibold">
              Secure
            </span>
          </span>
          <div className="h-8 w-8 rounded-full bg-amber-200" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-xl">
          <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent opacity-10 pointer-events-none" />
          <form
            onSubmit={handleSubmit}
            className="relative bg-[#041c21]/95 border border-white/10 rounded-[28px] px-10 py-10 shadow-2xl shadow-black/50 max-w-xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="h-12 w-12 rounded-full bg-[#07b6d5]/10 border border-[#07b6d5]/30 flex items-center justify-center text-[#07b6d5]">
                <span className="text-xl">↻</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Set New Password</h1>
            <p className="text-xs text-slate-400 text-center mb-8 max-w-sm mx-auto">
              Ensure your account security for CSP monitoring and XSS prevention. Use a complex passphrase.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* New Password */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-2 text-slate-300">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full bg-[#03181e] border border-white/10 px-5 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-[#07b6d5] focus:border-transparent"
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Strength meter */}
            <div className="mb-6">
              <div className="flex justify-between text-[10px] text-slate-400 mb-2">
                <span>Strength: <span className="text-emerald-400 font-semibold">Strong</span></span>
                <span>{score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                <div className="h-full bg-[#07b6d5]" style={{ width: `${Math.max(25, score)}%` }} />
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  12+ characters
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Upper &amp; Lower
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Numbers
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Special symbol
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-8">
              <label className="block text-xs font-semibold mb-2 text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-full bg-[#03181e] border border-white/10 px-5 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-[#07b6d5] focus:border-transparent"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
                >
                  <Lock className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full rounded-full bg-[#07b6d5] hover:bg-[#07b6d5]/90 text-slate-950 font-semibold py-3.5 text-sm shadow-lg shadow-[#07b6d5]/30 flex items-center justify-center gap-2"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full text-xs text-slate-500 hover:text-slate-200"
              >
                Cancel and return to login
              </button>
            </div>
          </form>

          {/* Encryption banner */}
          <div className="mt-6 max-w-xl mx-auto flex justify-end">
            <div className="bg-[#021114] border border-emerald-500/40 rounded-2xl px-4 py-3 flex items-center gap-3 text-xs text-slate-300 shadow-lg shadow-emerald-500/20">
              <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-emerald-300 mb-0.5">End-to-End Encryption Active</p>
                <p className="text-[10px] text-slate-400">
                  All password data is hashed locally via SHA-256 before transmission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
