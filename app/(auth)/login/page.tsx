'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Shield, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in with NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        // Provide user-friendly error messages
        const errorMessage = result?.error || 'Invalid email or password';
        if (errorMessage.includes('database') || errorMessage.includes('connection')) {
          setError('Service temporarily unavailable. Please try again in a moment.');
        } else {
          setError('Invalid email or password. Please check your credentials and try again.');
        }
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2023] flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#162a2e] rounded-2xl border border-[#224349] p-8 shadow-2xl">
          {/* Shield Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-[#07b6d5] flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Sign In to ShieldCSP</h1>
            <p className="text-gray-400 text-sm">Elite platform for CSP & XSS monitoring</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-gray-400 uppercase tracking-wider">
                WORK EMAIL
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs text-gray-400 uppercase tracking-wider">
                  PASSWORD
                </Label>
                <Link 
                  href="/reset/check-email" 
                  className="text-xs text-[#14b8a6] hover:text-[#0d9488] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                  required
                />
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#14b8a6] text-white h-12 text-base font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In to Shield'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Separator */}
          <div className="relative my-6">
            <Separator className="bg-white/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-[#1a1f3a] px-4 text-xs text-gray-400 uppercase tracking-wider">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 h-12"
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 h-12"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </div>

          {/* Create Account Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#14b8a6] hover:text-[#0d9488] transition-colors font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badges Footer */}
        <div className="mt-8 flex items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Open Source</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="text-xs">Security Focused</span>
          </div>
        </div>
      </div>
    </div>
  );
}
