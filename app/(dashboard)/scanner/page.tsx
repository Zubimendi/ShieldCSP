'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Link2, Zap, Bookmark, Download, Eye, ChevronDown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Domain {
  id: string
  url: string
  name: string | null
}

interface ScanResult {
  id: string
  overallGrade: string | null
  overallScore: number | null
  status: string
  scannedAt: Date | string | null
}

export default function ScannerPage() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [grade, setGrade] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDomains() {
      try {
        const res = await fetch('/api/domains');
        if (res.ok) {
          const data = await res.json();
          setDomains(data.domains || []);
        }
      } catch (err) {
        console.error('[Scanner] Error fetching domains:', err);
      }
    }
    fetchDomains();
  }, []);

  const addLog = (time: string, level: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, `[${timestamp}] ${level} ${message}`]);
  };

  const runScan = async () => {
    if (!url || scanning) return;
    
    setScanning(true);
    setScanComplete(false);
    setConsoleLogs([]);
    setGrade(null);
    setScore(null);
    setScanResult(null);
    setError(null);

    try {
      // Find matching domain
      const matchingDomain = domains.find(d => {
        const domainUrl = d.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const inputUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        return domainUrl === inputUrl || domainUrl.includes(inputUrl) || inputUrl.includes(domainUrl);
      });

      if (!matchingDomain) {
        setError('Domain not found. Please add the domain first in the Domains page.');
        addLog(new Date().toLocaleTimeString(), 'ERROR', 'Domain not found in your account. Add it in the Domains page first.');
        setScanning(false);
        return;
      }

      addLog(new Date().toLocaleTimeString(), 'INFO', 'Initializing security audit engine...');
      addLog(new Date().toLocaleTimeString(), 'INFO', `Target domain: ${matchingDomain.url}`);
      addLog(new Date().toLocaleTimeString(), 'INFO', 'Starting scan...');

      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainId: matchingDomain.id,
          scanType: 'full',
          async: false,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Scan failed');
      }

      const data = await res.json();
      const scan = data.scan;

      addLog(new Date().toLocaleTimeString(), 'SUCCESS', 'Scan completed successfully');
      
      setScanResult(scan);
      setGrade(scan.overallGrade || null);
      setScore(scan.overallScore || null);
      setScanComplete(true);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to run scan';
      setError(errorMsg);
      addLog(new Date().toLocaleTimeString(), 'ERROR', errorMsg);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2023] p-8 text-white">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-[#8fc3cc]">
            <Link href="/dashboard" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/scanner" className="hover:text-white">Scanner</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Manual Security Header Scanner</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manual Security Header Scanner</h1>
          <p className="text-gray-400">
            Enter a target URL to perform a high-precision CSP and XSS vulnerability assessment using our proprietary detection engine.
          </p>
        </div>

        {/* URL Input */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => e.key === 'Enter' && runScan()}
                className="pl-12 pr-4 bg-[#102023] border-[#224349] text-white placeholder:text-[#8fc3cc] h-14 text-lg"
              />
              {/* Domain suggestions based on user's domains */}
              {showSuggestions && url && domains.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-[#224349] bg-[#102023] shadow-lg max-h-60 overflow-y-auto">
                  {domains
                    .filter((d) => {
                      const q = url.replace(/^https?:\/\//, '').toLowerCase();
                      return d.url.toLowerCase().includes(q) || (d.name || '').toLowerCase().includes(q);
                    })
                    .slice(0, 8)
                    .map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setUrl(d.url);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#183034] flex flex-col"
                      >
                        <span className="text-white font-medium">{d.url}</span>
                        {d.name && <span className="text-xs text-gray-400">{d.name}</span>}
                      </button>
                    ))}
                </div>
              )}
            </div>
            <Button
              onClick={runScan}
              disabled={scanning || !url}
              className="bg-[#07b6d5] hover:brightness-110 text-[#102023] h-14 px-8 text-lg font-bold shadow-lg shadow-[#07b6d5]/10"
            >
              <Zap className="mr-2 h-5 w-5" />
              RUN SCAN
            </Button>
          </div>

          {/* Advanced Configuration */}
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="advanced" className="border-[#224349]">
              <AccordionTrigger className="text-sm text-gray-400 hover:text-white">
                ADVANCED SCAN CONFIGURATION
                <ChevronDown className="h-4 w-4" />
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-gray-400">Advanced configuration options will be available here.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Console Output */}
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-medium">Console v2.4.0</span>
                </div>
              </div>
              <div className="p-4 h-[400px] overflow-y-auto font-mono text-sm custom-scrollbar">
                {consoleLogs.length === 0 ? (
                  <p className="text-gray-500">Waiting for scan to start...</p>
                ) : (
                  <div className="space-y-1">
                    {consoleLogs.map((log, index) => {
                      const parts = log.split(' ');
                      const time = parts[0];
                      const level = parts[1];
                      const message = parts.slice(2).join(' ');
                      
                      let color = 'text-gray-400';
                      if (level === 'SUCCESS') color = 'text-green-400';
                      else if (level === 'WARNING') color = 'text-yellow-400';
                      else if (level === 'ANALYZE') color = 'text-blue-400';
                      else if (level === 'INFO') color = 'text-gray-300';

                      return (
                        <div key={index} className={color}>
                          <span className="text-gray-600">{time}</span> <span className="font-semibold">{level}</span> {message}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Summary */}
          <div className="space-y-6">
            {/* Security Score */}
            <Card className="bg-[#162a2e] border-[#224349]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-white/10"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${((score ?? 0) / 100) * 251.2} 251.2`}
                            className="text-[#14b8a6]"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">{grade || 'N/A'}</span>
                          <span className="text-xs text-gray-400">GRADE</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">SECURITY SCORE:</p>
                        <p className="text-2xl font-bold">{score !== null ? `${score}/100` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium mb-1">Analysis Summary</p>
                        <p className="text-xs text-gray-400">
                          {scanComplete ? 'Scan completed successfully.' : scanning ? 'Scan in progress...' : 'Ready to scan.'}
                        </p>
                        {error && (
                          <p className="text-xs text-red-400 mt-1">{error}</p>
                        )}
                      </div>
                      {scanResult && (
                        <Button 
                          className="bg-[#14b8a6] hover:bg-[#0d9488] text-white"
                          onClick={() => window.location.href = `/domains/${domains.find(d => d.url === url)?.id || ''}`}
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          VIEW DOMAIN
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Status */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span className="text-sm font-semibold text-green-400">PASSED</span>
                    </div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-gray-400">Headers</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-red-400"></div>
                      <span className="text-sm font-semibold text-red-400">MISSING</span>
                    </div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-gray-400">Vital</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1 border-[#224349] bg-[#224349] text-[#8fc3cc] hover:bg-[#2b545c]">
                    <Download className="mr-2 h-4 w-4" />
                    DOWNLOAD REPORT
                  </Button>
                  <Button variant="outline" className="flex-1 border-[#224349] bg-[#224349] text-[#8fc3cc] hover:bg-[#2b545c]">
                    <Eye className="mr-2 h-4 w-4" />
                    VIEW RAW HEADERS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Feature */}
            <Card className="bg-[#162a2e] border-[#224349]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Continuous Security Monitoring</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Don't just scan once. ShieldCSP can monitor your entire domain inventory every hour and alert you the moment a CSP policy is broken or an XSS vulnerability is introduced.
                    </p>
                    <Link href="/pricing" className="text-[#14b8a6] hover:text-[#0d9488] text-sm font-medium inline-flex items-center gap-1">
                      Upgrade to Pro →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
