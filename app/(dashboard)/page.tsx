'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  AlertTriangle, 
  Zap,
  TrendingUp,
  Download,
  ExternalLink
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Grade distribution data
const gradeDistribution = [
  { name: 'A - Excellent', value: 42, color: '#14b8a6' },
  { name: 'B - Good', value: 56, color: '#3b82f6' },
  { name: 'C - Fair', value: 18, color: '#6b7280' },
  { name: 'F - Critical', value: 8, color: '#ef4444' },
];

// Security score trend data
const scoreTrend = [
  { week: 'WEEK 1', score: 75 },
  { week: 'WEEK 2', score: 78 },
  { week: 'WEEK 3', score: 82 },
  { week: 'WEEK 4', score: 88 },
];

// Recent scans data
const recentScans = [
  {
    domain: 'api.enterprise.shield.com',
    environment: 'Production',
    lastScan: '2 mins ago',
    status: 'HEALTHY',
    grade: 'A+',
    score: 98,
    maxScore: 100,
  },
  {
    domain: 'app.enterprise.shield.com',
    environment: 'Production',
    lastScan: '15 mins ago',
    status: 'HEALTHY',
    grade: 'A',
    score: 92,
    maxScore: 100,
  },
  {
    domain: 'staging.enterprise.shield.com',
    environment: 'Staging',
    lastScan: '1 hour ago',
    status: 'WARNING',
    grade: 'B+',
    score: 85,
    maxScore: 100,
  },
  {
    domain: 'dev.enterprise.shield.com',
    environment: 'Development',
    lastScan: '2 hours ago',
    status: 'CRITICAL',
    grade: 'C',
    score: 65,
    maxScore: 100,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0f2023] p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Security Posture</h1>
        <p className="text-gray-400 mt-1">
          Real-time monitoring across your enterprise ecosystem.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Domains */}
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Domains</p>
                <p className="text-3xl font-bold text-white">124</p>
                <p className="text-sm text-green-400 mt-1">+4%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Grade */}
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Average Grade</p>
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-400">B+</span>
                  </div>
                  <p className="text-sm text-gray-400">Post-remediation target: A-</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Violations */}
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    CRITICAL
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-sm text-gray-400 mt-1">Active Violations</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scans Today */}
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Scans Today</p>
                <p className="text-3xl font-bold text-white">1,402</p>
                <p className="text-sm text-gray-400 mt-1">Target: 2k</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Data Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardHeader>
            <CardTitle className="text-white">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-400 text-center mb-4">124 SITES</p>
              <div className="grid grid-cols-2 gap-2">
                {gradeDistribution.map((grade, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: grade.color }}
                    />
                    <span className="text-sm text-gray-300">{grade.name}: {grade.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Score Trend */}
        <Card className="bg-[#162a2e] border-[#224349]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Security Score Trend</CardTitle>
                <CardDescription className="text-gray-400">
                  Post-scan analysis for 30-day interval.
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">88/100</p>
                <p className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +5%
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
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
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans Table */}
      <Card className="bg-[#162a2e] border-[#224349]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Scans</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5">
                View All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#224349]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-400">DOMAIN NAME</TableHead>
                  <TableHead className="text-gray-400">LAST SCAN</TableHead>
                  <TableHead className="text-gray-400">STATUS</TableHead>
                  <TableHead className="text-gray-400">GRADE</TableHead>
                  <TableHead className="text-gray-400">SCORE</TableHead>
                  <TableHead className="text-gray-400">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentScans.map((scan, index) => (
                  <TableRow key={index} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{scan.domain}</p>
                        <p className="text-sm text-gray-400">{scan.environment}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{scan.lastScan}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          scan.status === 'HEALTHY'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : scan.status === 'WARNING'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }
                      >
                        {scan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {scan.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {scan.score}/{scan.maxScore}
                          </span>
                        </div>
                        <Progress 
                          value={(scan.score / scan.maxScore) * 100} 
                          className="h-2 w-24"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
