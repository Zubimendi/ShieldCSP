'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Scan, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Download,
  ExternalLink
} from 'lucide-react';
import { generateDummyScan, generateDummyHeaders } from '@/lib/data/dummy';
import type { ScanResult, SecurityHeader } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const gradeColors: Record<string, string> = {
  'A+': 'bg-green-500 text-white',
  'A': 'bg-green-400 text-white',
  'B': 'bg-yellow-400 text-white',
  'C': 'bg-orange-400 text-white',
  'D': 'bg-red-400 text-white',
  'F': 'bg-red-600 text-white',
};

export default function ScannerPage() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [headers, setHeaders] = useState<SecurityHeader[]>([]);

  const handleScan = async () => {
    if (!url || scanning) return;

    setScanning(true);
    setScanResult(null);
    setHeaders([]);

    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = generateDummyScan('1', url);
    const headerAnalysis = generateDummyHeaders();

    setScanResult(result);
    setHeaders(headerAnalysis);
    setScanning(false);
  };

  const exportResults = () => {
    if (!scanResult) return;
    const data = {
      scan: scanResult,
      headers,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shieldcsp-scan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Scanner</h1>
        <p className="text-muted-foreground">
          Analyze HTTP security headers and CSP policies for any domain
        </p>
      </div>

      {/* Scanner Input */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Domain</CardTitle>
          <CardDescription>
            Enter a URL to analyze security headers and detect XSS vulnerabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                disabled={scanning}
              />
              <Button onClick={handleScan} disabled={scanning || !url}>
                {scanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-4 w-4" />
                    Scan
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <div className="space-y-6">
          {/* Overall Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scan Results</CardTitle>
                  <CardDescription>
                    Security analysis for {scanResult.domainUrl}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={exportResults}>
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Grade */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Security Grade</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={`${gradeColors[scanResult.overallGrade]} text-lg px-4 py-2`}>
                      {scanResult.overallGrade}
                    </Badge>
                    <div>
                      <p className="text-3xl font-bold">{scanResult.overallScore}</p>
                      <p className="text-sm text-muted-foreground">out of 100</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-2">
                    {scanResult.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Completed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="font-medium">Failed</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Score Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Security Score</span>
                  <span>{scanResult.overallScore}%</span>
                </div>
                <Progress value={scanResult.overallScore} className="h-2" />
              </div>

              {/* CSP Policy */}
              {scanResult.cspPolicy && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Content Security Policy</p>
                  <div className="p-4 bg-muted rounded-md font-mono text-sm break-all">
                    {scanResult.cspPolicy}
                  </div>
                  {scanResult.cspGrade && (
                    <div className="flex items-center gap-2">
                      <Badge className={gradeColors[scanResult.cspGrade]}>
                        CSP Grade: {scanResult.cspGrade}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Headers Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Security Headers Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of each security header
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {headers.map((header, index) => (
                  <AccordionItem key={index} value={`header-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-4 flex-1">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">{header.name}</span>
                        <Badge className={gradeColors[header.grade]}>
                          {header.grade}
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {header.score}/100
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Status</p>
                        <div className="flex items-center gap-2">
                          {header.isPresent ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>Present</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span>Missing</span>
                            </>
                          )}
                        </div>
                      </div>

                      {header.value && (
                        <div>
                          <p className="text-sm font-medium mb-2">Value</p>
                          <div className="p-3 bg-muted rounded-md font-mono text-xs break-all">
                            {header.value}
                          </div>
                        </div>
                      )}

                      {header.issues.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Issues</p>
                          <ul className="space-y-1">
                            {header.issues.map((issue, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {header.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Recommendations</p>
                          <ul className="space-y-1">
                            {header.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* CSP Issues */}
          {scanResult.cspIssues && scanResult.cspIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  CSP Issues Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanResult.cspIssues.map((issue, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="destructive">{issue.severity}</Badge>
                            <span className="font-medium">{issue.directive}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {issue.message}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Fix: </span>
                            {issue.fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
