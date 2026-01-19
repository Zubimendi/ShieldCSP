'use client';

import Link from 'next/link';
import { Shield, Bell, User, CheckCircle2, XCircle, Minus, BarChart3, Code2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const featureComparison = [
  {
    feature: 'Number of Domains',
    starter: '1 Domain',
    pro: 'Up to 10',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Scan Frequency',
    starter: 'Weekly',
    pro: 'Daily',
    enterprise: 'Real-time / Instant',
  },
  {
    feature: 'AI Assistant Availability',
    starter: '—',
    pro: 'Standard',
    enterprise: 'Advanced',
  },
  {
    feature: 'Violation History',
    starter: '7 Days',
    pro: '90 Days',
    enterprise: 'Unlimited',
  },
  {
    feature: 'Custom Reporting',
    starter: '—',
    pro: '✓',
    enterprise: '✓',
  },
  {
    feature: 'Security Policy Audits',
    starter: 'Basic',
    pro: 'Full',
    enterprise: 'Continuous Compliance',
  },
  {
    feature: 'Team Seats',
    starter: '1',
    pro: '5',
    enterprise: 'Unlimited',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0f2023] text-slate-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f2023] px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#07b6d5] to-[#3b82f6] rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-[#07b6d5]/30 flex items-center justify-center text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div className="absolute -right-1 -bottom-1 h-4 w-4 bg-[#0f2023] border border-white/10 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-black tracking-tight text-slate-100 uppercase">
                Shield<span className="text-[#07b6d5]">CSP</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest -mt-1">
                Security Platform
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            <Link href="/dashboard" className="opacity-60 hover:opacity-100 transition-opacity">
              Dashboard
            </Link>
            <span className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">Inventory</span>
            <span className="text-[#07b6d5] border-b-2 border-[#07b6d5] pb-1">Pricing</span>
            <Link href="/docs" className="opacity-60 hover:opacity-100 transition-opacity">
              Documentation
            </Link>
          </nav>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#07b6d5]/10 border border-[#07b6d5]/30 flex items-center justify-center text-[#07b6d5]">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold hidden sm:inline-block">Admin User</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            ShieldCSP Pricing Plans
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Select the tier that matches your security requirements. From solo developers to global enterprises, we
            protect your assets against modern web vulnerabilities.
          </p>
        </section>

        {/* Pricing cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* Starter */}
          <Card className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-slate-300">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  Perfect for individual projects and hobbyists.
                </p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                  1 Domain
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                  Weekly Scans
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                  Basic Violation Reporting
                </li>
                <li className="flex items-center gap-3 text-sm opacity-40">
                  <XCircle className="h-5 w-5" />
                  AI Remediation Assistant
                </li>
              </ul>
              <Button
                asChild
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="bg-[#020617]/40 border border-indigo-500/40 rounded-2xl p-8 flex flex-col relative scale-105 shadow-2xl transition-all">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg shadow-indigo-500/30">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-indigo-400">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$19</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  For security-focused professionals and small teams.
                </p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-indigo-400 h-5 w-5" />
                  Up to 10 Domains
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-indigo-400 h-5 w-5" />
                  Daily Automated Scans
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="text-indigo-400 h-5 w-5" />
                  AI Remediation Assistant
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-indigo-400 h-5 w-5" />
                  API Access
                </li>
              </ul>
              <Button
                asChild
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
              >
                <Link href="/signup">Upgrade Now</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col hover:border-white/20 transition-all">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-slate-300">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Custom</span>
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  Maximum security and compliance for large organizations.
                </p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                  Unlimited Domains
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                  Real-time Scanning
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                  Advanced AI Forensics
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                  Dedicated Account Manager
                </li>
              </ul>
              <Button
                asChild
                className="w-full py-3 bg-[#07b6d5] text-white hover:bg-[#07b6d5]/90 rounded-xl font-bold transition-all shadow-lg shadow-[#07b6d5]/20"
              >
                <Link href="/login">Contact Sales</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Feature comparison */}
        <section className="mt-32">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-[#07b6d5]" />
            Detailed Feature Comparison
          </h3>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <Table className="w-full border-collapse">
              <TableHeader>
                <TableRow className="border-b border-white/10 bg-white/5">
                  <TableHead className="py-6 px-6 text-left font-bold text-slate-500 uppercase text-xs tracking-wider w-1/4">
                    Features
                  </TableHead>
                  <TableHead className="py-6 px-4 text-center font-bold text-slate-300">Starter</TableHead>
                  <TableHead className="py-6 px-4 text-center font-bold text-indigo-400">Pro</TableHead>
                  <TableHead className="py-6 px-4 text-center font-bold text-[#07b6d5]">
                    Enterprise
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-white/5 bg-white/[0.02]">
                {featureComparison.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-6 px-6 text-sm font-medium">{row.feature}</TableCell>
                    <TableCell className="py-6 px-4 text-center text-sm text-slate-400">
                      {row.starter === '—' ? (
                        <Minus className="mx-auto h-4 w-4 text-slate-700" />
                      ) : (
                        row.starter
                      )}
                    </TableCell>
                    <TableCell className="py-6 px-4 text-center text-sm">
                      {row.pro === '—' ? (
                        <Minus className="mx-auto h-4 w-4 text-slate-700" />
                      ) : row.pro === '✓' ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-indigo-400" />
                      ) : (
                        row.pro
                      )}
                    </TableCell>
                    <TableCell className="py-6 px-4 text-center text-sm">
                      {row.enterprise === '—' ? (
                        <Minus className="mx-auto h-4 w-4 text-slate-700" />
                      ) : row.enterprise === '✓' ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                      ) : (
                        row.enterprise
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3 opacity-80">
              <div className="h-6 w-6 bg-gradient-to-br from-[#07b6d5] to-[#3b82f6] rounded flex items-center justify-center text-white">
                <Shield className="h-3 w-3" />
              </div>
              <span className="text-sm font-bold tracking-tight uppercase">
                Shield<span className="text-[#07b6d5]">CSP</span>
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Link href="#" className="hover:text-[#07b6d5] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/docs" className="hover:text-[#07b6d5] transition-colors">
                Documentation
              </Link>
              <Link href="#" className="hover:text-[#07b6d5] transition-colors">
                API Keys
              </Link>
              <Link href="#" className="hover:text-[#07b6d5] transition-colors">
                Support Status
              </Link>
              <Link href="#" className="hover:text-[#07b6d5] transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
            <p className="text-xs text-slate-600">
              © 2024 ShieldCSP Inc. Enterprise Edition v2.4. All rights reserved.
            </p>
            <div className="flex gap-4">
              <button className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                <Code2 className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                <Terminal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
