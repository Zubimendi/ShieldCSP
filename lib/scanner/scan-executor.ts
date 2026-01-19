/**
 * Scan Executor
 * Orchestrates the complete security scan process
 */

import { fetchSecurityHeaders } from './fetch-headers';
import { analyzeSecurityHeaders, HeaderAnalysisResult } from './header-analyzer';
import { parseCSP, CSPPolicy } from './csp-parser';
import { prisma } from '@/lib/prisma';

export interface ScanResult {
  success: boolean;
  domainId: string;
  scanId?: string;
  headers?: Record<string, string>;
  analysis?: HeaderAnalysisResult;
  cspPolicy?: CSPPolicy;
  error?: string;
  durationMs?: number;
}

/**
 * Executes a security scan for a domain
 */
export async function executeScan(
  domainId: string,
  scanType: 'full' | 'quick' | 'headers-only' = 'full'
): Promise<ScanResult> {
  const startTime = Date.now();

  try {
    // Fetch domain from database
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: { team: true },
    });

    if (!domain) {
      return {
        success: false,
        domainId,
        error: 'Domain not found',
      };
    }

    // Fetch headers
    const fetchResult = await fetchSecurityHeaders(domain.url, {
      timeout: 15000,
      followRedirects: true,
      maxRedirects: 5,
    });

    if (!fetchResult.success) {
      return {
        success: false,
        domainId,
        error: fetchResult.error || 'Failed to fetch headers',
      };
    }

    // Analyze headers
    const analysis = analyzeSecurityHeaders(fetchResult.headers);

    // Parse CSP if present
    let cspPolicy: CSPPolicy | undefined;
    const cspHeader = fetchResult.headers['content-security-policy'] || 
                     fetchResult.headers['Content-Security-Policy'];
    if (cspHeader) {
      cspPolicy = parseCSP(cspHeader);
    }

    // Create scan record in database
    const scan = await prisma.scan.create({
      data: {
        domainId: domain.id,
        scanType,
        status: 'completed',
        overallGrade: analysis.overallGrade,
        overallScore: analysis.overallScore,
        headersDetected: fetchResult.headers as any,
        securityScore: analysis.overallScore,
        cspPolicy: cspPolicy?.raw || null,
        cspGrade: cspPolicy?.grade || null,
        cspIssues: cspPolicy ? {
          issues: cspPolicy.issues,
          recommendations: cspPolicy.recommendations,
          missingDirectives: cspPolicy.missingDirectives,
          hasUnsafeInline: cspPolicy.hasUnsafeInline,
          hasUnsafeEval: cspPolicy.hasUnsafeEval,
        } : null,
        rawHeaders: fetchResult.headers as any,
        scanDurationMs: Date.now() - startTime,
        scannedAt: new Date(),
      },
    });

    // Create SecurityScore records for each header analyzed
    const securityScores = analysis.headers.map(header => ({
      scanId: scan.id,
      headerName: header.name,
      isPresent: header.isPresent,
      headerValue: header.value,
      score: header.score,
      grade: header.grade,
      issues: header.issues,
      recommendations: header.recommendations,
    }));

    await prisma.securityScore.createMany({
      data: securityScores,
    });

    // Update domain's lastScannedAt
    await prisma.domain.update({
      where: { id: domain.id },
      data: { lastScannedAt: new Date() },
    });

    const durationMs = Date.now() - startTime;

    return {
      success: true,
      domainId,
      scanId: scan.id,
      headers: fetchResult.headers,
      analysis,
      cspPolicy,
      durationMs,
    };
  } catch (error: any) {
    // Create failed scan record
    try {
      await prisma.scan.create({
        data: {
          domainId,
          scanType,
          status: 'failed',
          errorMessage: error.message || 'Unknown error',
          scanDurationMs: Date.now() - startTime,
        },
      });
    } catch (dbError) {
      // Ignore DB errors if we can't save the failed scan
    }

    return {
      success: false,
      domainId,
      error: error.message || 'Unknown error occurred',
      durationMs: Date.now() - startTime,
    };
  }
}
