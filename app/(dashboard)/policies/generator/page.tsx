'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Download, Info, Shield, Lightbulb } from 'lucide-react';

const cspDirectives = [
  {
    id: 'default-src',
    label: "default-src 'self'",
    description: 'Standard fallback for all resource types',
    defaultChecked: true,
  },
  {
    id: 'script-src',
    label: "script-src 'self' 'unsafe-inline'",
    description: 'Allow scripts from origin and inline blocks',
    defaultChecked: true,
  },
  {
    id: 'style-src',
    label: "style-src 'self' fonts.googleapis.com",
    description: 'Allow styles from your origin and Google Fonts',
    defaultChecked: false,
  },
  {
    id: 'img-src',
    label: 'img-src * data: blob:',
    description: 'Allow images from any source including base64',
    defaultChecked: true,
  },
];

export default function PolicyGeneratorPage() {
  const [maxAge, setMaxAge] = useState(31536000);

  return (
    <div className="min-h-screen bg-[#0f2023] text-white">
      <div className="px-10 py-6 max-w-[1200px] mx-auto">
        {/* Wizard Header (below global app nav) */}
        <header className="mb-8">
          {/* Stepper */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <h1 className="text-2xl font-bold tracking-tight">Policy Generator Wizard</h1>
              <p className="text-[#07b6d5] text-sm font-semibold uppercase tracking-wider">
                Step 3 of 4: Header Configuration
              </p>
            </div>
            <div className="h-3 rounded-full bg-[#306069] overflow-hidden flex">
              <div className="h-full bg-[#07b6d5] shadow-[0_0_15px_rgba(7,182,213,0.5)]" style={{ width: '75%' }} />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-[#8fc3cc] px-1 tracking-[0.18em]">
              <span>BASIC INFO</span>
              <span>DOMAINS</span>
              <span className="text-[#07b6d5]">DIRECTIVES</span>
              <span>REVIEW</span>
            </div>
          </div>
        </header>

        {/* Heading + Docs button */}
        <div className="flex flex-wrap justify-between gap-3 items-center mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold leading-tight">Directive Configuration</h2>
            <p className="text-[#8fc3cc] text-base">
              Define your security boundaries, HSTS settings, and reporting endpoints.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl h-10 px-4 bg-[#224349] border-none text-white text-sm font-medium hover:bg-[#306069]"
          >
            <Info className="h-4 w-4 mr-2" />
            View Documentation
          </Button>
        </div>

        {/* Main grid */}
        <div className="flex gap-8 items-start">
          {/* Left: form panel */}
          <div className="flex-1 bg-[#1a2f33] rounded-2xl border border-[#224349] p-6 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
            {/* CSP Directives */}
            <section className="mb-8">
              <h3 className="text-[#07b6d5] text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                CSP Directives
              </h3>
              <div className="space-y-1">
                {cspDirectives.map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center gap-3 py-3 px-4 hover:bg-[#224349] rounded-xl cursor-pointer transition-colors group"
                  >
                    <Checkbox
                      defaultChecked={d.defaultChecked}
                      className="h-5 w-5 rounded border-2 border-[#306069] data-[state=checked]:bg-[#07b6d5] data-[state=checked]:border-[#07b6d5]"
                    />
                    <div className="flex-1">
                      <p className="text-white text-base font-medium">{d.label}</p>
                      <p className="text-[#8fc3cc] text-xs">{d.description}</p>
                    </div>
                    <span className="text-[#8fc3cc] group-hover:text-[#07b6d5] text-xs">i</span>
                  </label>
                ))}
              </div>
            </section>

            {/* HSTS settings */}
            <section className="pt-6 border-t border-[#224349]">
              <h3 className="text-[#07b6d5] text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span>🔒</span>
                HSTS Settings
              </h3>
              <div className="px-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-white text-sm font-medium">Max Age (Seconds)</label>
                    <span className="text-[#07b6d5] font-mono text-sm">
                      {maxAge.toLocaleString()} (1 Year)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={63072000}
                    step={86400}
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#306069]"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      defaultChecked
                      className="h-4 w-4 rounded border-2 border-[#306069] data-[state=checked]:bg-[#07b6d5] data-[state=checked]:border-[#07b6d5]"
                    />
                    <p className="text-white text-sm">Include Subdomains</p>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      className="h-4 w-4 rounded border-2 border-[#306069] data-[state=checked]:bg-[#07b6d5] data-[state=checked]:border-[#07b6d5]"
                    />
                    <p className="text-white text-sm">Preload Consent</p>
                  </label>
                </div>
              </div>
            </section>

            {/* Footer buttons */}
            <div className="flex justify-between mt-12 gap-4">
              <Button
                variant="outline"
                className="flex-1 py-3 px-6 rounded-xl border border-[#306069] text-white font-bold hover:bg-[#224349]"
              >
                Previous
              </Button>
              <Button className="flex-[2] py-3 px-6 rounded-xl bg-[#07b6d5] text-[#0f2023] font-bold hover:brightness-110 shadow-[0_0_20px_rgba(7,182,213,0.3)]">
                Save &amp; Continue
              </Button>
            </div>
          </div>

          {/* Right: live preview */}
          <div className="w-[430px] flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#8fc3cc] uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live Preview
              </span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[#224349] rounded-lg transition-colors text-[#8fc3cc] hover:text-white">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-[#224349] rounded-lg transition-colors text-[#8fc3cc] hover:text-white">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Card className="bg-[#0a0a0a] border-[#224349] rounded-2xl flex flex-col flex-1 shadow-2xl">
              <div className="bg-[#1a1a1a] px-4 py-2 border-b border-[#224349] flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="ml-4 text-[10px] font-mono text-[#5c6370]">nginx_csp_policy.conf</span>
              </div>
              <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-y-auto custom-scrollbar">
                <div className="flex gap-4">
                  <div className="text-[#3e4451] text-right select-none w-6">
                    1
                    <br />
                    2
                    <br />
                    3
                    <br />
                    4
                    <br />
                    5
                    <br />
                    6
                    <br />
                    7
                    <br />
                    8
                    <br />
                    9
                    <br />
                    10
                    <br />
                    11
                  </div>
                  <div className="text-[#abb2bf] flex-1">
                    <p>
                      <span className="text-[#c678dd]">add_header</span>{' '}
                      <span className="text-[#98c379]">Content-Security-Policy</span>
                    </p>
                    <p className="pl-4">
                      "<span className="text-[#61afef]">default-src</span>{' '}
                      <span className="text-[#d19a66]">'self'</span>;
                    </p>
                    <p className="pl-4">
                      <span className="text-[#61afef]">script-src</span>{' '}
                      <span className="text-[#d19a66]">'self' 'unsafe-inline'</span>;
                    </p>
                    <p className="pl-4">
                      <span className="text-[#61afef]">img-src</span>{' '}
                      <span className="text-[#d19a66]">* data: blob:</span>;
                    </p>
                    <p className="pl-4">
                      <span className="text-[#61afef]">report-uri</span>{' '}
                      <span className="text-[#d19a66]">/csp-report-endpoint</span>;
                    </p>
                    <p className="pl-4">
                      <span className="text-[#61afef]">upgrade-insecure-requests</span>;"{' '}
                      <span className="text-[#e06c75]">always</span>;
                    </p>
                    <p className="mt-4">
                      <span className="text-[#c678dd]">add_header</span>{' '}
                      <span className="text-[#98c379]">Strict-Transport-Security</span>
                    </p>
                    <p className="pl-4">
                      "<span className="text-[#61afef]">max-age</span>=
                      <span className="text-[#d19a66]">31536000</span>;
                    </p>
                    <p className="pl-4">
                      <span className="text-[#61afef]">includeSubDomains</span>"{' '}
                      <span className="text-[#e06c75]">always</span>;
                    </p>
                    <p className="mt-4 text-[#5c6370]"># Security policy updated by ShieldCSP</p>
                    <span className="inline-block w-2 h-4 bg-[#07b6d5] animate-pulse align-middle ml-1" />
                  </div>
                </div>
              </div>
              <div className="bg-[#1a1a1a] px-4 py-2 border-t border-[#224349] flex justify-between text-[10px] font-mono text-[#5c6370]">
                <span>UTF-8</span>
                <span>Ln 11, Col 42</span>
                <span className="text-[#07b6d5]">CSP V3</span>
              </div>
            </Card>

            {/* Pro tip card */}
            <Card className="bg-[#07b6d5]/10 border-[#07b6d5]/20 rounded-xl">
              <CardContent className="p-4 flex gap-3">
                <Lightbulb className="h-5 w-5 text-[#07b6d5] mt-0.5" />
                <div className="text-xs leading-relaxed text-[#8fc3cc]">
                  <strong className="text-white block mb-1">Security Pro-Tip:</strong>
                  Using{' '}
                  <code className="bg-[#224349] px-1 rounded text-[#07b6d5]">'unsafe-inline'</code> is generally
                  discouraged. Consider using <code className="bg-[#224349] px-1 rounded text-[#07b6d5]">nonces</code>{' '}
                  or <code className="bg-[#224349] px-1 rounded text-[#07b6d5]">hashes</code> in Step 4 for better XSS
                  prevention.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

