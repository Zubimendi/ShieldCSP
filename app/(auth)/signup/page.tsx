'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Shield, User, Mail, Lock, Eye, EyeOff, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password.length < 12) {
      setError('Password must be at least 12 characters long');
      setLoading(false);
      return;
    }

    try {
      // Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          password: formData.password,
        }),
      });

      if (response.ok) {
        // Auto sign in after signup
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/dashboard');
          router.refresh();
        } else {
          // Account created but sign in failed - redirect to login
          router.push('/login?message=Account created. Please sign in.');
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create account');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center">
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        {/* Left hero */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-slate-950">
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -top-[10%] -right-[10%] w-96 h-96 bg-[#07b6d5]/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-[10%] -left-[10%] w-96 h-96 bg-[#6366f1]/20 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="h-10 w-10 bg-[#07b6d5] rounded flex items-center justify-center text-white shadow-lg shadow-[#07b6d5]/20">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight">ShieldCSP</span>
            </div>

            <div className="max-w-md">
              <h2 className="text-5xl font-black leading-tight mb-8">
                Bulletproof your{' '}
                <span className="bg-gradient-to-br from-[#07b6d5] to-[#6366f1] bg-clip-text text-transparent">
                  Content Security Policy.
                </span>
              </h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <TrendingUp className="h-5 w-5 text-[#07b6d5]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Real-time CSP Monitoring</h4>
                    <p className="text-slate-400 text-sm">
                      Detect and block XSS attempts before they reach your users with automated policy generation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Shield className="h-5 w-5 text-[#6366f1]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">XSS Prevention at Scale</h4>
                    <p className="text-slate-400 text-sm">
                      Enterprise-grade protection for thousands of domains with zero performance overhead.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm">
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="italic text-slate-200 mb-4 text-sm leading-relaxed">
                "ShieldCSP transformed our security posture. We went from manually managing policies to a fully
                automated, breach-proof system in weeks."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                  JD
                </div>
                <div>
                  <p className="text-xs font-bold">Jason Draxler</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">CISO at FinTech Global</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-24 bg-[#0f172a]">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-black mb-2">Create Your Account</h1>
              <p className="text-slate-400">Join 5,000+ security teams protecting their web infrastructure.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <Label
                  htmlFor="fullName"
                  className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Alex Rivera"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#1e293b] border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#07b6d5] focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Work Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1e293b] border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#07b6d5] focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#1e293b] border-slate-700 rounded-xl py-3 pl-11 pr-12 text-sm focus:ring-2 focus:ring-[#07b6d5] focus:border-transparent outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Minimum 12 characters, including symbols.</p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#07b6d5] hover:bg-[#07b6d5]/90 text-slate-950 font-black py-4 rounded-xl shadow-lg shadow-[#07b6d5]/20 flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating Account...' : 'Start Your Free Trial'}
                  <span className="text-sm">→</span>
                </Button>
              </div>
            </form>

            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="h-px flex-1 bg-slate-800" />
              <span>Securely certified by</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 opacity-50 hover:opacity-100 transition-all">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold">
                  OW
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">OWASP Member</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold">
                  G
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold">
                  S2
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">SOC2 Type II</span>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-[#07b6d5] font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
