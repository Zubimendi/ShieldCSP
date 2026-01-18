'use client';

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div className="space-y-8">
          {/* New Feature Badge */}
          <Badge className="bg-[#14b8a6]/20 text-[#14b8a6] border-[#14b8a6]/30 hover:bg-[#14b8a6]/30">
            • NEW: AI POLICY GENERATOR V2.0
          </Badge>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Stop XSS Attacks</span>
              <br />
              <span className="text-[#14b8a6]">Before They</span>{' '}
              <span className="text-[#a855f7]">Start</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Automated Content Security Policy (CSP) management for modern web applications. 
              Scan, monitor, and fix vulnerabilities in real-time with enterprise-grade precision.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button 
              asChild
              size="lg"
              className="bg-[#14b8a6] hover:bg-[#0d9488] text-white text-lg px-8"
            >
              <Link href="/dashboard/scanner">
                Scan Your Site Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
            >
              <Link href="/dashboard">
                <Play className="mr-2 h-5 w-5" />
                View Demo
              </Link>
            </Button>
          </div>

          {/* Trust Indicator */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-2">
              <Avatar className="h-8 w-8 border-2 border-[#0a0e27]">
                <AvatarFallback className="bg-[#14b8a6] text-white text-xs">JD</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-[#0a0e27]">
                <AvatarFallback className="bg-[#a855f7] text-white text-xs">SM</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-[#0a0e27]">
                <AvatarFallback className="bg-[#10b981] text-white text-xs">AL</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm text-gray-400">
              Trusted by <span className="text-white font-medium">5,000+</span> security engineers
            </p>
          </div>
        </div>

        {/* Right Side - Code Snippet */}
        <div className="relative">
          <div className="bg-[#1a1f3a] rounded-lg border border-white/10 p-6 font-mono text-sm">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 ml-4">csp-analyzer --live</span>
            </div>

            {/* Terminal Content */}
            <div className="space-y-2">
              <div className="text-gray-400">
                <span className="text-[#14b8a6]">01</span> analyze https://app.secure.io
              </div>
              <div className="text-gray-400">
                <span className="text-[#14b8a6]">02</span> [info] Fetching current headers...
              </div>
              <div className="text-yellow-400">
                <span className="text-[#14b8a6]">03</span> [warn] Missing 'script-src' directive
              </div>
              <div className="text-gray-400">
                <span className="text-[#14b8a6]">04</span> [info] AI generating optimal policy...
              </div>
              <div className="text-green-400">
                <span className="text-[#14b8a6]">05</span> ✔ Success: Policy hardened
              </div>
            </div>

            {/* CSP Policy Box */}
            <div className="mt-6 p-4 bg-[#a855f7]/20 border border-[#a855f7]/30 rounded-lg">
              <div className="text-xs text-gray-300 mb-2">Content-Security-Policy:</div>
              <code className="text-xs text-[#a855f7] break-all">
                default-src 'self'; script-src 'self' https://trusted.cdn.com; object-src 'none'; upgrade-insecure-requests;
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
