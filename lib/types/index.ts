// Core Type Definitions for ShieldCSP

export type SecurityGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export type ScanType = 'full' | 'quick' | 'headers-only';

export type ViolationSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ScanFrequency = 'hourly' | 'daily' | 'weekly' | 'manual';

export type Framework = 'nextjs-app' | 'nextjs-pages' | 'express' | 'generic';

export type CspType = 'nonce' | 'hash' | 'strict-dynamic';

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export type Plan = 'free' | 'pro' | 'enterprise';

// Security Header Analysis
export interface SecurityHeader {
  name: string;
  isPresent: boolean;
  value?: string;
  score: number;
  grade: SecurityGrade;
  issues: string[];
  recommendations: string[];
}

export interface HeaderAnalysis {
  headers: SecurityHeader[];
  overallScore: number;
  overallGrade: SecurityGrade;
  missingHeaders: string[];
  weakHeaders: string[];
}

// CSP Analysis
export interface CspDirective {
  name: string;
  value: string[];
  hasUnsafeInline: boolean;
  hasUnsafeEval: boolean;
  hasWildcard: boolean;
  hasNonce: boolean;
  hasHash: boolean;
  hasStrictDynamic: boolean;
}

export interface CspAnalysis {
  policy: string;
  directives: CspDirective[];
  grade: SecurityGrade;
  score: number;
  issues: CspIssue[];
  bypasses: CspBypass[];
  suggestions: string[];
}

export interface CspIssue {
  directive: string;
  severity: ViolationSeverity;
  message: string;
  fix: string;
}

export interface CspBypass {
  technique: string;
  description: string;
  example: string;
}

// Scan Results
export interface ScanResult {
  id: string;
  domainId: string;
  domainUrl: string;
  scanType: ScanType;
  status: ScanStatus;
  overallGrade: SecurityGrade;
  overallScore: number;
  securityScore: number;
  headersDetected: Record<string, any>;
  cspPolicy?: string;
  cspGrade?: SecurityGrade;
  cspIssues?: CspIssue[];
  xssVulnerabilities?: XssVulnerability[];
  scanDurationMs: number;
  scannedAt: string;
  errorMessage?: string;
}

export interface XssVulnerability {
  type: string;
  location: string;
  payload: string;
  severity: ViolationSeverity;
  description: string;
}

// Domain
export interface Domain {
  id: string;
  teamId: string;
  url: string;
  name: string;
  isActive: boolean;
  scanFrequency: ScanFrequency;
  notifyOnViolations: boolean;
  createdAt: string;
  lastScannedAt?: string;
  latestScan?: ScanResult;
}

// Violation
export interface Violation {
  id: string;
  domainId: string;
  documentUri: string;
  blockedUri?: string;
  violatedDirective?: string;
  effectiveDirective?: string;
  originalPolicy?: string;
  disposition?: string;
  referrer?: string;
  sourceFile?: string;
  lineNumber?: number;
  columnNumber?: number;
  statusCode?: number;
  userAgent?: string;
  violationCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  severity: ViolationSeverity;
  isFalsePositive: boolean;
  notes?: string;
  resolvedAt?: string;
}

export interface ViolationPattern {
  id: string;
  domainId: string;
  violatedDirective?: string;
  blockedUri?: string;
  occurrenceCount: number;
  firstOccurrence: string;
  lastOccurrence: string;
  severity: ViolationSeverity;
  suggestedFix?: any;
}

// XSS Test
export interface XssTest {
  id: string;
  payload: string;
  cspPolicy?: string;
  sanitizer?: 'none' | 'dompurify' | 'custom';
  context: 'html' | 'attribute' | 'javascript' | 'url';
  wasBlocked?: boolean;
  executedSuccessfully?: boolean;
  sanitizedOutput?: string;
  violationTriggered?: boolean;
  testName?: string;
  createdAt: string;
}

export interface XssPayload {
  id: string;
  name: string;
  payload: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  bypasses: string[];
}

// Code Generation
export interface CodeGenOptions {
  framework: Framework;
  cspType: CspType;
  headers: SecurityHeaderConfig;
  options: {
    enableHsts: boolean;
    hstsMaxAge: number;
    enableFrameOptions: boolean;
    frameOptions: 'DENY' | 'SAMEORIGIN';
    enableContentTypeOptions: boolean;
    enableReferrerPolicy: boolean;
    referrerPolicy: string;
    enablePermissionsPolicy: boolean;
    permissionsPolicy: Record<string, string[]>;
  };
}

export interface SecurityHeaderConfig {
  csp: {
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    imgSrc: string[];
    fontSrc: string[];
    connectSrc: string[];
    frameSrc: string[];
    objectSrc: string[];
    baseUri: string[];
    formAction: string[];
    frameAncestors: string[];
    upgradeInsecureRequests: boolean;
    blockAllMixedContent: boolean;
  };
}

export interface GeneratedCode {
  code: string;
  filename: string;
  instructions: string[];
  preview: {
    headers: Record<string, string>;
  };
}

// Analytics
export interface TrendPoint {
  date: string;
  score: number;
  grade: SecurityGrade;
}

export interface DashboardSummary {
  totalDomains: number;
  averageGrade: SecurityGrade;
  averageScore: number;
  criticalViolations: number;
  recentScans: ScanResult[];
  scoreTrend: TrendPoint[];
}

// Team
export interface Team {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

// User
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  emailVerified: boolean;
}
