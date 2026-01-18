'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  Filter,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { dummyViolations, dummyViolationPatterns } from '@/lib/data/dummy';
import { useState } from 'react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const severityColors: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-red-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-blue-500 text-white',
};

export default function ViolationsPage() {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [resolvedFilter, setResolvedFilter] = useState<string>('all');

  const filteredViolations = dummyViolations.filter(v => {
    if (severityFilter !== 'all' && v.severity !== severityFilter) return false;
    if (resolvedFilter === 'resolved' && !v.resolvedAt) return false;
    if (resolvedFilter === 'unresolved' && v.resolvedAt) return false;
    return true;
  });

  const severityData = [
    { name: 'Critical', value: dummyViolations.filter(v => v.severity === 'critical').length },
    { name: 'High', value: dummyViolations.filter(v => v.severity === 'high').length },
    { name: 'Medium', value: dummyViolations.filter(v => v.severity === 'medium').length },
    { name: 'Low', value: dummyViolations.filter(v => v.severity === 'low').length },
  ];

  const directiveData = dummyViolations.reduce((acc, v) => {
    const dir = v.violatedDirective || 'unknown';
    acc[dir] = (acc[dir] || 0) + v.violationCount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(directiveData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CSP Violations</h1>
        <p className="text-muted-foreground">
          Monitor and analyze Content Security Policy violation reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Violations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyViolations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dummyViolations.filter(v => v.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unresolved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dummyViolations.filter(v => !v.resolvedAt).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Patterns Detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyViolationPatterns.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Violations by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violations by Directive</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Violation Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Top Violation Patterns</CardTitle>
          <CardDescription>
            Aggregated patterns of recurring violations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyViolationPatterns.map((pattern) => (
              <div key={pattern.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={severityColors[pattern.severity]}>
                        {pattern.severity}
                      </Badge>
                      <span className="font-medium">{pattern.violatedDirective}</span>
                      <span className="text-sm text-muted-foreground">
                        • {pattern.occurrenceCount} occurrences
                      </span>
                    </div>
                    {pattern.blockedUri && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Blocked URI: <code className="bg-muted px-1 rounded">{pattern.blockedUri}</code>
                      </p>
                    )}
                    {pattern.suggestedFix && (
                      <div className="mt-2 p-2 bg-muted rounded">
                        <p className="text-sm font-medium mb-1">Suggested Fix:</p>
                        <p className="text-sm">
                          Add <code>{pattern.suggestedFix.value}</code> to{' '}
                          <code>{pattern.suggestedFix.directive}</code> directive
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Violations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Violations</CardTitle>
              <CardDescription>
                Detailed list of all CSP violation reports
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Directive</TableHead>
                  <TableHead>Blocked URI</TableHead>
                  <TableHead>Document URI</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredViolations.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell>
                      <Badge className={severityColors[violation.severity]}>
                        {violation.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{violation.violatedDirective || '-'}</code>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-muted-foreground">
                        {violation.blockedUri || 'inline'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs">{violation.documentUri}</code>
                    </TableCell>
                    <TableCell>{violation.violationCount}</TableCell>
                    <TableCell>
                      {format(new Date(violation.lastSeenAt), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell>
                      {violation.resolvedAt ? (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          <XCircle className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      )}
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
