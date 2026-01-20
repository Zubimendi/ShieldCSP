'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Search, Rocket, Circle, Compass, Key, AlertTriangle, Code, ChevronRight, Lightbulb, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState('getting-started');
  const [selectedFramework, setSelectedFramework] = useState('nextjs');

  return (
    <div className="min-h-screen bg-[#0f2023] text-white flex">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-[#224349] bg-[#0f2023] flex-shrink-0">
        <div className="p-6 border-b border-[#224349]">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#07b6d5] flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">ShieldCSP Docs</span>
          </Link>
        </div>

        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
          {/* INTRODUCTION */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">INTRODUCTION</p>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedSection('getting-started')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedSection === 'getting-started'
                    ? 'bg-[#14b8a6] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Rocket className="h-4 w-4" />
                Getting Started
              </button>
              <button
                onClick={() => setSelectedSection('core-concepts')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedSection === 'core-concepts'
                    ? 'bg-[#14b8a6] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Circle className="h-4 w-4" />
                Core Concepts
              </button>
            </div>
          </div>

          {/* API REFERENCE */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">API REFERENCE</p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">
                <Compass className="h-4 w-4" />
                Endpoint Overview
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">
                <Key className="h-4 w-4" />
                <span className="flex-1 text-left">Authentication</span>
                <ChevronRight className="h-3 w-3" />
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">
                <AlertTriangle className="h-4 w-4" />
                Error Handling
              </button>
            </div>
          </div>

          {/* SDKs */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">SDKS</p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">
                <Code className="h-4 w-4" />
                Node.js / TypeScript
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">
                <span className="h-4 w-4 flex items-center justify-center">›</span>
                Python
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">
                <span className="h-4 w-4 flex items-center justify-center">{`{ }`}</span>
                Go
              </button>
            </div>
          </div>

          {/* FRAMEWORK INTEGRATIONS */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">FRAMEWORK INTEGRATIONS</p>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFramework('nextjs')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFramework === 'nextjs'
                    ? 'bg-[#14b8a6]/20 text-[#14b8a6]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Next.js
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">
                React (Vite)
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5">
                Nuxt / Vue
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="border-b border-[#224349] bg-[#0f2023]/80 backdrop-blur-md px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 pl-10 pr-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs bg-white/10 border border-white/20 rounded">K</kbd>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-8">
              <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                Changelog
              </Link>
              <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
              <Button variant="outline" size="sm" className="border-[#224349] bg-[#224349] text-[#8fc3cc] hover:bg-[#2b545c]">
                Sign In
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Main Article */}
          <main className="flex-1 px-8 py-12 max-w-4xl">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-[#07b6d5]" />
                <span className="text-sm text-[#8fc3cc] uppercase tracking-wider">GETTING STARTED</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Quick Start Guide</h1>
              <p className="text-lg text-gray-400">
                ShieldCSP runs as its own Next.js service that scans domains, ingests CSP reports, and generates
                server-side middleware you can plug into your own Next.js/React apps.
              </p>
            </div>

            {/* 1. Run ShieldCSP */}
            <section className="mb-12" id="install-sdk">
              <h2 className="text-2xl font-bold mb-2">1. Run the ShieldCSP service</h2>
              <p className="text-gray-400 mb-4">
                Clone and run the ShieldCSP dashboard/API (this repo) locally or deploy it to Vercel. This service hosts
                the dashboard, scanner, code generator, and API routes.
              </p>
              <Card className="bg-[#162a2e] border-[#224349]">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#224349]">
                    <span className="text-sm text-gray-400">Terminal</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <code className="block text-sm text-gray-300 font-mono">
                      git clone https://github.com/Zubimendi/ShieldCSP.git
                    </code>
                    <code className="block text-sm text-gray-300 font-mono">cd shield-csp</code>
                    <code className="block text-sm text-gray-300 font-mono">npm install</code>
                    <code className="block text-sm text-gray-300 font-mono">npm run dev</code>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 2. Add a domain & run a scan */}
            <section className="mb-12" id="configuration">
              <h2 className="text-2xl font-bold mb-2">2. Add a domain and run a scan</h2>
              <p className="text-gray-400 mb-4">
                From the dashboard, add one or more domains you want to protect, then run scans from the Scanner page.
                Scans are executed on the server and results are stored in PostgreSQL for dashboards and history.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-4">
                <li>Go to <code className="bg-white/5 px-1 rounded border border-white/10">/domains</code> and add a domain.</li>
                <li>Open <code className="bg-white/5 px-1 rounded border border-white/10">/scanner</code>, choose the domain, and click <strong>RUN SCAN</strong>.</li>
                <li>Review the grade, header breakdown, and recommendations.</li>
              </ul>
            </section>

            {/* 3. Integrate generated middleware */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2">3. Integrate generated middleware into your app</h2>
              <p className="text-gray-400 mb-4">
                Use the Code Generator to create security middleware for your framework. For Next.js App Router, paste
                the generated code into a <code className="bg-white/5 px-1 rounded border border-white/10">middleware.ts</code>{' '}
                file at the root of your app.
              </p>
              <Card className="bg-[#162a2e] border-[#224349]">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#224349]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">middleware.ts</span>
                      <span className="text-xs text-gray-500">Next.js App Router</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                      <code>{`import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paste the generated code from /codegen here.
// This example shows a simplified version of the nonce-based middleware:

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const requestHeaders = new Headers(request.headers);
  const cspHeader = \`
    default-src 'self';
    script-src 'self' 'nonce-\${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-\${nonce}';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self';
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  \`.replace(/\\s{2,}/g, ' ').trim();

  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);
  requestHeaders.set('X-Content-Type-Options', 'nosniff');
  requestHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
              <p className="text-sm text-gray-400 mt-4">
                For Express or generic Node.js backends, choose the corresponding option in{' '}
                <code className="bg-white/5 px-1 rounded border border-white/10">/codegen</code> and paste the generated
                middleware into your server (e.g. <code className="bg-white/5 px-1 rounded border border-white/10">app.use(securityMiddleware)</code>).
              </p>
            </section>

            {/* Pro Tip */}
            <Card className="bg-blue-500/10 border-blue-500/30 mb-12">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-400 mb-1">Pro Tip: Development Mode</p>
                    <p className="text-sm text-gray-300">
                      Always set <code className="bg-white/10 px-1 rounded">reportOnly: true</code> in your local development environment to avoid breaking your local workflows while fine-tuning policies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-[#224349]">
              <Link href="/docs" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                ← PREVIOUS
                <span className="text-white">Introduction</span>
              </Link>
              <Link href="/docs" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <span className="text-white">API Reference</span>
                →
              </Link>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-64 border-l border-[#224349] bg-[#0f2023] p-6 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* On This Page */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">ON THIS PAGE</p>
                <nav className="space-y-2">
                  <a href="#overview" className="block text-sm text-gray-400 hover:text-white transition-colors">
                    Overview
                  </a>
                  <a href="#install-sdk" className="block text-sm text-[#14b8a6] hover:text-[#0d9488] transition-colors">
                    Install SDK
                  </a>
                  <a href="#configuration" className="block text-sm text-gray-400 hover:text-white transition-colors">
                    Configuration
                  </a>
                  <a href="#best-practices" className="block text-sm text-gray-400 hover:text-white transition-colors">
                    Best Practices
                  </a>
                  <a href="#troubleshooting" className="block text-sm text-gray-400 hover:text-white transition-colors">
                    Troubleshooting
                  </a>
                </nav>
              </div>

              {/* Need Help */}
              <Card className="bg-[#162a2e] border-[#224349]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="h-5 w-5 text-[#07b6d5]" />
                    <p className="font-semibold text-sm">Need help?</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Join our community Discord or reach out to our support team for specialized assistance.
                  </p>
                  <Button className="w-full bg-[#07b6d5] hover:brightness-110 text-[#102023] text-sm font-bold">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#224349] bg-[#0f2023] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              ShieldCSP Technical Documentation v4.2.0
            </div>
            <div className="flex items-center gap-6">
              <Link href="https://github.com/yourusername/shieldcsp" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                GitHub
              </Link>
              <Link href="https://twitter.com" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                Twitter
              </Link>
              <Link href="/docs" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                Privacy
              </Link>
              <Link href="/docs" className="text-sm text-gray-400 hover:text-[#14b8a6] transition-colors">
                Cookies
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 ShieldCSP Cybersecurity Inc.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
