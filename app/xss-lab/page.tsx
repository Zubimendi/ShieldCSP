'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Play,
  RefreshCw,
  BookOpen,
  Terminal,
  History,
  Settings,
  MoreVertical,
  Share2,
  Save,
  Grid3x3,
  Brain,
  Sparkles,
  Server,
  Cpu,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function XssLabPage() {
  const [payload, setPayload] = useState(
    `<img onerror="alert(1)" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFr3iHfWOZB5_ZdWiE2VeJQMxerwZ8LIcr3Hm6fmJqIGIjCqZU0ug3hI7tkZ0iu5_kCKPWP1GvCi80j6ANV0lNTK63pLBAZckGFxP2mhMRFXqbzOmGODi3YC8PWi3BKaZp89UUT7crizS6VOFxZLdln5kWGg-AsFTTm6Mr8TOfBv8_N2Bnp-llK3yYuhvwwNpADMTyh29wAfuTG5n1bvlyUd_Zk4O9v3Rzioj-xkK9pboG198hJ3KBCrSxpz0dltvCRl8PXIwQxvWP"/>`,
  );
  const [cspPolicy, setCspPolicy] = useState('strict');
  const [context, setContext] = useState('html-body');
  const [executed, setExecuted] = useState(true);
  const [consoleLogs] = useState([
    { time: '14:22:01', level: 'INFO', message: "Sandbox reloaded with Policy 'Moderate'" },
    { time: '14:22:04', level: 'EVENT', message: 'window.alert triggered from DOM element <img>' },
    {
      time: '14:22:04',
      level: 'WARN',
      message:
        "Refused to load the image 'http://localhost/x' because it violates the following Content Security Policy directive...",
    },
  ]);

  const handleExecute = () => {
    setExecuted(true);
  };

  const handleReset = () => {
    setPayload('');
    setExecuted(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f2023] text-white">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-[#224349] px-6 lg:px-10 py-3 bg-[#0f2023]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 text-[#07b6d5]">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-white text-lg font-bold">ShieldCSP Lab</h2>
          </div>
          <nav className="hidden md:flex items-center gap-9">
            <Link href="/dashboard" className="text-[#8fc3cc] hover:text-white transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/policies" className="text-[#8fc3cc] hover:text-white transition-colors text-sm font-medium">
              Policies
            </Link>
            <Link href="/xss-lab" className="text-white text-sm font-medium border-b-2 border-[#07b6d5] pb-1">
              Lab
            </Link>
            <Link href="/violations" className="text-[#8fc3cc] hover:text-white transition-colors text-sm font-medium">
              Reports
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex min-w-48 max-w-64">
            <div className="flex w-full items-center rounded-lg h-9 bg-[#224349]">
              <Search className="text-[#8fc3cc] ml-3 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search payloads..."
                className="w-full border-none bg-transparent text-white focus:ring-0 placeholder:text-[#8fc3cc] px-3 text-sm h-9"
              />
            </div>
          </div>
          <Button className="h-9 px-4 bg-[#07b6d5] text-[#102023] text-sm font-bold hover:brightness-110">
            Deploy Policy
          </Button>
          <div className="h-9 w-9 rounded-full bg-[#224349] border border-[#224349]" />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-[#224349] bg-[#0f2023] hidden xl:flex flex-col justify-between p-4">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-white text-sm font-semibold tracking-wider uppercase opacity-50 px-3">
                Vulnerability Research
              </h1>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                href="/xss-lab#payload-library"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8fc3cc] hover:bg-[#224349] transition-all"
              >
                <BookOpen className="h-5 w-5" />
                <p className="text-sm font-medium">Payload Library</p>
              </Link>
              <Link href="/xss-lab" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#224349] text-white">
                <Terminal className="h-5 w-5 text-[#07b6d5]" />
                <p className="text-sm font-medium">Active Lab</p>
              </Link>
              <Link
                href="/scanner"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8fc3cc] hover:bg-[#224349] transition-all"
              >
                <History className="h-5 w-5" />
                <p className="text-sm font-medium">Scan History</p>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8fc3cc] hover:bg-[#224349] transition-all"
              >
                <Settings className="h-5 w-5" />
                <p className="text-sm font-medium">Settings</p>
              </Link>
            </div>
            <div className="mt-4">
              <h3 className="text-white text-xs font-bold uppercase opacity-40 px-3 mb-2">Saved Policies</h3>
              <div className="flex flex-col gap-1">
                <div className="px-3 py-2 rounded-lg border border-[#224349] hover:border-[#07b6d5]/50 cursor-pointer group transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#07b6d5]">Strict_Prod_v2</span>
                    <MoreVertical className="h-4 w-4 text-[#8fc3cc]" />
                  </div>
                </div>
                <div className="px-3 py-2 rounded-lg border border-[#224349] hover:border-[#07b6d5]/50 cursor-pointer group transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#8fc3cc]">Loose_Dev_Env</span>
                    <MoreVertical className="h-4 w-4 text-[#8fc3cc]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-[#162a2e] rounded-xl border border-[#224349]">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-[#07b6d5] animate-pulse" />
              <span className="text-xs font-medium text-[#8fc3cc]">Lab Engine: Online</span>
            </div>
            <div className="w-full bg-[#102023] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#07b6d5] h-full w-2/3" />
            </div>
          </div>
        </aside>

        {/* Main Lab Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1a1d]">
          {/* Toolbar/Breadcrumbs */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#224349]">
            <div className="flex items-center gap-2">
              <Link href="/scanner" className="text-[#8fc3cc] text-sm font-medium hover:text-white">
                Security Tools
              </Link>
              <span className="text-[#8fc3cc] text-sm opacity-50">/</span>
              <span className="text-white text-sm font-medium">XSS Testing Lab</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-[#224349] border-[#224349] text-[#8fc3cc] hover:bg-[#2b545c] hover:text-white text-xs font-bold"
              >
                <Share2 className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-[#224349] border-[#224349] text-[#8fc3cc] hover:bg-[#2b545c] hover:text-white text-xs font-bold"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>

          {/* Split Pane Container */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel: Input & Settings */}
            <div className="w-1/2 border-r border-[#224349] flex flex-col overflow-hidden">
              <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
                {/* Test Settings */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-lg">Test Settings</h3>
                    <span className="text-xs text-[#8fc3cc] font-mono">LAB_ID: 0X44FE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#8fc3cc] uppercase tracking-wider">CSP Policy</label>
                      <Select value={cspPolicy} onValueChange={setCspPolicy}>
                        <SelectTrigger className="bg-[#224349] border-none text-white rounded-lg text-sm focus:ring-1 focus:ring-[#07b6d5] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strict">Strict (Script-src: 'self')</SelectItem>
                          <SelectItem value="moderate">Moderate (Unsafe-inline)</SelectItem>
                          <SelectItem value="none">None (All allowed)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#8fc3cc] uppercase tracking-wider">Context</label>
                      <Select value={context} onValueChange={setContext}>
                        <SelectTrigger className="bg-[#224349] border-none text-white rounded-lg text-sm focus:ring-1 focus:ring-[#07b6d5] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="html-body">HTML Body</SelectItem>
                          <SelectItem value="attribute">Attribute (value=)</SelectItem>
                          <SelectItem value="js-variable">JS Variable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Payload Input */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#8fc3cc] uppercase tracking-wider">Payload Input</label>
                    <div className="flex gap-3">
                      <Badge className="text-[10px] text-[#07b6d5] bg-[#07b6d5]/10 px-2 py-0.5 rounded border border-[#07b6d5]/20">
                        JetBrains Mono
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#102023] border-r border-[#224349] flex flex-col items-center py-4 text-xs font-mono text-[#8fc3cc]/40 select-none">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <span key={num}>{num}</span>
                      ))}
                    </div>
                    <Textarea
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                      className="w-full h-48 bg-[#102023] border border-[#224349] rounded-lg pl-14 p-4 text-sm font-mono text-[#07b6d5] placeholder:text-[#224349] focus:ring-1 focus:ring-[#07b6d5] focus:border-[#07b6d5] resize-none"
                      placeholder="<script>alert('XSS')</script>"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-start gap-3">
                  <Button
                    onClick={handleExecute}
                    className="flex-1 max-w-[200px] flex items-center justify-center gap-2 rounded-xl h-11 bg-[#07b6d5] text-[#102023] font-bold hover:brightness-110 shadow-lg shadow-[#07b6d5]/10"
                  >
                    <Play className="h-5 w-5" />
                    Execute Payload
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="px-6 flex items-center justify-center gap-2 rounded-xl h-11 bg-[#224349] border-[#224349] text-white font-bold hover:bg-[#2b545c]"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Reset
                  </Button>
                </div>

                {/* Payload Library */}
                <div className="mt-2">
                  <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                    <Grid3x3 className="h-5 w-5 text-[#07b6d5]" />
                    Payload Library
                  </h3>
                  <div className="space-y-2">
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue="bypass"
                      className="bg-[#162a2e] rounded-lg border border-[#224349]"
                    >
                      <AccordionItem value="bypass" className="border-none">
                        <AccordionTrigger className="flex items-center justify-between p-3 hover:no-underline">
                          <span className="text-sm font-medium">Bypass Techniques</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-3 pt-0 flex flex-col gap-2">
                          <div
                            onClick={() => setPayload('<svg onload=alert(1)>')}
                            className="p-2 rounded bg-[#0d1a1d] border border-[#224349] text-xs font-mono text-[#8fc3cc] hover:text-[#07b6d5] cursor-pointer transition-colors"
                          >
                            &lt;svg onload=alert(1)&gt;
                          </div>
                          <div
                            onClick={() => setPayload('javascript:alert(1)')}
                            className="p-2 rounded bg-[#0d1a1d] border border-[#224349] text-xs font-mono text-[#8fc3cc] hover:text-[#07b6d5] cursor-pointer transition-colors"
                          >
                            javascript:alert(1)
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible className="bg-[#162a2e] rounded-lg border border-[#224349]">
                      <AccordionItem value="polyglots" className="border-none">
                        <AccordionTrigger className="flex items-center justify-between p-3 hover:no-underline">
                          <span className="text-sm font-medium">Polyglots</span>
                        </AccordionTrigger>
                        <AccordionContent className="p-3 pt-0">
                          <div className="p-2 rounded bg-[#0d1a1d] border border-[#224349] text-xs font-mono text-[#8fc3cc]">
                            Coming soon...
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Sandbox & Execution */}
            <div className="w-1/2 flex flex-col overflow-hidden">
              <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
                {/* Execution Environment */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">Execution Environment</h3>
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/10 border border-red-500/20">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Vulnerable</span>
                    </div>
                  </div>
                  <div className="aspect-video w-full bg-white rounded-xl border-4 border-red-500/50 shadow-2xl shadow-red-500/5 flex items-center justify-center overflow-hidden">
                    {executed ? (
                      <div className="text-[#102023] text-center">
                        <div className="p-4">
                          <p className="text-xs text-gray-400 mb-2 italic">Sandbox Render:</p>
                          <div className="text-xl font-bold flex items-center justify-center gap-2">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                            XSS Triggered!
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Payload: &lt;img src=x onerror=alert(1)&gt;</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">Waiting for payload execution...</div>
                    )}
                  </div>
                </div>

                {/* Console Output */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#8fc3cc] uppercase tracking-wider">Console Output</label>
                    <button className="text-[10px] text-[#8fc3cc] hover:text-white uppercase font-bold">Clear Logs</button>
                  </div>
                  <div className="flex-1 bg-[#0d1a1d] rounded-lg border border-[#224349] p-4 font-mono text-xs overflow-y-auto min-h-[120px]">
                    {consoleLogs.map((log, index) => {
                      let levelColor = 'text-gray-400';
                      if (log.level === 'INFO') levelColor = 'text-blue-400';
                      else if (log.level === 'EVENT') levelColor = 'text-red-400 font-bold';
                      else if (log.level === 'WARN') levelColor = 'text-yellow-400 font-bold';

                      return (
                        <div key={index} className="flex gap-3 mb-1">
                          <span className="text-gray-500">[{log.time}]</span>
                          <span className={levelColor}>{log.level}:</span>
                          <span className={log.level === 'WARN' ? 'text-yellow-400/80' : 'text-white italic'}>
                            {log.message}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold text-[#8fc3cc] uppercase tracking-wider flex items-center gap-2">
                    <Brain className="h-4 w-4 text-[#07b6d5]" />
                    AI Explanation
                  </label>
                  <div className="bg-gradient-to-br from-[#162a2e] to-[#0d1a1d] p-5 rounded-xl border border-[#07b6d5]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Sparkles className="h-16 w-16 text-[#07b6d5]" />
                    </div>
                    <h4 className="text-[#07b6d5] font-bold text-sm mb-2 relative z-10">Why was this executed?</h4>
                    <p className="text-sm text-[#8fc3cc] leading-relaxed mb-4 relative z-10">
                      The current CSP configuration uses{' '}
                      <code className="bg-[#224349] px-1 rounded text-white">script-src 'unsafe-inline'</code>. This
                      allows event handlers like <code className="bg-[#224349] px-1 rounded text-white">onerror</code> to
                      execute even if external scripts are blocked. To mitigate, switch to a hash-based or nonce-based CSP.
                    </p>
                    <div className="flex gap-4 relative z-10">
                      <div className="flex-1 p-3 rounded-lg bg-[#102023] border border-[#224349]">
                        <p className="text-[10px] font-bold text-white uppercase opacity-40 mb-1">Risk Level</p>
                        <p className="text-xs font-bold text-red-500">CRITICAL (9.8/10)</p>
                      </div>
                      <div className="flex-1 p-3 rounded-lg bg-[#102023] border border-[#224349]">
                        <p className="text-[10px] font-bold text-white uppercase opacity-40 mb-1">Remediation</p>
                        <p className="text-xs font-bold text-[#07b6d5]">CSP Hardening</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-[#224349] bg-[#0f2023] px-4 flex items-center justify-between text-[10px] text-[#8fc3cc] font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Server className="h-3 w-3 text-[#07b6d5]" />
            <span>Node: secure-lab-us-west</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3 text-[#07b6d5]" />
            <span>RAM: 2.4GB / 8GB</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/docs" className="hover:text-white cursor-pointer transition-colors">
            Documentation
          </Link>
          <Link href="/docs" className="hover:text-white cursor-pointer transition-colors">
            Support API
          </Link>
          <div className="bg-[#07b6d5]/10 px-2 py-0.5 rounded text-[#07b6d5] font-bold">V1.4.2-STABLE</div>
        </div>
      </footer>
    </div>
  );
}

