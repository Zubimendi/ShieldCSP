'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Bell, User, Filter, Calendar, ArrowLeft, ArrowRight, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Violation {
  id: string
  domainId: string
  directive: string
  blockedUri: string | null
  violatedDirective: string | null
  severity: string
  count: number
  firstSeenAt: Date | string
  lastSeenAt: Date | string
  domain: {
    id: string
    url: string
    name: string | null
  } | null
}

export default function ViolationsDashboardPage() {
  const [domainFilter, setDomainFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchViolations() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (severityFilter !== 'all') {
          params.set('severity', severityFilter);
        }
        if (domainFilter !== 'all') {
          params.set('domainId', domainFilter);
        }
        
        const res = await fetch(`/api/violations?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setViolations(data.violations || []);
        }
      } catch (error) {
        console.error('[Violations] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchViolations();
  }, [domainFilter, severityFilter, timeRange]);

  // Calculate stats from violations
  const totalViolations = violations.reduce((sum, v) => sum + v.count, 0);
  const uniquePatterns = violations.length;
  const topDirective = violations.reduce((acc, v) => {
    const dir = v.directive || v.violatedDirective || 'unknown';
    acc[dir] = (acc[dir] || 0) + v.count;
    return acc;
  }, {} as Record<string, number>);
  const topDirectiveName = Object.entries(topDirective).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const topDirectiveCount = topDirective[topDirectiveName] || 0;
  const blockedXss = violations.filter(v => v.severity === 'critical' || v.severity === 'high').reduce((sum, v) => sum + v.count, 0);
  
  // Top directives for chart
  const topDirectives = Object.entries(topDirective)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([directive, count]) => ({ directive, count }));
  
  const maxDirectiveCount = topDirectives[0]?.count || 1;

  // Generate frequency rows for heatmap (7 days x 24 hours)
  // This is a simplified visualization - in production, you'd use actual time-series data
  const frequencyRows = Array.from({ length: 7 }, () => 
    Array.from({ length: 24 }, () => Math.random() > 0.7)
  );

  return (
    <div className="min-h-screen bg-[#0f2023] text-white">
      {/* Header + Filters */}
      <div className="container mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Violations Dashboard</h1>
            <p className="text-gray-400 text-sm">Real-time monitoring and XSS threat intelligence.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 text-gray-200 text-xs">
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="prod">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-gray-200 text-xs">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-gray-200 text-xs">
                <SelectValue placeholder="Last 30 Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-1">TOTAL VIOLATIONS</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{loading ? '...' : totalViolations.toLocaleString()}</p>
                <span className="text-xs text-green-400">+12.4%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-1">UNIQUE PATTERNS</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{loading ? '...' : uniquePatterns}</p>
                <span className="text-xs text-green-400">+2.1%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-1">TOP DIRECTIVE</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-[#14b8a6]">{loading ? '...' : topDirectiveName}</p>
                <span className="text-xs text-red-400">-5.0%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-1">BLOCKED XSS</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{loading ? '...' : blockedXss.toLocaleString()}</p>
                <span className="text-xs text-green-400">+8.7%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Violation Frequency */}
          <Card className="lg:col-span-2 bg-[#162a2e] border-[#224349]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Violation Frequency</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-xs text-gray-500 mb-2 flex justify-between">
                <span>Mon</span>
                <span>Less</span>
              </div>
              <div className="space-y-1">
                {frequencyRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((value, colIndex) => (
                      <div
                        key={colIndex}
                        className={`h-3 w-3 rounded-sm ${
                          value ? 'bg-[#14b8a6]' : 'bg-white/5'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>Wed</span>
                <span>More</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Pattern Recognition */}
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">AI Pattern Recognition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 font-semibold mb-1">ANOMALY DETECTED</p>
                <p className="text-xs text-gray-300 mb-3">
                  High volume of <code className="bg-white/10 px-1 rounded">eval()</code> calls detected from{' '}
                  <span className="text-white font-medium">auth.shield.io</span>.
                </p>
                <Button size="sm" className="bg-[#14b8a6] hover:bg-[#0d9488] text-white text-xs">
                  Apply Policy Fix
                </Button>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-400 font-semibold mb-1">NEW TRUSTED SOURCE?</p>
                <p className="text-xs text-gray-300 mb-3">
                  240 violations from <span className="text-white font-medium">cdn.metrics.net</span>. Suggesting inclusion in{' '}
                  <code className="bg-white/10 px-1 rounded">img-src</code>.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-slate-900 text-xs hover:bg-white/80"
                >
                  Approve Source
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Violated Directives */}
          <Card className="lg:col-span-2 bg-[#162a2e] border-[#224349]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top Violated Directives</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              {topDirectives.map((item) => (
                <div key={item.directive}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-gray-300">{item.directive}</span>
                    <span className="text-gray-400">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#14b8a6] rounded-full"
                      style={{ width: `${(item.count / maxDirectiveCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Severity Distribution */}
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    className="text-white/10"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${(82 / 100) * 301.6} 301.6`}
                    className="text-[#14b8a6]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400 mb-1">CRITICAL/HIGH</span>
                  <span className="text-2xl font-bold">
                    82<span className="text-sm">%</span>
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-400 w-full">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Critical
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" /> High
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#14b8a6]" /> Medium/Low
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Violations */}
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Recent Violations</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2"
            >
              Export CSV
              <ArrowRightCircle className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="rounded-md border border-[#224349] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400 text-xs">TIMESTAMP</TableHead>
                    <TableHead className="text-gray-400 text-xs">DOMAIN</TableHead>
                    <TableHead className="text-gray-400 text-xs">DIRECTIVE</TableHead>
                    <TableHead className="text-gray-400 text-xs">SEVERITY</TableHead>
                    <TableHead className="text-gray-400 text-xs">STATUS</TableHead>
                    <TableHead className="text-gray-400 text-xs text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                        Loading violations...
                      </TableCell>
                    </TableRow>
                  ) : violations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                        No violations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    violations.slice(0, 10).map((v) => {
                      const timestamp = new Date(v.lastSeenAt).toLocaleString();
                      const directive = v.directive || v.violatedDirective || 'unknown';
                      const severity = v.severity.toUpperCase();
                      
                      return (
                        <TableRow key={v.id} className="border-white/10 hover:bg.white/5">
                          <TableCell className="text-xs text-gray-300">{timestamp}</TableCell>
                          <TableCell className="text-xs text-gray-300">{v.domain?.url || 'Unknown'}</TableCell>
                          <TableCell className="text-xs text-[#14b8a6] font-medium">{directive}</TableCell>
                          <TableCell className="text-xs">
                            <Badge
                              className={`text-xs ${
                                severity === 'CRITICAL'
                                  ? 'bg-red-600/30 text-red-400 border-red-500/40'
                                  : severity === 'HIGH'
                                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                                  : severity === 'MEDIUM'
                                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              }`}
                            >
                              {severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <span className="inline-flex items-center gap-1 text-gray-300">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              Blocked ({v.count}x)
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-right text-gray-400">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                              ···
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <span>SHOWING 1-{Math.min(10, violations.length)} OF {totalViolations.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#224349] bg-[#0f2023] mt-8">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-400">
          <span>ShieldCSP v2.4.0</span>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-[#14b8a6]">
              Documentation
            </Link>
            <Link href="/dashboard" className="hover:text-[#14b8a6]">
              API Status
            </Link>
            <Link href="/docs" className="hover:text-[#14b8a6]">
              Privacy Policy
            </Link>
          </div>
          <span>© 2024 ShieldCSP. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

