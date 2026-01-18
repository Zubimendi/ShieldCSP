// Dummy data generators for development
import type {
  Domain,
  ScanResult,
  SecurityHeader,
  HeaderAnalysis,
  CspAnalysis,
  Violation,
  ViolationPattern,
  XssPayload,
  DashboardSummary,
  TrendPoint,
  Team,
  User,
} from '@/lib/types';

// Generate random grade
export function randomGrade(): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
  const grades: Array<'A+' | 'A' | 'B' | 'C' | 'D' | 'F'> = ['A+', 'A', 'B', 'C', 'D', 'F'];
  return grades[Math.floor(Math.random() * grades.length)];
}

// Generate random score
export function randomScore(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Dummy domains
export const dummyDomains: Domain[] = [
  {
    id: '1',
    teamId: '1',
    url: 'https://example.com',
    name: 'Example Production',
    isActive: true,
    scanFrequency: 'daily',
    notifyOnViolations: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastScannedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    teamId: '1',
    url: 'https://staging.example.com',
    name: 'Example Staging',
    isActive: true,
    scanFrequency: 'daily',
    notifyOnViolations: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastScannedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    teamId: '1',
    url: 'https://app.example.com',
    name: 'Example App',
    isActive: true,
    scanFrequency: 'weekly',
    notifyOnViolations: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastScannedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Dummy scan results
export function generateDummyScan(domainId: string, domainUrl: string): ScanResult {
  const grade = randomGrade();
  const score = grade === 'A+' ? randomScore(95, 100) : 
                grade === 'A' ? randomScore(85, 94) :
                grade === 'B' ? randomScore(75, 84) :
                grade === 'C' ? randomScore(65, 74) :
                grade === 'D' ? randomScore(50, 64) : randomScore(0, 49);

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    domainId,
    domainUrl,
    scanType: 'full',
    status: 'completed',
    overallGrade: grade,
    overallScore: score,
    securityScore: score,
    headersDetected: {
      'Content-Security-Policy': {
        present: true,
        value: "default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self' 'nonce-abc123'",
      },
      'Strict-Transport-Security': {
        present: true,
        value: 'max-age=31536000; includeSubDomains',
      },
      'X-Frame-Options': {
        present: true,
        value: 'DENY',
      },
      'X-Content-Type-Options': {
        present: true,
        value: 'nosniff',
      },
    },
    cspPolicy: "default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self' 'nonce-abc123'",
    cspGrade: grade,
    cspIssues: grade !== 'A+' && grade !== 'A' ? [
      {
        directive: 'script-src',
        severity: 'medium',
        message: 'Consider using strict-dynamic for better CSP compatibility',
        fix: "Add 'strict-dynamic' to script-src directive",
      },
    ] : [],
    xssVulnerabilities: [],
    scanDurationMs: randomScore(500, 2000),
    scannedAt: new Date().toISOString(),
  };
}

// Dummy security headers
export function generateDummyHeaders(): SecurityHeader[] {
  return [
    {
      name: 'Content-Security-Policy',
      isPresent: true,
      value: "default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self' 'nonce-abc123'",
      score: 95,
      grade: 'A+',
      issues: [],
      recommendations: ['Consider adding strict-dynamic for better compatibility'],
    },
    {
      name: 'Strict-Transport-Security',
      isPresent: true,
      value: 'max-age=31536000; includeSubDomains',
      score: 100,
      grade: 'A+',
      issues: [],
      recommendations: [],
    },
    {
      name: 'X-Frame-Options',
      isPresent: true,
      value: 'DENY',
      score: 100,
      grade: 'A+',
      issues: [],
      recommendations: [],
    },
    {
      name: 'X-Content-Type-Options',
      isPresent: true,
      value: 'nosniff',
      score: 100,
      grade: 'A+',
      issues: [],
      recommendations: [],
    },
    {
      name: 'Referrer-Policy',
      isPresent: true,
      value: 'strict-origin-when-cross-origin',
      score: 90,
      grade: 'A',
      issues: [],
      recommendations: [],
    },
    {
      name: 'Permissions-Policy',
      isPresent: false,
      score: 0,
      grade: 'F',
      issues: ['Header is missing'],
      recommendations: ['Add Permissions-Policy header to restrict browser features'],
    },
    {
      name: 'Cross-Origin-Embedder-Policy',
      isPresent: false,
      score: 0,
      grade: 'F',
      issues: ['Header is missing'],
      recommendations: ['Add COEP header for additional isolation'],
    },
  ];
}

// Dummy violations
export const dummyViolations: Violation[] = [
  {
    id: '1',
    domainId: '1',
    documentUri: 'https://example.com/page',
    blockedUri: 'https://cdn.example.com/script.js',
    violatedDirective: 'script-src',
    effectiveDirective: 'script-src',
    originalPolicy: "default-src 'self'; script-src 'self'",
    disposition: 'enforce',
    sourceFile: 'https://example.com/page',
    lineNumber: 42,
    columnNumber: 15,
    violationCount: 15,
    firstSeenAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeenAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    severity: 'high',
    isFalsePositive: false,
  },
  {
    id: '2',
    domainId: '1',
    documentUri: 'https://example.com/dashboard',
    blockedUri: 'https://analytics.example.com/track.js',
    violatedDirective: 'script-src',
    effectiveDirective: 'script-src',
    originalPolicy: "default-src 'self'; script-src 'self'",
    disposition: 'enforce',
    sourceFile: 'https://example.com/dashboard',
    lineNumber: 10,
    columnNumber: 5,
    violationCount: 8,
    firstSeenAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastSeenAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    severity: 'medium',
    isFalsePositive: false,
  },
  {
    id: '3',
    domainId: '1',
    documentUri: 'https://example.com/blog',
    blockedUri: 'inline',
    violatedDirective: 'style-src',
    effectiveDirective: 'style-src',
    originalPolicy: "default-src 'self'; style-src 'self'",
    disposition: 'enforce',
    sourceFile: 'https://example.com/blog',
    lineNumber: 25,
    columnNumber: 12,
    violationCount: 3,
    firstSeenAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastSeenAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'low',
    isFalsePositive: false,
  },
];

// Dummy violation patterns
export const dummyViolationPatterns: ViolationPattern[] = [
  {
    id: '1',
    domainId: '1',
    violatedDirective: 'script-src',
    blockedUri: 'https://cdn.example.com/script.js',
    occurrenceCount: 15,
    firstOccurrence: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastOccurrence: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    severity: 'high',
    suggestedFix: {
      action: 'Add to CSP',
      directive: 'script-src',
      value: 'https://cdn.example.com',
    },
  },
  {
    id: '2',
    domainId: '1',
    violatedDirective: 'script-src',
    blockedUri: 'https://analytics.example.com/track.js',
    occurrenceCount: 8,
    firstOccurrence: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastOccurrence: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    severity: 'medium',
    suggestedFix: {
      action: 'Add to CSP',
      directive: 'script-src',
      value: 'https://analytics.example.com',
    },
  },
];

// Dummy XSS payloads
export const dummyXssPayloads: XssPayload[] = [
  {
    id: '1',
    name: 'Basic Script Tag',
    payload: '<script>alert(1)</script>',
    category: 'Classic',
    difficulty: 'beginner',
    description: 'Basic XSS payload using script tag',
    bypasses: ['unsafe-inline', 'no CSP'],
  },
  {
    id: '2',
    name: 'Image Tag with Error Handler',
    payload: '<img src=x onerror=alert(1)>',
    category: 'Event Handlers',
    difficulty: 'beginner',
    description: 'XSS using image error event',
    bypasses: ['unsafe-inline', 'img-src *'],
  },
  {
    id: '3',
    name: 'SVG with Script',
    payload: '<svg><script>alert(1)</script></svg>',
    category: 'SVG',
    difficulty: 'intermediate',
    description: 'XSS using SVG element',
    bypasses: ['unsafe-inline', 'no CSP'],
  },
  {
    id: '4',
    name: 'JavaScript Protocol',
    payload: '<a href="javascript:alert(1)">Click</a>',
    category: 'Protocol',
    difficulty: 'beginner',
    description: 'XSS using javascript: protocol',
    bypasses: ['no CSP', 'unsafe-inline'],
  },
  {
    id: '5',
    name: 'Polyglot Payload',
    payload: 'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//><x>',
    category: 'Polyglot',
    difficulty: 'advanced',
    description: 'Complex polyglot payload that works in multiple contexts',
    bypasses: ['weak CSP', 'unsafe-inline'],
  },
];

// Dummy dashboard summary
export function generateDummySummary(): DashboardSummary {
  const days = 30;
  const trend: TrendPoint[] = [];
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    trend.push({
      date: date.toISOString(),
      score: randomScore(75, 95),
      grade: randomGrade(),
    });
  }

  return {
    totalDomains: 3,
    averageGrade: 'A',
    averageScore: 87,
    criticalViolations: 1,
    recentScans: dummyDomains.map(domain => generateDummyScan(domain.id, domain.url)),
    scoreTrend: trend,
  };
}

// Dummy team
export const dummyTeam: Team = {
  id: '1',
  name: 'My Team',
  slug: 'my-team',
  plan: 'pro',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

// Dummy user
export const dummyUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  emailVerified: true,
};
