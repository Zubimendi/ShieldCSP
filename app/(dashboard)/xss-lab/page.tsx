'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FlaskConical,
  Play,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen
} from 'lucide-react';
import { dummyXssPayloads } from '@/lib/data/dummy';
import type { XssPayload } from '@/lib/types';

export default function XssLabPage() {
  const [selectedPayload, setSelectedPayload] = useState<XssPayload | null>(null);
  const [customPayload, setCustomPayload] = useState('');
  const [cspPolicy, setCspPolicy] = useState("default-src 'self'; script-src 'self'");
  const [sanitizer, setSanitizer] = useState<'none' | 'dompurify'>('none');
  const [context, setContext] = useState<'html' | 'attribute' | 'javascript' | 'url'>('html');
  const [testResult, setTestResult] = useState<{
    wasBlocked: boolean;
    executedSuccessfully: boolean;
    sanitizedOutput?: string;
    violationTriggered: boolean;
    explanation: string;
  } | null>(null);

  const handleTest = () => {
    const payload = selectedPayload?.payload || customPayload;
    if (!payload) return;

    // Simulate CSP blocking
    const hasUnsafeInline = cspPolicy.includes("'unsafe-inline'") || cspPolicy.includes('*');
    const hasScriptSrc = cspPolicy.includes('script-src');
    const wasBlocked = !hasUnsafeInline && hasScriptSrc && payload.includes('<script>');

    // Simulate sanitization
    let sanitizedOutput = payload;
    if (sanitizer === 'dompurify' && typeof window !== 'undefined') {
      // Dynamically import DOMPurify only in browser
      const DOMPurify = require('dompurify');
      sanitizedOutput = DOMPurify.sanitize(payload);
    }

    // Check if execution would succeed
    const executedSuccessfully = !wasBlocked && sanitizedOutput === payload && 
                                 (payload.includes('<script>') || payload.includes('onerror') || payload.includes('onclick'));

    const violationTriggered = !hasUnsafeInline && payload.includes('inline');

    let explanation = '';
    if (wasBlocked) {
      explanation = '✅ This payload was blocked by your Content Security Policy. The CSP prevented the execution of inline scripts.';
    } else if (sanitizer === 'dompurify' && sanitizedOutput !== payload) {
      explanation = '✅ This payload was sanitized by DOMPurify. Dangerous HTML and event handlers were removed.';
    } else if (executedSuccessfully) {
      explanation = '⚠️ WARNING: This payload would execute successfully! Your current CSP or sanitization is not protecting against this XSS vector.';
    } else {
      explanation = 'ℹ️ This payload was processed but did not execute. Review your CSP policy and sanitization settings.';
    }

    setTestResult({
      wasBlocked,
      executedSuccessfully,
      sanitizedOutput,
      violationTriggered,
      explanation,
    });
  };

  const getResultColor = () => {
    if (!testResult) return '';
    if (testResult.wasBlocked || (testResult.sanitizedOutput && testResult.sanitizedOutput !== (selectedPayload?.payload || customPayload))) {
      return 'text-green-600';
    }
    if (testResult.executedSuccessfully) {
      return 'text-red-600';
    }
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">XSS Testing Laboratory</h1>
        <p className="text-muted-foreground">
          Test XSS payloads against different CSP policies and sanitizers
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Test Configuration
            </CardTitle>
            <CardDescription>
              Configure your test environment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CSP Policy */}
            <div className="space-y-2">
              <Label>Content Security Policy</Label>
              <Textarea
                value={cspPolicy}
                onChange={(e) => setCspPolicy(e.target.value)}
                placeholder="default-src 'self'; script-src 'self'"
                className="font-mono text-sm"
                rows={3}
              />
            </div>

            {/* Sanitizer */}
            <div className="space-y-2">
              <Label>HTML Sanitizer</Label>
              <Select value={sanitizer} onValueChange={(v) => setSanitizer(v as 'none' | 'dompurify')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="dompurify">DOMPurify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Context */}
            <div className="space-y-2">
              <Label>Injection Context</Label>
              <Select value={context} onValueChange={(v) => setContext(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML Context</SelectItem>
                  <SelectItem value="attribute">Attribute Context</SelectItem>
                  <SelectItem value="javascript">JavaScript Context</SelectItem>
                  <SelectItem value="url">URL Context</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleTest} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Run Test
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Analysis of payload execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <div className="flex items-center gap-2">
                      {testResult.wasBlocked ? (
                        <>
                          <Shield className={`h-5 w-5 ${getResultColor()}`} />
                          <span className="font-medium">Blocked by CSP</span>
                        </>
                      ) : testResult.executedSuccessfully ? (
                        <>
                          <AlertTriangle className={`h-5 w-5 ${getResultColor()}`} />
                          <span className="font-medium">Executed Successfully</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className={`h-5 w-5 ${getResultColor()}`} />
                          <span className="font-medium">Safe</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Explanation</p>
                  <p className={`text-sm ${getResultColor()}`}>
                    {testResult.explanation}
                  </p>
                </div>

                {testResult.sanitizedOutput && testResult.sanitizedOutput !== (selectedPayload?.payload || customPayload) && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sanitized Output</p>
                    <div className="p-3 bg-muted rounded-md font-mono text-xs break-all">
                      {testResult.sanitizedOutput}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">CSP Blocked</p>
                    <p className="text-lg font-semibold">
                      {testResult.wasBlocked ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sanitized</p>
                    <p className="text-lg font-semibold">
                      {testResult.sanitizedOutput && testResult.sanitizedOutput !== (selectedPayload?.payload || customPayload) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your test and run it to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payload Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            XSS Payload Library
          </CardTitle>
          <CardDescription>
            Select a payload from the library or enter your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="library" className="w-full">
            <TabsList>
              <TabsTrigger value="library">Payload Library</TabsTrigger>
              <TabsTrigger value="custom">Custom Payload</TabsTrigger>
            </TabsList>
            <TabsContent value="library" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {dummyXssPayloads.map((payload) => (
                  <Card
                    key={payload.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPayload?.id === payload.id
                        ? 'border-primary bg-accent'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => {
                      setSelectedPayload(payload);
                      setCustomPayload('');
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{payload.name}</CardTitle>
                        <Badge variant="outline">{payload.difficulty}</Badge>
                      </div>
                      <CardDescription>{payload.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {payload.description}
                      </p>
                      <code className="text-xs bg-muted p-2 rounded block break-all">
                        {payload.payload}
                      </code>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-2">
                <Label>Custom XSS Payload</Label>
                <Textarea
                  value={customPayload}
                  onChange={(e) => {
                    setCustomPayload(e.target.value);
                    setSelectedPayload(null);
                  }}
                  placeholder="<script>alert(1)</script>"
                  className="font-mono text-sm"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your own XSS payload to test
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {selectedPayload && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Selected Payload</p>
              <code className="text-xs break-all">{selectedPayload.payload}</code>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
