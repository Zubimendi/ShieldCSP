'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Download, 
  RefreshCw,
  LayoutDashboard,
  Eye,
  AlertTriangle,
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Code,
  Equal,
  Bell,
  Search,
  User
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

// Security header scores data
const securityScores = [
  {
    title: 'CSP Strength',
    status: 'STRONG',
    statusColor: 'text-green-400',
    icon: CheckCircle2,
    iconColor: 'text-green-400',
    description: 'Comprehensive script and style source definitions found.',
    progress: 95,
    progressColor: 'bg-green-500',
  },
  {
    title: 'HSTS Status',
    status: 'ACTIVE',
    statusColor: 'text-green-400',
    icon: CheckCircle2,
    iconColor: 'text-green-400',
    value: 'max-age=63072000; includeSubDomains; preload',
    progress: 100,
    progressColor: 'bg-green-500',
  },
  {
    title: 'XSS Protection',
    status: 'DEPRECATED',
    statusColor: 'text-orange-400',
    icon: AlertCircle,
    iconColor: 'text-orange-400',
    description: 'Consider modern CSP alternative: Trusted Types.',
    progress: 60,
    progressColor: 'bg-orange-500',
  },
  {
    title: 'Cookie Security',
    status: 'SECURE',
    statusColor: 'text-green-400',
    icon: CheckCircle2,
    iconColor: 'text-green-400',
    value: 'SameSite=Lax; Secure; HttpOnly flags present.',
    progress: 100,
    progressColor: 'bg-green-500',
  },
];

// Header analysis data
const headerAnalysis = [
  {
    header: 'Content-Security-Policy',
    status: 'active',
    statusIcon: CheckCircle2,
    statusColor: 'text-green-400',
    description: 'Policy is active and enforcing script restrictions.',
    expanded: true,
    issue: {
      found: true,
      text: "Presence of 'unsafe-inline' in script-src directive allowing potential XSS.",
      highlight: "'unsafe-inline'",
    },
    recommendation: 'Move inline scripts to external files or use a nonce-based policy to maintain security.',
    suggestedFix: "script-src 'self' https://apis.google.com 'nonce-EDNkd0Lrq7e'",
  },
  {
    header: 'Strict-Transport-Security',
    status: 'warning',
    statusIcon: AlertCircle,
    statusColor: 'text-orange-400',
    description: 'HSTS is active but missing recommended preload flag.',
    expanded: false,
  },
  {
    header: 'X-Content-Type-Options',
    status: 'active',
    statusIcon: CheckCircle2,
    statusColor: 'text-green-400',
    description: "Successfully set to 'nosniff' to prevent MIME-sniffing.",
    expanded: false,
  },
];

// Recent activity data
const recentActivity = [
  {
    type: 'success',
    icon: CheckCircle2,
    time: '14:20 PM',
    message: 'Auto-scan completed - No new issues',
  },
  {
    type: 'warning',
    icon: AlertCircle,
    time: '09:15 AM',
    message: 'Policy update detected - script-src modified',
  },
  {
    type: 'error',
    icon: AlertTriangle,
    time: 'Yesterday',
    message: 'High violation spike - 42 blocked scripts',
  },
];

// 30-day score trend data
const scoreTrend = [
  { date: 'MAY 1', score: 82 },
  { date: 'MAY 5', score: 84 },
  { date: 'MAY 10', score: 85 },
  { date: 'MAY 15', score: 87 },
  { date: 'MAY 20', score: 88 },
  { date: 'MAY 25', score: 90 },
  { date: 'MAY 30', score: 92 },
];

