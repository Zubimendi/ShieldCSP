'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldCheck, Activity, AlertCircle, Copy, Info } from 'lucide-react';

const recentViolations = [
  {
    id: 'script-src-elem-violation',
    description: 'Blocked source: https://external-ads.js',
    time: '14:02:11',
  },
  {
    id: 'inline-script-violation',
    description: 'Source: login.portal.com - hash missing',
    time: '13:45:02',
  },
];

export default function SecurityPoliciesPage() {
  return (
    <div className="min-h-screen bg-[#0f2023] text-white flex">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 p-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Policy Overview</h1>
              <p className="text-sm text-white/60 mt-1">
                Manage and monitor Content Security Policies for production environments.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#07b6d5] hover:brightness-110 text-[#102023] px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-[#07b6d5]/20 flex items-center gap-2"
            >
              <Link href="/policies/generator">
                <span className="text-base mr-1">+</span>
                New Policy
              </Link>
            </Button>
          </div>

          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#162a2e]/70 border-[#224349] rounded-xl">
              <CardContent className="p-5">
                <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.16em] mb-2">CSP Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-yellow-400">B-</span>
                  <span className="text-white/50 text-sm mb-1">Below target</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#162a2e]/70 border-[#224349] rounded-xl">
              <CardContent className="p-5">
                <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.16em] mb-2">
                  Violations (24h)
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-red-400">12</span>
                  <span className="text-white/50 text-sm mb-1">+3 since yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#162a2e]/70 border-[#224349] rounded-xl">
              <CardContent className="p-5">
                <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.16em] mb-2">Active Policies</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">8</span>
                  <span className="text-white/50 text-sm mb-1">Across 3 clusters</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Violations */}
          <Card className="bg-[#162a2e]/70 border-[#224349] rounded-xl overflow-hidden max-w-4xl mx-auto w-full">
            <CardHeader className="px-6 py-4 border-b border-[#224349] flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Violation Reports</CardTitle>
              <button className="text-xs font-semibold text-[#07b6d5] hover:text-white transition-colors">
                View all logs
              </button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-[#224349]">
              {recentViolations.map((v) => (
                <div
                  key={v.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-sm font-medium">{v.id}</p>
                      <p className="text-xs text-white/60">{v.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-white/40 font-mono">{v.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Right Docked Assistant Panel */}
      <aside className="w-[400px] xl:w-[420px] glass-effect h-full flex flex-col shadow-2xl relative border-l border-[#224349]">
        {/* Header */}
        <div className="p-4 border-b border-[#224349] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#07b6d5] to-cyan-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#162a2e] animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">Shield AI Assistant</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#07b6d5] font-bold uppercase tracking-[0.18em]">v2.4 Pro</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="text-[10px] text-white/40 font-medium italic">Scanning active</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/60">
              <Activity className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/60">
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-6">
          {/* User Message */}
          <div className="flex flex-col items-end gap-2 max-w-[85%] self-end">
            <div className="bg-[#07b6d5] text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm font-medium shadow-lg shadow-[#07b6d5]/20">
              How can I improve my CSP score for the login portal? I'm getting inline script violations.
            </div>
            <span className="text-[10px] text-white/40 font-mono mr-1">14:05 PM</span>
          </div>

          {/* AI Response */}
          <div className="flex flex-col gap-2 max-w-[95%]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#07b6d5] uppercase tracking-[0.24em]">Shield AI</span>
            </div>
            <div className="bg-[#162c31]/70 border border-[#224349] px-4 py-4 rounded-2xl rounded-tl-none shadow-xl">
              <p className="text-sm leading-relaxed mb-4">
                I've analyzed your login portal violations. Your current score is{' '}
                <span className="text-yellow-400 font-bold">B-</span>. The main issue is the use of{' '}
                <code className="bg-black/20 px-1 rounded text-[#07b6d5]">unsafe-inline</code> scripts.
              </p>

              <div className="flex flex-col gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-white/70 uppercase">Analysis Results</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 rounded-full px-2 py-0.5 text-[10px]">
                      High Severity
                    </Badge>
                  </div>
                  <ul className="text-xs space-y-2 text-white/80">
                    <li className="flex gap-2">
                      <span className="text-[#07b6d5]">•</span>
                      3 inline scripts detected without nonces
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#07b6d5]">•</span>
                      Missing <code className="bg-black/20 px-1 rounded">base-uri</code> directive
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-sm mb-2">Update your CSP header with this hardened version:</p>

              {/* Code Block */}
              <div className="rounded-lg overflow-hidden border border-[#224349] bg-[#0a1416] mb-4">
                <div className="bg-white/5 px-3 py-1.5 flex justify-between items-center border-b border-white/5">
                  <span className="text-[10px] text-white/40 font-mono">CSP-Header.conf</span>
                  <button className="flex items-center gap-1 text-[10px] text-[#07b6d5] font-bold hover:text-white transition-colors">
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono leading-relaxed text-cyan-200/90 overflow-x-auto">
{`Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'nonce-rAnd0m123' https://trusted.cdn.com;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;`}
                </pre>
              </div>

              <p className="text-sm">
                Applying this will upgrade your security score to{' '}
                <span className="text-green-500 font-bold">A+</span> and mitigate 98% of potential XSS vectors.
              </p>
            </div>
            <span className="text-[10px] text-white/40 font-mono ml-1">14:06 PM</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#162a2e]/60 border-t border-[#224349] flex flex-col gap-3">
          {/* Quick Action Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#07b6d5]/10 border border-[#07b6d5]/20 hover:bg-[#07b6d5]/20 pl-2 pr-4 transition-colors">
              <Info className="h-4 w-4 text-[#07b6d5]" />
              <p className="text-[#07b6d5] text-[12px] font-bold">Explain my violations</p>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#224349] hover:bg-white/10 pl-2 pr-4 transition-colors">
              <ShieldCheck className="h-4 w-4 text-white" />
              <p className="text-white text-[12px] font-medium">Generate CSP</p>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#224349] hover:bg-white/10 pl-2 pr-4 transition-colors">
              <AlertTriangle className="h-4 w-4 text-white" />
              <p className="text-white text-[12px] font-medium">Scan for XSS</p>
            </button>
          </div>

          {/* Text Terminal */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/30">
              <button className="hover:text-[#07b6d5] transition-colors">
                <span className="text-xs font-semibold">+</span>
              </button>
            </div>
            <textarea
              className="w-full bg-[#0f2023]/80 border border-[#224349] rounded-xl py-3 pl-11 pr-14 text-sm font-mono placeholder:text-white/20 focus:ring-1 focus:ring-[#07b6d5] focus:border-[#07b6d5] resize-none h-[52px] leading-tight custom-scrollbar"
              placeholder="Ask about CSP or paste logs..."
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#07b6d5] text-white h-9 w-9 rounded-lg flex items-center justify-center shadow-lg shadow-[#07b6d5]/20 hover:bg-[#07b6d5]/90 transition-all">
              <span className="text-sm font-bold">↩</span>
            </button>
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] text-white/30 uppercase tracking-[0.24em] font-bold">
              Terminal Mode Active
            </span>
            <span className="text-[9px] text-white/30 font-mono">Tokens: 24/128k</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

