'use client';

import Link from 'next/link';
import { Shield, Star, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b border-white/10 bg-[#0a0e27]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#14b8a6] flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">ShieldCSP</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm hover:text-[#14b8a6] transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm hover:text-[#14b8a6] transition-colors">
              Pricing
            </Link>
            <Link href="#docs" className="text-sm hover:text-[#14b8a6] transition-colors">
              Docs
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* GitHub Stars */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">12.4k</span>
            </div>

            {/* Buttons */}
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button className="bg-[#14b8a6] hover:bg-[#0d9488] text-white" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
