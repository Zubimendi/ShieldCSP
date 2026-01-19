'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Download, 
  RefreshCw,
  Bell,
  Search,
  User,
  LayoutDashboard,
  Eye,
  AlertTriangle,
  Settings,
  Clock
} from 'lucide-react';

interface SecurityScoreEntry {
  headerName: string;
  score: number | null;
  grade: string | null;
  isPresent: boolean;
}

interface DomainDetail {
  id: string;
  url: string;
  name: string | null;
  lastScannedAt: string | null;
  latestScan: {
    id: string;
    overallGrade: string | null;
    overallScore: number | null;
    scannedAt: string | null;
    status: string;
    securityScores: SecurityScoreEntry[];
  } | null;
}

export default function DomainAnalysisPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: domainId } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [domainData, setDomainData] = useState<DomainDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchDomain() {
      try {
        setLoading(true);
        const res = await fetch(`/api/domains/${domainId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Domain not found');
          }
          throw new Error('Failed to load domain data');
        }
        const data = await res.json();
        const domain = data.domain;
        
        const detail: DomainDetail = {
          id: domain.id,
          url: domain.url,
          name: domain.name,
          lastScannedAt: domain.latestScan?.scannedAt || null,
          latestScan: domain.latestScan
            ? {
                id: domain.latestScan.id,
                overallGrade: domain.latestScan.overallGrade,
                overallScore: domain.latestScan.overallScore,
                scannedAt: domain.latestScan.scannedAt,
                status: domain.latestScan.status,
                securityScores: (domain.latestScan.securityScores || []).map((s: SecurityScoreEntry) => ({
                  headerName: s.headerName,
                  score: s.score,
                  grade: s.grade,
                  isPresent: s.isPresent,
                })),
              }
            : null,
        };
        setDomainData(detail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load domain');
      } finally {
        setLoading(false);
      }
    }
    fetchDomain();
  }, [domainId]);

  const latestScan = domainData?.latestScan || null;
  const grade = latestScan?.overallGrade || '?';
  const score = latestScan?.overallScore ?? null;
  const displayName = domainData?.name || domainData?.url || 'Unknown domain';
  const lastScannedText = latestScan?.scannedAt
    ? new Date(latestScan.scannedAt).toLocaleString()
    : 'Never scanned';

  const handleTriggerScan = async () => {
    if (!domainData) return;
    try {
      setLoading(true);
      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId: domainData.id, scanType: 'full', async: false }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to start scan');
      }
      // Refresh domain data
      const domainRes = await fetch(`/api/domains/${domainId}`);
      if (domainRes.ok) {
        const domainData = await domainRes.json();
        const domain = domainData.domain;
        setDomainData({
          id: domain.id,
          url: domain.url,
          name: domain.name,
          lastScannedAt: domain.latestScan?.scannedAt || null,
          latestScan: domain.latestScan
            ? {
                id: domain.latestScan.id,
                overallGrade: domain.latestScan.overallGrade,
                overallScore: domain.latestScan.overallScore,
                scannedAt: domain.latestScan.scannedAt,
                status: domain.latestScan.status,
                securityScores: (domain.latestScan.securityScores || []).map((s: SecurityScoreEntry) => ({
                  headerName: s.headerName,
                  score: s.score,
                  grade: s.grade,
                  isPresent: s.isPresent,
                })),
              }
            : null,
        });
      }
    } catch (err) {
      console.error('[Domain] Failed to trigger scan', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    if (!domainData) return;
    try {
      const res = await fetch(`/api/domains/${domainId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch domain report');
      }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${displayName.replace(/[^a-z0-9]+/gi, '-')}-report.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[Domain] Failed to export report', err);
    }
  };

  if (loading && !domainData) {
    return (
      <div className="min-h-screen bg-[#0f2023] text-white flex items-center justify-center">
        <span className="text-gray-400">Loading domain…</span>
      </div>
    );
  }

  if (error || !domainData) {
    return (
      <div className="min-h-screen bg-[#0f2023] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Domain not found</h1>
          <p className="text-gray-400">{error || 'The requested domain could not be found.'}</p>
          <Button
            onClick={() => router.push('/domains')}
            className="bg-[#07b6d5] hover:brightness-110 text-[#102023] font-semibold"
          >
            Back to Domains
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f2023] text-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-[#224349] bg-[#0f2023]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#07b6d5] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ShieldCSP</span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/dashboard" className="text-[#8fc3cc] font-medium">Dashboard</a>
                <a href="/domains" className="text-gray-400 hover:text-white transition-colors">Inventory</a>
                <a href="/policies" className="text-gray-400 hover:text-white transition-colors">Policies</a>
                <a href="/violations" className="text-gray-400 hover:text-white transition-colors">Reports</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search domains..."
                  className="w-64 bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-[#14b8a6] flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Header Section */}
      <div className="border-b border-[#224349] bg-[#0f2023]">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-[#07b6d5] flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{grade}</span>
                </div>
                <span className="text-xs text-gray-400 mt-2">GRADE</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{displayName}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {latestScan ? latestScan.status : 'No scans yet'}
                  </Badge>
                  <span className="text-sm text-gray-400">Last scanned: {lastScannedText}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExportReport}
                className="border-[#224349] bg-[#224349] text-[#8fc3cc] hover:bg-[#2b545c]"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button
                onClick={handleTriggerScan}
                disabled={loading}
                className="bg-[#07b6d5] hover:brightness-110 text-[#102023] font-semibold shadow-lg shadow-[#07b6d5]/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {loading ? 'Scanning…' : 'Trigger Manual Scan'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-b border-[#224349] bg-[#0f2023]">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'scans', label: 'Scans', icon: Eye },
              { id: 'violations', label: 'Violations', icon: AlertTriangle },
              { id: 'configuration', label: 'Configuration', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-[#07b6d5] text-[#07b6d5]'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Main Content: simple, honest summary from latest scan */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#162a2e] border-[#224349]">
                <CardHeader>
                  <CardTitle className="text-white">Latest Scan Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {latestScan ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-300">
                        Score:{' '}
                        <span className="font-semibold text-white">
                          {score !== null ? `${score}/100` : 'N/A'}
                        </span>{' '}
                        ({grade})
                      </p>
                      <div className="w-full bg-[#224349] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-[#07b6d5] rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, score || 0))}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        Scanned at {lastScannedText}
                      </p>
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-white mb-2">
                          Headers analyzed
                        </h3>
                        <div className="space-y-2">
                          {latestScan.securityScores.length === 0 ? (
                            <p className="text-xs text-gray-400">
                              No per-header details stored for this scan.
                            </p>
                          ) : (
                            latestScan.securityScores.map((h, index) => (
                              <div
                                key={`${h.headerName}-${index}`}
                                className="flex items-center justify-between text-xs text-gray-300"
                              >
                                <span>{h.headerName}</span>
                                <span>
                                  {h.grade || '-'} ({h.score ?? 0})
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No scans yet for this domain. Trigger a manual scan to see results.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'scans' && (
          <ScansTabContent domainId={domainId} />
        )}

        {activeTab === 'violations' && (
          <ViolationsTabContent domainId={domainId} />
        )}

        {activeTab === 'configuration' && (
          <ConfigurationTabContent domainData={domainData} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#224349] bg-[#0f2023] mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              ShieldCSP – Open Source Security Headers & CSP Lab
            </div>
            <div className="flex items-center gap-6">
              <a href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="/codegen" className="text-sm text-gray-400 hover:text-white transition-colors">
                API Keys
              </a>
              <a href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 ShieldCSP Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface Scan {
  id: string;
  scannedAt: string | null;
  status: string;
  overallGrade: string | null;
  overallScore: number | null;
  scanType: string | null;
}

// Scans Tab Component
function ScansTabContent({ domainId }: { domainId: string }) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScans() {
      try {
        const res = await fetch(`/api/scans?domainId=${domainId}&limit=50`);
        if (res.ok) {
          const data = await res.json();
          setScans(data.scans || []);
        }
      } catch (err) {
        console.error('[Scans Tab] Failed to fetch scans:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScans();
  }, [domainId]);

  if (loading) {
    return <div className="text-gray-400">Loading scans...</div>;
  }

  return (
    <Card className="bg-[#162a2e] border-[#224349]">
      <CardHeader>
        <CardTitle className="text-white">Scan History</CardTitle>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <p className="text-sm text-gray-400">No scans found for this domain.</p>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="border border-[#224349] rounded-lg p-4 bg-[#0f2023]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-white font-medium">
                      {scan.scannedAt ? new Date(scan.scannedAt).toLocaleString() : 'Unknown time'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {scan.status === 'completed' && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Completed
                      </Badge>
                    )}
                    {scan.status === 'failed' && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        Failed
                      </Badge>
                    )}
                    {scan.status === 'running' && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Running
                      </Badge>
                    )}
                    {scan.overallGrade && (
                      <Badge className="bg-[#07b6d5]/20 text-[#07b6d5] border-[#07b6d5]/30">
                        {scan.overallGrade}
                      </Badge>
                    )}
                  </div>
                </div>
                {scan.overallScore !== null && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Score</span>
                      <span>{scan.overallScore}/100</span>
                    </div>
                    <div className="w-full bg-[#224349] rounded-full h-1.5">
                      <div
                        className="bg-[#07b6d5] h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, scan.overallScore))}%` }}
                      />
                    </div>
                  </div>
                )}
                {scan.scanType && (
                  <p className="text-xs text-gray-500 mt-2">Type: {scan.scanType}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface Violation {
  id: string;
  violatedDirective: string | null;
  blockedUri: string | null;
  severity: string | null;
  lastSeenAt: string | null;
}

// Violations Tab Component
function ViolationsTabContent({ domainId }: { domainId: string }) {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchViolations() {
      try {
        const res = await fetch(`/api/violations?domainId=${domainId}&limit=50`);
        if (res.ok) {
          const data = await res.json();
          setViolations(data.violations || []);
        }
      } catch (err) {
        console.error('[Violations Tab] Failed to fetch violations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchViolations();
  }, [domainId]);

  if (loading) {
    return <div className="text-gray-400">Loading violations...</div>;
  }

  return (
    <Card className="bg-[#162a2e] border-[#224349]">
      <CardHeader>
        <CardTitle className="text-white">CSP Violations</CardTitle>
      </CardHeader>
      <CardContent>
        {violations.length === 0 ? (
          <p className="text-sm text-gray-400">No violations found for this domain.</p>
        ) : (
          <div className="space-y-4">
            {violations.map((violation) => (
              <div
                key={violation.id}
                className="border border-[#224349] rounded-lg p-4 bg-[#0f2023]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-white font-medium">
                        {violation.violatedDirective || 'Unknown directive'}
                      </span>
                    </div>
                    {violation.blockedUri && (
                      <p className="text-xs text-gray-400 font-mono break-all">
                        Blocked: {violation.blockedUri}
                      </p>
                    )}
                  </div>
                  {violation.severity && (
                    <Badge
                      className={
                        violation.severity === 'high'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : violation.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }
                    >
                      {violation.severity}
                    </Badge>
                  )}
                </div>
                {violation.lastSeenAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last seen: {new Date(violation.lastSeenAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Configuration Tab Component
function ConfigurationTabContent({ domainData }: { domainData: DomainDetail | null }) {
  if (!domainData) {
    return <div className="text-gray-400">Loading configuration...</div>;
  }

  return (
    <Card className="bg-[#162a2e] border-[#224349]">
      <CardHeader>
        <CardTitle className="text-white">Domain Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider">URL</label>
          <p className="text-sm text-white mt-1 font-mono">{domainData.url}</p>
        </div>
        {domainData.name && (
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">Name</label>
            <p className="text-sm text-white mt-1">{domainData.name}</p>
          </div>
        )}
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider">Status</label>
          <p className="text-sm text-white mt-1">
            {domainData.latestScan ? 'Active' : 'No scans yet'}
          </p>
        </div>
        {domainData.lastScannedAt && (
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">Last Scanned</label>
            <p className="text-sm text-white mt-1">
              {new Date(domainData.lastScannedAt).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
