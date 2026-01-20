'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Download, 
  Copy, 
  CheckCircle2,
  Shield,
  Settings
} from 'lucide-react';
import type { Framework, CspType } from '@/lib/types';

export default function CodeGenPage() {
  const [framework, setFramework] = useState<Framework>('nextjs-app');
  const [cspType, setCspType] = useState<CspType>('nonce');
  const [enableHsts, setEnableHsts] = useState(true);
  const [hstsMaxAge, setHstsMaxAge] = useState(31536000);
  const [enableFrameOptions, setEnableFrameOptions] = useState(true);
  const [frameOptions, setFrameOptions] = useState<'DENY' | 'SAMEORIGIN'>('DENY');
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    if (framework === 'nextjs-app') {
      return `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate nonce for this request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
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
    block-all-mixed-content;
  \`.replace(/\\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    cspHeader
  );
  ${enableHsts ? `requestHeaders.set(
    'Strict-Transport-Security',
    'max-age=${hstsMaxAge}; includeSubDomains; preload'
  );` : ''}
  ${enableFrameOptions ? `requestHeaders.set(
    'X-Frame-Options',
    '${frameOptions}'
  );` : ''}
  requestHeaders.set(
    'X-Content-Type-Options',
    'nosniff'
  );
  requestHeaders.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );
  requestHeaders.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};`;
    } else if (framework === 'nextjs-pages') {
      return `import { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';

export function middleware(req: NextApiRequest, res: NextApiResponse) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
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

  res.setHeader('Content-Security-Policy', cspHeader);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  ${enableHsts ? `res.setHeader(
    'Strict-Transport-Security',
    'max-age=${hstsMaxAge}; includeSubDomains'
  );` : ''}
  ${enableFrameOptions ? `res.setHeader('X-Frame-Options', '${frameOptions}');` : ''}
}`;
    } else {
      return `// Generic Express.js middleware
const express = require('express');
const app = express();

app.use((req, res, next) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
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

  res.setHeader('Content-Security-Policy', cspHeader);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  ${enableHsts ? `res.setHeader(
    'Strict-Transport-Security',
    'max-age=${hstsMaxAge}; includeSubDomains'
  );` : ''}
  ${enableFrameOptions ? `res.setHeader('X-Frame-Options', '${frameOptions}');` : ''}
  
  // Make nonce available to templates
  res.locals.nonce = nonce;
  next();
});`;
    }
  };

  const code = generateCode();
  const filename = framework === 'nextjs-app' ? 'middleware.ts' : 
                   framework === 'nextjs-pages' ? 'middleware.ts' : 
                   'security-headers.js';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0f2023] p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Security Headers Code Generator</h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Design CSP and security header middleware that matches ShieldCSP&apos;s grading engine, then copy or download
            the code for your framework.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Configuration */}
          <Card className="bg-[#162a2e] border-[#224349] shadow-xl shadow-black/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#07b6d5]" />
                <span>Configuration</span>
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Choose your framework and hardening options. Changes update the generated code in real time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Framework */}
              <div className="space-y-2">
                <Label className="text-xs text-[#8fc3cc] uppercase tracking-wider">Framework</Label>
                <Select value={framework} onValueChange={(v) => setFramework(v as Framework)}>
                  <SelectTrigger className="bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc]">
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#102023] border-[#224349] text-white">
                    <SelectItem value="nextjs-app">Next.js App Router</SelectItem>
                    <SelectItem value="nextjs-pages">Next.js Pages Router</SelectItem>
                    <SelectItem value="express">Express.js</SelectItem>
                    <SelectItem value="generic">Generic Node.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CSP Type */}
              <div className="space-y-2">
                <Label className="text-xs text-[#8fc3cc] uppercase tracking-wider">CSP Strategy</Label>
                <Select value={cspType} onValueChange={(v) => setCspType(v as CspType)}>
                  <SelectTrigger className="bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc]">
                    <SelectValue placeholder="Select CSP mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#102023] border-[#224349] text-white">
                    <SelectItem value="nonce">Nonce-based</SelectItem>
                    <SelectItem value="hash">Hash-based</SelectItem>
                    <SelectItem value="strict-dynamic">Strict-dynamic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* HSTS */}
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-xs text-[#8fc3cc] uppercase tracking-wider">
                    Strict-Transport-Security (HSTS)
                  </Label>
                  <p className="text-xs text-gray-400">
                    Force HTTPS connections and harden downgrade protection.
                  </p>
                </div>
                <Checkbox
                  checked={enableHsts}
                  onCheckedChange={(checked) => setEnableHsts(checked as boolean)}
                />
              </div>
              {enableHsts && (
                <div className="space-y-2 pl-6">
                  <Label className="text-xs text-[#8fc3cc] uppercase tracking-wider">Max Age (seconds)</Label>
                  <Input
                    type="number"
                    value={hstsMaxAge}
                    onChange={(e) => setHstsMaxAge(parseInt(e.target.value || '0', 10))}
                    className="bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc]"
                  />
                </div>
              )}

              {/* X-Frame-Options */}
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label className="text-xs text-[#8fc3cc] uppercase tracking-wider">X-Frame-Options</Label>
                  <p className="text-xs text-gray-400">
                    Prevent clickjacking by controlling who can frame your site.
                  </p>
                </div>
                <Checkbox
                  checked={enableFrameOptions}
                  onCheckedChange={(checked) => setEnableFrameOptions(checked as boolean)}
                />
              </div>
              {enableFrameOptions && (
                <div className="space-y-2 pl-6">
                  <Label className="text-xs text-[#8fc3cc] uppercase tracking-wider">Frame Options</Label>
                  <Select value={frameOptions} onValueChange={(v) => setFrameOptions(v as 'DENY' | 'SAMEORIGIN')}>
                    <SelectTrigger className="bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#102023] border-[#224349] text-white">
                      <SelectItem value="DENY">DENY - No framing</SelectItem>
                      <SelectItem value="SAMEORIGIN">SAMEORIGIN - Same origin only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-4 border-t border-[#224349]">
                <Badge variant="outline" className="flex items-center gap-2 w-fit border-[#224349] text-[#8fc3cc]">
                  <Shield className="h-3 w-3 text-[#07b6d5]" />
                  Grade: A+ (target)
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Code Preview */}
          <Card className="bg-[#162a2e] border-[#224349] shadow-xl shadow-black/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-[#07b6d5]" />
                    <span>Generated Code</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    {filename}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="border-[#224349] bg-[#0f2023] text-[#8fc3cc] hover:bg-[#1b2a30]"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="border-[#224349] bg-[#07b6d5]/10 text-[#8fc3cc] hover:bg-[#07b6d5]/20"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={code}
                  readOnly
                  className="font-mono text-sm h-[600px] resize-none bg-[#0f2023] border-[#224349] text-[#e5e7eb] leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardHeader>
            <CardTitle>Implementation Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Copy or download the generated code.</li>
              {framework === 'nextjs-app' && (
                <>
                  <li>
                    Save the file as{' '}
                    <code className="bg-[#102023] px-1 rounded border border-[#224349]">middleware.ts</code> in
                    your Next.js project root.
                  </li>
                  <li>Deploy, then verify headers using the ShieldCSP Scanner.</li>
                  <li>
                    Use the injected{' '}
                    <code className="bg-[#102023] px-1 rounded border border-[#224349]">nonce</code> when rendering inline
                    scripts.
                  </li>
                </>
              )}
              {framework === 'nextjs-pages' && (
                <>
                  <li>
                    Save the file and import the middleware into your API routes or custom server configuration.
                  </li>
                </>
              )}
              <li>Re-scan the domain from the Scanner page to confirm your security grade improves.</li>
              <li>Monitor future regressions from the Violations and Audit Logs dashboards.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
