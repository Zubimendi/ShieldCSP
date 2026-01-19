'use client';

import { useState } from 'react';
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

const frequencyRows = Array.from({ length: 3 }).map((_, row) =>
  Array.from({ length: 32 }).map((__, col) => (row === 1 && col > 8 && col < 24 ? 1 : Math.random() > 0.85 ? 1 : 0)),
);

const topDirectives = [
  { directive: 'script-src', count: 4290 },
  { directive: 'style-src', count: 2105 },
  { directive: 'frame-ancestors', count: 1080 },
  { directive: 'img-src', count: 840 },
];

const recentViolations = [
  {
    timestamp: '2023-11-07 14:22:15',
    domain: 'api.shield.io',
    directive: 'script-src',
    severity: 'CRITICAL',
    status: 'Blocked',
  },
  {
    timestamp: '2023-11-07 14:18:42',
    domain: 'assets.shield.io',
    directive: 'img-src',
    severity: 'HIGH',
    status: 'Report-only',
  },
  {
    timestamp: '2023-11-07 13:55:01',
    domain: 'metrics.ext.com',
    directive: 'connect-src',
    severity: 'MEDIUM',
    status: 'Blocked',
  },
  {
    timestamp: '2023-11-07 13:42:10',
    domain: 'static.shield.io',
    directive: 'font-src',
    severity: 'INFO',
    status: 'Report-only',
  },
];

export default function ViolationsDashboardPage() {
  const [domainFilter, setDomainFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="min-h-screen bg-[#0f2023] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-[#224349] bg-[#0f2023]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#07b6d5] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ShieldCSP</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Policies
                </Link>
                <Link href="/violations" className="text-sm text-[#07b6d5] border-b-2 border-[#07b6d5] pb-1">
                  Intelligence
                </Link>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Reports
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="search"
                  placeholder="Search incidents..."
                  className="w-72 bg-white/5 border border-white/10 rounded-full px-10 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header + Filters */}
      <div className="container mx-auto px-6 pt-8">
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
                <p className="text-2xl font-bold">12,482</p>
                <span className="text-xs text-green-400">+12.4%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-1">UNIQUE PATTERNS</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">156</p>
                <span className="text-xs text-green-400">+2.1%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-1">TOP DIRECTIVE</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-[#14b8a6]">script-src</p>
                <span className="text-xs text-red-400">-5.0%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#162a2e] border-[#224349]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 mb-1">BLOCKED XSS</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">842</p>
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
                      style={{ width: `${(item.count / 4290) * 100}%` }}
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
                  {recentViolations.map((v) => (
                    <TableRow key={v.timestamp} className="border-white/10 hover:bg.white/5">
                      <TableCell className="text-xs text-gray-300">{v.timestamp}</TableCell>
                      <TableCell className="text-xs text-gray-300">{v.domain}</TableCell>
                      <TableCell className="text-xs text-[#14b8a6] font-medium">{v.directive}</TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          className={`text-xs ${
                            v.severity === 'CRITICAL'
                              ? 'bg-red-600/30 text-red-400 border-red-500/40'
                              : v.severity === 'HIGH'
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                              : v.severity === 'MEDIUM'
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}
                        >
                          {v.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            v.status === 'Blocked' ? 'text-red-400' : 'text-gray-300'
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          {v.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-right text-gray-400">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                          ···
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <span>SHOWING 1-10 OF 12,482</span>
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
            <Link href="#" className="hover:text-[#14b8a6]">
              API Status
            </Link>
            <Link href="#" className="hover:text-[#14b8a6]">
              Privacy Policy
            </Link>
          </div>
          <span>© 2024 ShieldCSP. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

