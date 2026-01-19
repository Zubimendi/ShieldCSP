'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, User, Mail, Lock, Eye, EyeOff, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

    // Basic validation
    if (formData.password.length < 12) {
      setError('Password must be at least 12 characters long');
      setLoading(false);
      return;
    }

    // For now, just set auth and redirect (will implement real signup later)
    document.cookie = 'authenticated=true; path=/; max-age=86400';
    document.cookie = `userEmail=${formData.email}; path=/; max-age=86400`;
    document.cookie = `userName=${formData.fullName}; path=/; max-age=86400`;
    
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0f2023] flex text-white">
      {/* Left Section - Product Information */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0f2023] to-[#162a2e]">
        <div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="h-10 w-10 rounded-full bg-[#07b6d5] flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ShieldCSP</span>
          </Link>

          {/* Headline */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold leading-tight mb-4">
              <span className="text-white">Bulletproof your</span>
              <br />
              <span className="text-[#07b6d5]">Content Security</span>
              <br />
              <span className="text-[#3b82f6]">Policy.</span>
            </h1>
          </div>

          {/* Features */}
          <div className="space-y-8 mb-12">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#14b8a6]/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-[#14b8a6]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Real-time CSP Monitoring
                </h3>
                <p className="text-gray-400">
                  Detect and block XSS attempts before they reach your users with automated policy generation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#14b8a6]/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-[#14b8a6]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  XSS Prevention at Scale
                </h3>
                <p className="text-gray-400">
                  Enterprise-grade protection for thousands of domains with zero performance overhead.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-[#1a1f3a] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-300 mb-4 italic">
            "ShieldCSP transformed our security posture. We went from manually managing policies to a fully automated, breach-proof system in weeks."
          </p>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-gray-700">
              <AvatarFallback className="text-white">JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium">Jason Draxler</p>
              <p className="text-sm text-gray-400">CISO AT FINTECH GLOBAL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Sign-up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Headline */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
            <p className="text-gray-400">
              Join 5,000+ security teams protecting their web infrastructure.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs text-gray-400 uppercase tracking-wider">
                FULL NAME
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Alex Rivera"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                  required
                />
              </div>
            </div>

            {/* Work Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-gray-400 uppercase tracking-wider">
                WORK EMAIL
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-gray-400 uppercase tracking-wider">
                PASSWORD
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Minimum 12 characters, including symbols.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-white h-12 text-base font-semibold"
            >
              {loading ? 'Creating Account...' : 'Start Your Free Trial'}
              <span className="ml-2">→</span>
            </Button>
          </form>

          {/* Separator */}
          <div className="my-6">
            <Separator className="bg-white/10" />
          </div>

          {/* Certifications */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-400 mb-4">Securely certified by</p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">OW</span>
                </div>
                <span className="text-xs text-gray-400">OWASP MEMBER</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#14b8a6]" />
                </div>
                <span className="text-xs text-gray-400">GDPR COMPLIANT</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white leading-tight">SOC2<br />TYPE II</span>
                </div>
                <span className="text-xs text-gray-400">SOC2 TYPE II</span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-[#14b8a6] hover:text-[#0d9488] transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