export default function DomainAnalysisPage({ params }: { params: { domain: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const domain = decodeURIComponent(params.domain);

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
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  2
                </span>
              </div>
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
                  <span className="text-4xl font-bold text-white">A</span>
                </div>
                <span className="text-xs text-gray-400 mt-2">GRADE</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{domain}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Live Protection Active
                  </Badge>
                  <span className="text-sm text-gray-400">Last scanned: 2 minutes ago</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">Owner: Security Team A</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-[#224349] bg-[#224349] text-[#8fc3cc] hover:bg-[#2b545c]">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button className="bg-[#07b6d5] hover:brightness-110 text-[#102023] font-semibold shadow-lg shadow-[#07b6d5]/10">
                <RefreshCw className="mr-2 h-4 w-4" />
                Trigger Manual Scan
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
              { id: 'violations', label: 'Violations', icon: AlertTriangle, badge: 12 },
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
                  {tab.badge && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 ml-1">
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Header Scores */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Security Header Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityScores.map((score, index) => {
                  const Icon = score.icon;
                  return (
                    <Card key={index} className="bg-[#162a2e] border-[#224349]">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white mb-1">{score.title}</h3>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${score.iconColor}`} />
                              <span className={`text-sm font-medium ${score.statusColor}`}>
                                {score.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        {score.description && (
                          <p className="text-sm text-gray-400 mb-3">{score.description}</p>
                        )}
                        {score.value && (
                          <p className="text-xs text-gray-300 font-mono mb-3 break-all">
                            {score.value}
                          </p>
                        )}
                        <Progress 
                          value={score.progress} 
                          className={`h-2 ${score.progressColor}`}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* CSP Policy Visualization */}
            <Card className="bg-[#162a2e] border-[#224349]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-[#14b8a6]" />
                    <CardTitle className="text-white">CSP Policy Visualization</CardTitle>
                  </div>
                  <Badge className="bg-[#14b8a6]/20 text-[#14b8a6] border-[#14b8a6]/30">
                    V3 STANDARD
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-[#0d1a1d] rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">
                    <span className="text-gray-500">1</span>
                    <br />
                    <span className="text-gray-500">2</span> default-src 'self';
                    <br />
                    <span className="text-gray-500">3</span> script-src 'self' https://apis.google.com{' '}
                    <span className="text-red-400 bg-red-500/20 px-1 rounded">'unsafe-inline'</span>;
                    <br />
                    <span className="text-gray-500">4</span> style-src 'self' https://fonts.googleapis.com;
                    <br />
                    <span className="text-gray-500">5</span> img-src 'self' data:;
                    <br />
                    <span className="text-gray-500">6</span> frame-ancestors 'none';
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Header-by-Header Analysis */}
            <Card className="bg-[#162a2e] border-[#224349]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Equal className="h-5 w-5 text-[#14b8a6]" />
                  <CardTitle className="text-white">Header-by-Header Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="header-0">
                  {headerAnalysis.map((header, index) => {
                    const StatusIcon = header.statusIcon;
                    return (
                        <AccordionItem
                        key={index}
                        value={`header-${index}`}
                        className="border-white/10"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 flex-1">
                            <StatusIcon className={`h-5 w-5 ${header.statusColor} flex-shrink-0`} />
                            <div className="text-left">
                              <p className="font-semibold text-white">{header.header}</p>
                              <p className="text-sm text-gray-400">{header.description}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {header.issue && (
                            <div className="space-y-4 pt-4">
                              <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
                                <p className="text-sm font-semibold text-red-400 mb-2">
                                  ISSUE FOUND:
                                </p>
                                <p className="text-sm text-gray-300">
                                  {header.issue.text.split(header.issue.highlight).map((part, i, arr) => (
                                    <span key={i}>
                                      {part}
                                      {i < arr.length - 1 && (
                                        <span className="bg-red-500/20 text-red-400 px-1 rounded">
                                          {header.issue.highlight}
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </p>
                              </div>
                              <div className="p-4 bg-blue-500/10 border border-blue-500/40 rounded-lg">
                                <p className="text-sm font-semibold text-blue-400 mb-2">
                                  RECOMMENDATION:
                                </p>
                                <p className="text-sm text-gray-300">{header.recommendation}</p>
                              </div>
                              <div className="p-4 bg-[#0d1a1d] rounded-lg">
                                <p className="text-sm font-semibold text-[#14b8a6] mb-2">
                                  Suggested Fix:
                                </p>
                                <code className="text-sm text-gray-300 font-mono">
                                  {header.suggestedFix}
                                </code>
                              </div>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Real-Time Status */}
            <Card className="bg-[#162a2e] border-[#224349]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#14b8a6] animate-pulse" />
                  <CardTitle className="text-white text-sm uppercase tracking-wider">
                    Real-Time Status
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  Your domain is protected against <span className="text-white font-semibold">98.4%</span> of known injection vectors based on current CSP.
                </p>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Threat blocks (24h)</span>
                    <span className="text-2xl font-bold text-white">1,248</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#14b8a6] rounded-full transition-all"
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-[#162a2e] border-[#224349]">
              <CardHeader>
                <CardTitle className="text-white text-sm uppercase tracking-wider">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  const colorClass = 
                    activity.type === 'success' ? 'text-green-400' :
                    activity.type === 'warning' ? 'text-orange-400' : 'text-red-400';
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${colorClass.replace('text-', 'bg-')}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 text-gray-300 hover:bg-white/5 mt-4"
                >
                  View All Activities
                </Button>
              </CardContent>
            </Card>

            {/* 30-Day Score Trend */}
            <Card className="bg-[#162a2e] border-[#224349]">
              <CardHeader>
                <CardTitle className="text-white text-sm uppercase tracking-wider">
                  30-Day Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#224349" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1f3a', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="score" fill="#07b6d5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#224349] bg-[#0f2023] mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              ShieldCSP Enterprise Edition v2.4
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                API Keys
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
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
